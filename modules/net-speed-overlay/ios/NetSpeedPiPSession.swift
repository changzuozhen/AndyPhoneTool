import AVFoundation
import AVKit
import UIKit

enum NetSpeedPiPError: LocalizedError {
  case unsupported
  case noWindow
  case notPossible
  case startFailed

  var errorDescription: String? {
    switch self {
    case .unsupported:
      return "当前设备不支持画中画"
    case .noWindow:
      return "无法获取应用窗口"
    case .notPossible:
      return "画中画暂不可用，请稍后重试"
    case .startFailed:
      return "启动画中画失败"
    }
  }
}

final class NetSpeedPiPSession: NSObject {
  static let shared = NetSpeedPiPSession()

  private let monitor = NetSpeedMonitor()
  private let renderer = SpeedFrameRenderer()

  private var displayView: SpeedPiPView?
  private var pipController: AVPictureInPictureController?
  private var pollTimer: Timer?
  private var heartbeatTimer: Timer?

  private var lastSampleBuffer: CMSampleBuffer?
  private var frameIndex: Int64 = 0
  private var lastFrameAt = Date.distantPast

  private(set) var isActive = false

  private override init() {
    super.init()
  }

  func start() throws {
    guard AVPictureInPictureController.isPictureInPictureSupported() else {
      throw NetSpeedPiPError.unsupported
    }

    if isActive {
      return
    }

    try configureAudioSession()
    try setupDisplayView()
    try setupPiPController()

    enqueueFrame(downloadBps: 0, uploadBps: 0)

    guard pipController?.isPictureInPicturePossible == true else {
      cleanupSession(resetActive: false)
      throw NetSpeedPiPError.notPossible
    }

    pipController?.startPictureInPicture()
    isActive = true
    startTimers()
  }

  func stop() {
    pollTimer?.invalidate()
    heartbeatTimer?.invalidate()
    pollTimer = nil
    heartbeatTimer = nil

    pipController?.stopPictureInPicture()
    cleanupSession(resetActive: true)

    try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
  }

  private func configureAudioSession() throws {
    let session = AVAudioSession.sharedInstance()
    try session.setCategory(.playback, mode: .moviePlayback, options: [])
    try session.setActive(true)
  }

  private func setupDisplayView() throws {
    guard let window = Self.keyWindow() else {
      throw NetSpeedPiPError.noWindow
    }

    let view = SpeedPiPView(frame: CGRect(x: 0, y: 0, width: 320, height: 96))
    view.alpha = 0.01
    view.isUserInteractionEnabled = false
    window.addSubview(view)
    displayView = view
  }

  private func setupPiPController() throws {
    guard let displayLayer = displayView?.sampleBufferDisplayLayer else {
      throw NetSpeedPiPError.noWindow
    }

    let contentSource = AVPictureInPictureController.ContentSource(
      sampleBufferDisplayLayer: displayLayer,
      playbackDelegate: self
    )

    let controller = AVPictureInPictureController(contentSource: contentSource)
    controller.delegate = self
    controller.canStartPictureInPictureAutomaticallyFromInline = true
    pipController = controller
  }

  private func startTimers() {
    pollTimer?.invalidate()
    heartbeatTimer?.invalidate()

    pollTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
      self?.pollSpeed()
    }

    heartbeatTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
      self?.heartbeat()
    }
  }

  private func pollSpeed() {
    let sample = monitor.sample()
    enqueueFrame(downloadBps: sample.downloadBps, uploadBps: sample.uploadBps)
  }

  private func heartbeat() {
    guard Date().timeIntervalSince(lastFrameAt) >= 0.45, let lastSampleBuffer else {
      return
    }

    enqueue(sampleBuffer: lastSampleBuffer)
  }

  private func enqueueFrame(downloadBps: Int64, uploadBps: Int64) {
    guard let sampleBuffer = renderer.makeSampleBuffer(
      downloadBps: downloadBps,
      uploadBps: uploadBps,
      frameIndex: frameIndex
    ) else {
      return
    }

    frameIndex += 1
    lastSampleBuffer = sampleBuffer
    enqueue(sampleBuffer: sampleBuffer)
  }

  private func enqueue(sampleBuffer: CMSampleBuffer) {
    guard let displayLayer = displayView?.sampleBufferDisplayLayer else {
      return
    }

    if #available(iOS 17.0, *) {
      displayLayer.sampleBufferRenderer.enqueue(sampleBuffer)
    } else {
      displayLayer.enqueue(sampleBuffer)
    }

    lastFrameAt = Date()
  }

  private func cleanupSession(resetActive: Bool) {
    displayView?.removeFromSuperview()
    displayView = nil
    pipController = nil
    lastSampleBuffer = nil
    frameIndex = 0
    lastFrameAt = .distantPast

    if resetActive {
      isActive = false
    }
  }

  private static func keyWindow() -> UIWindow? {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .first(where: \.isKeyWindow)
  }
}

extension NetSpeedPiPSession: AVPictureInPictureSampleBufferPlaybackDelegate {
  func pictureInPictureController(
    _ pictureInPictureController: AVPictureInPictureController,
    setPlaying playing: Bool
  ) {}

  func pictureInPictureControllerTimeRangeForPlayback(
    _ pictureInPictureController: AVPictureInPictureController
  ) -> CMTimeRange {
    CMTimeRange(start: .zero, duration: .positiveInfinity)
  }

  func pictureInPictureControllerIsPlaybackPaused(
    _ pictureInPictureController: AVPictureInPictureController
  ) -> Bool {
    false
  }

  func pictureInPictureController(
    _ pictureInPictureController: AVPictureInPictureController,
    didTransitionToRenderSize newRenderSize: CMVideoDimensions
  ) {}

  func pictureInPictureController(
    _ pictureInPictureController: AVPictureInPictureController,
    skipByInterval skipInterval: CMTime
  ) async {}
}

extension NetSpeedPiPSession: AVPictureInPictureControllerDelegate {
  func pictureInPictureControllerDidStopPictureInPicture(
    _ pictureInPictureController: AVPictureInPictureController
  ) {
    pollTimer?.invalidate()
    heartbeatTimer?.invalidate()
    pollTimer = nil
    heartbeatTimer = nil
    cleanupSession(resetActive: true)
    try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
  }

  func pictureInPictureController(
    _ pictureInPictureController: AVPictureInPictureController,
    restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: @escaping (Bool) -> Void
  ) {
    completionHandler(true)
  }
}
