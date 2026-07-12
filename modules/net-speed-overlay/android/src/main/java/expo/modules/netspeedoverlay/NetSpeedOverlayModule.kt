package expo.modules.netspeedoverlay

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NetSpeedOverlayModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NetSpeedOverlay")

    Function("isSupported") {
      true
    }

    AsyncFunction("hasPermission") {
      canDrawOverlays()
    }

    AsyncFunction("requestPermission") {
      if (canDrawOverlays()) {
        return@AsyncFunction true
      }

      val context = appContext.currentActivity ?: appContext.reactContext
      if (context == null) {
        return@AsyncFunction false
      }

      val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:${context.packageName}"),
      ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

      context.startActivity(intent)
      false
    }

    AsyncFunction("start") {
      val context = appContext.reactContext
        ?: throw CodedException("E_NO_CONTEXT", "应用尚未就绪，请返回后重新进入")

      if (!canDrawOverlays()) {
        throw CodedException(
          "E_NO_PERMISSION",
          "未获得悬浮窗权限，请在系统设置中开启「显示在其他应用上层」",
        )
      }

      if (NetSpeedService.isActive) {
        return@AsyncFunction
      }

      val intent = Intent(context, NetSpeedService::class.java)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(intent)
      } else {
        context.startService(intent)
      }
    }

    AsyncFunction("stop") {
      val context = appContext.reactContext ?: return@AsyncFunction
      context.stopService(Intent(context, NetSpeedService::class.java))
    }

    AsyncFunction("isRunning") {
      NetSpeedService.isActive
    }

    AsyncFunction("getLastSpeed") {
      mapOf(
        "downloadBps" to NetSpeedService.lastDownloadBps,
        "uploadBps" to NetSpeedService.lastUploadBps,
      )
    }
  }

  private fun canDrawOverlays(): Boolean {
    val context = appContext.reactContext ?: return false
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      Settings.canDrawOverlays(context)
    } else {
      true
    }
  }
}
