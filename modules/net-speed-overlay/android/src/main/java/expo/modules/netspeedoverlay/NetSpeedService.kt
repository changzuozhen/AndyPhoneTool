package expo.modules.netspeedoverlay

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat

class NetSpeedService : Service() {
  private val handler = Handler(Looper.getMainLooper())
  private val monitor = NetSpeedMonitor()
  private var overlayManager: NetSpeedOverlayManager? = null

  private val pollRunnable = object : Runnable {
    override fun run() {
      val sample = monitor.sample()
      NetSpeedService.updateLastSample(sample.downloadBps, sample.uploadBps)
      overlayManager?.updateSpeed(sample.downloadBps, sample.uploadBps)
      handler.postDelayed(this, POLL_INTERVAL_MS)
    }
  }

  override fun onCreate() {
    super.onCreate()
    isActive = true
    createNotificationChannel()
    startAsForeground()

    try {
      overlayManager = NetSpeedOverlayManager(this).also { it.show() }
      handler.post(pollRunnable)
    } catch (_: SecurityException) {
      stopSelf()
    }
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_STOP -> {
        stopSelf()
        return START_NOT_STICKY
      }
    }

    return START_STICKY
  }

  override fun onDestroy() {
    isActive = false
    handler.removeCallbacksAndMessages(null)
    overlayManager?.hide()
    overlayManager = null
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null

  private fun startAsForeground() {
    val notification = buildNotification()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      startForeground(
        NOTIFICATION_ID,
        notification,
        ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE,
      )
    } else {
      @Suppress("DEPRECATION")
      startForeground(NOTIFICATION_ID, notification)
    }
  }

  private fun buildNotification(): Notification {
    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
      flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }

    val pendingIntent = PendingIntent.getActivity(
      this,
      0,
      launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    val stopIntent = Intent(this, NetSpeedService::class.java).apply {
      action = ACTION_STOP
    }
    val stopPendingIntent = PendingIntent.getService(
      this,
      1,
      stopIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("网速悬浮窗运行中")
      .setContentText("正在显示实时网速")
      .setSmallIcon(android.R.drawable.stat_sys_download_done)
      .setOngoing(true)
      .setContentIntent(pendingIntent)
      .addAction(android.R.drawable.ic_menu_close_clear_cancel, "停止", stopPendingIntent)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .build()
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val channel = NotificationChannel(
      CHANNEL_ID,
      "网速悬浮窗",
      NotificationManager.IMPORTANCE_LOW,
    ).apply {
      description = "网速悬浮窗前台服务通知"
      setShowBadge(false)
    }

    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.createNotificationChannel(channel)
  }

  companion object {
    private const val CHANNEL_ID = "net_speed_overlay"
    private const val NOTIFICATION_ID = 0x4E53
    private const val ACTION_STOP = "expo.modules.netspeedoverlay.action.STOP"
    private const val POLL_INTERVAL_MS = 1000L

    @Volatile
    var isActive: Boolean = false
      private set

    @Volatile
    var lastDownloadBps: Long = 0
      private set

    @Volatile
    var lastUploadBps: Long = 0
      private set

    fun updateLastSample(downloadBps: Long, uploadBps: Long) {
      lastDownloadBps = downloadBps
      lastUploadBps = uploadBps
    }
  }
}
