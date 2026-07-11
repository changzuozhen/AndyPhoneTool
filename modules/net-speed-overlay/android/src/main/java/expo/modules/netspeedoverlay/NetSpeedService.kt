package expo.modules.netspeedoverlay

import android.app.Service
import android.content.Intent
import android.os.IBinder

/**
 * Foreground service placeholder for the network speed overlay.
 * Phase 2 will attach the overlay window and speed polling here.
 */
class NetSpeedService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    return START_NOT_STICKY
  }
}
