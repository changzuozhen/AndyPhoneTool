import CoreMedia
import CoreVideo
import UIKit

final class SpeedFrameRenderer {
  private let width = 360
  private let height = 56

  func makeSampleBuffer(downloadBps: Int64, uploadBps: Int64, frameIndex: Int64) -> CMSampleBuffer? {
    guard let pixelBuffer = makePixelBuffer(
      downloadText: "↓ \(NetSpeedFormatter.format(bytesPerSecond: downloadBps))",
      uploadText: "↑ \(NetSpeedFormatter.format(bytesPerSecond: uploadBps))"
    ) else {
      return nil
    }

    var formatDescription: CMFormatDescription?
    let status = CMVideoFormatDescriptionCreateForImageBuffer(
      allocator: kCFAllocatorDefault,
      imageBuffer: pixelBuffer,
      formatDescriptionOut: &formatDescription
    )

    guard status == noErr, let formatDescription else {
      return nil
    }

    var timing = CMSampleTimingInfo(
      duration: CMTime(value: 1, timescale: 1),
      presentationTimeStamp: CMTime(value: frameIndex, timescale: 1),
      decodeTimeStamp: .invalid
    )

    var sampleBuffer: CMSampleBuffer?
    let sampleStatus = CMSampleBufferCreateReadyWithImageBuffer(
      allocator: kCFAllocatorDefault,
      imageBuffer: pixelBuffer,
      formatDescription: formatDescription,
      sampleTiming: &timing,
      sampleBufferOut: &sampleBuffer
    )

    guard sampleStatus == noErr else {
      return nil
    }

    return sampleBuffer
  }

  private func makePixelBuffer(downloadText: String, uploadText: String) -> CVPixelBuffer? {
    var pixelBuffer: CVPixelBuffer?
    let attributes = [
      kCVPixelBufferCGImageCompatibilityKey: true,
      kCVPixelBufferCGBitmapContextCompatibilityKey: true,
    ] as CFDictionary

    let status = CVPixelBufferCreate(
      kCFAllocatorDefault,
      width,
      height,
      kCVPixelFormatType_32BGRA,
      attributes,
      &pixelBuffer
    )

    guard status == kCVReturnSuccess, let pixelBuffer else {
      return nil
    }

    CVPixelBufferLockBaseAddress(pixelBuffer, [])
    defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, []) }

    guard let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer) else {
      return nil
    }

    let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue

    guard let context = CGContext(
      data: baseAddress,
      width: width,
      height: height,
      bitsPerComponent: 8,
      bytesPerRow: bytesPerRow,
      space: colorSpace,
      bitmapInfo: bitmapInfo
    ) else {
      return nil
    }

    context.setFillColor(UIColor(red: 0.10, green: 0.11, blue: 0.15, alpha: 0.92).cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))

    let downloadAttributes: [NSAttributedString.Key: Any] = [
      .font: UIFont.monospacedSystemFont(ofSize: 12, weight: .bold),
      .foregroundColor: UIColor(red: 0.29, green: 0.87, blue: 0.50, alpha: 1.0),
    ]
    let uploadAttributes: [NSAttributedString.Key: Any] = [
      .font: UIFont.monospacedSystemFont(ofSize: 12, weight: .bold),
      .foregroundColor: UIColor(red: 0.30, green: 0.64, blue: 1.0, alpha: 1.0),
    ]

    let download = NSAttributedString(string: downloadText, attributes: downloadAttributes)
    let upload = NSAttributedString(string: uploadText, attributes: uploadAttributes)

    let downloadSize = download.size()
    let padding: CGFloat = 12
    let gap: CGFloat = 8
    download.draw(in: CGRect(x: padding, y: 18, width: downloadSize.width, height: 20))
    upload.draw(
      in: CGRect(
        x: padding + downloadSize.width + gap,
        y: 18,
        width: CGFloat(width) - padding * 2,
        height: 20
      )
    )

    return pixelBuffer
  }
}
