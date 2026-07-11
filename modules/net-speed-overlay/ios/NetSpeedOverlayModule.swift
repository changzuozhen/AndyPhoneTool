import AVKit
import ExpoModulesCore

public class NetSpeedOverlayModule: Module {
  private var running = false

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

    AsyncFunction("start") { [weak self] in
      self?.running = true
    }

    AsyncFunction("stop") { [weak self] in
      self?.running = false
    }

    AsyncFunction("isRunning") { [weak self] in
      self?.running ?? false
    }
  }
}
