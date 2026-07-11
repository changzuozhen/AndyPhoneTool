package expo.modules.netspeedoverlay

import android.net.TrafficStats
import android.os.SystemClock

class NetSpeedMonitor {
  private var lastRxBytes = -1L
  private var lastTxBytes = -1L
  private var lastSampleAt = 0L

  fun sample(): SpeedSample {
    val now = SystemClock.elapsedRealtime()
    val rxBytes = TrafficStats.getTotalRxBytes()
    val txBytes = TrafficStats.getTotalTxBytes()

    if (lastRxBytes < 0 || lastTxBytes < 0 || rxBytes < 0 || txBytes < 0) {
      lastRxBytes = rxBytes.coerceAtLeast(0)
      lastTxBytes = txBytes.coerceAtLeast(0)
      lastSampleAt = now
      return SpeedSample(0, 0)
    }

    val elapsedMs = (now - lastSampleAt).coerceAtLeast(1)
    val downloadBps = ((rxBytes - lastRxBytes).coerceAtLeast(0) * 1000L) / elapsedMs
    val uploadBps = ((txBytes - lastTxBytes).coerceAtLeast(0) * 1000L) / elapsedMs

    lastRxBytes = rxBytes
    lastTxBytes = txBytes
    lastSampleAt = now

    return SpeedSample(downloadBps, uploadBps)
  }
}

data class SpeedSample(
  val downloadBps: Long,
  val uploadBps: Long,
)

object NetSpeedFormatter {
  fun format(bytesPerSecond: Long): String {
    if (bytesPerSecond < 1024) {
      return "${bytesPerSecond} B/s"
    }

    val kb = bytesPerSecond / 1024.0
    if (kb < 1024) {
      return String.format("%.1f KB/s", kb)
    }

    val mb = kb / 1024.0
    if (mb < 1024) {
      return String.format("%.1f MB/s", mb)
    }

    val gb = mb / 1024.0
    return String.format("%.2f GB/s", gb)
  }
}
