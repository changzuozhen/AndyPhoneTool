import AVKit
import ExpoModulesCore

public class NetSpeedOverlayModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NetSpeedOverlay")

    Function("isSupported") {
      AVPictureInPictureController.isPictureInPictureSupported()
    }

    AsyncFunction("hasPermission") {
      AVPictureInPictureController.isPictureInPictureSupported()
    }

    AsyncFunction("requestPermission") {
      AVPictureInPictureController.isPictureInPictureSupported()
    }

    AsyncFunction("start") { (promise: Promise) in
      DispatchQueue.main.async {
        do {
          try NetSpeedPiPSession.shared.start()
          promise.resolve()
        } catch {
          promise.reject(error)
        }
      }
    }

    AsyncFunction("stop") { (promise: Promise) in
      DispatchQueue.main.async {
        NetSpeedPiPSession.shared.stop()
        promise.resolve()
      }
    }

    AsyncFunction("isRunning") { (promise: Promise) in
      DispatchQueue.main.async {
        promise.resolve(NetSpeedPiPSession.shared.isActive)
      }
    }

    AsyncFunction("getLastSpeed") { (promise: Promise) in
      DispatchQueue.main.async {
        promise.resolve(NetSpeedPiPSession.shared.getLastSpeed())
      }
    }
  }
}
