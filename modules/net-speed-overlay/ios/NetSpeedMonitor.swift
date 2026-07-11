import Darwin

struct SpeedSample {
  let downloadBps: Int64
  let uploadBps: Int64
}

final class NetSpeedMonitor {
  private var lastRxBytes: UInt64?
  private var lastTxBytes: UInt64?
  private var lastSampleAt: TimeInterval?

  func sample() -> SpeedSample {
    let now = ProcessInfo.processInfo.systemUptime
    let (rxBytes, txBytes) = readInterfaceBytes()

    guard let lastRxBytes, let lastTxBytes, let lastSampleAt else {
      self.lastRxBytes = rxBytes
      self.lastTxBytes = txBytes
      self.lastSampleAt = now
      return SpeedSample(downloadBps: 0, uploadBps: 0)
    }

    let elapsed = max(now - lastSampleAt, 0.001)
    let downloadBps = Int64(Double(rxBytes - lastRxBytes) / elapsed)
    let uploadBps = Int64(Double(txBytes - lastTxBytes) / elapsed)

    self.lastRxBytes = rxBytes
    self.lastTxBytes = txBytes
    self.lastSampleAt = now

    return SpeedSample(
      downloadBps: max(downloadBps, 0),
      uploadBps: max(uploadBps, 0)
    )
  }

  private func readInterfaceBytes() -> (UInt64, UInt64) {
    var ifaddrPointer: UnsafeMutablePointer<ifaddrs>?
    guard getifaddrs(&ifaddrPointer) == 0, let firstAddress = ifaddrPointer else {
      return (0, 0)
    }

    defer { freeifaddrs(ifaddrPointer) }

    var rxBytes: UInt64 = 0
    var txBytes: UInt64 = 0
    var pointer: UnsafeMutablePointer<ifaddrs>? = firstAddress

    while let current = pointer {
      let interface = current.pointee
      let name = String(cString: interface.ifa_name)

      if name == "en0" || name.hasPrefix("pdp_ip"), interface.ifa_data != nil {
        let data = interface.ifa_data!.assumingMemoryBound(to: if_data.self).pointee
        rxBytes &+= UInt64(data.ifi_ibytes)
        txBytes &+= UInt64(data.ifi_obytes)
      }

      pointer = interface.ifa_next
    }

    return (rxBytes, txBytes)
  }
}

enum NetSpeedFormatter {
  static func format(bytesPerSecond: Int64) -> String {
    if bytesPerSecond < 1024 {
      return "\(bytesPerSecond) B/s"
    }

    let kilobytes = Double(bytesPerSecond) / 1024.0
    if kilobytes < 1024 {
      return String(format: "%.1f KB/s", kilobytes)
    }

    let megabytes = kilobytes / 1024.0
    if megabytes < 1024 {
      return String(format: "%.1f MB/s", megabytes)
    }

    let gigabytes = megabytes / 1024.0
    return String(format: "%.2f GB/s", gigabytes)
  }
}
