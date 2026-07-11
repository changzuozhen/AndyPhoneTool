import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { networkInterfaces, tmpdir } from 'node:os';
import { join } from 'node:path';

export type IosDevice = {
  name: string;
  udid: string;
  model: string;
  state: string;
};

type DevicectlDevice = {
  deviceProperties?: { name?: string };
  hardwareProperties?: {
    udid?: string;
    marketingName?: string;
    productType?: string;
    deviceType?: string;
  };
  connectionProperties?: { tunnelState?: string };
};

/**
 * 通过 xcrun devicectl 列出已连接的物理 iOS 设备。
 *
 * 使用 --json-output 读取 hardwareProperties.udid（如 00008110-...），
 * 而不是文本表格里的 CoreDevice Identifier（如 723BDA0F-...）。
 * expo run:ios --device 只认硬件 UDID / 设备名，传 CoreDevice UUID 会报
 * "No device UDID or name matching"。
 */
export function listPhysicalIosDevices(): IosDevice[] {
  let workDir: string | undefined;
  try {
    workDir = mkdtempSync(join(tmpdir(), 'aptool-ios-'));
    const jsonPath = join(workDir, 'devices.json');
    execSync(`xcrun devicectl list devices --json-output "${jsonPath}"`, {
      stdio: ['ignore', 'ignore', 'ignore'],
    });

    const parsed = JSON.parse(readFileSync(jsonPath, 'utf8')) as {
      result?: { devices?: DevicectlDevice[] };
    };

    const devices: IosDevice[] = [];
    for (const dev of parsed.result?.devices ?? []) {
      const hw = dev.hardwareProperties ?? {};
      const name = dev.deviceProperties?.name?.trim();
      const udid = hw.udid?.trim();
      if (!name || !udid) continue;
      if (dev.connectionProperties?.tunnelState !== 'connected') continue;

      const model = hw.marketingName
        ? `${hw.marketingName}${hw.productType ? ` (${hw.productType})` : ''}`
        : (hw.productType ?? '');

      devices.push({ name, udid, model, state: 'connected' });
    }
    return devices;
  } catch {
    return [];
  } finally {
    if (workDir) rmSync(workDir, { recursive: true, force: true });
  }
}

export type IosTargetOptions = {
  simulator?: boolean;
  device?: string;
};

export type IosTargetResolution = {
  expoArgs: string[];
  label: string;
  /** 是否安装到模拟器（影响 Metro 主机名） */
  isSimulator: boolean;
};

function matchDevice(query: string, devices: IosDevice[]): IosDevice | undefined {
  const q = query.toLowerCase();
  return devices.find(
    (d) =>
      d.name.toLowerCase() === q ||
      d.udid.toLowerCase() === q ||
      d.name.toLowerCase().includes(q),
  );
}

/**
 * 为 expo run:ios 解析目标设备。
 * 有真机时默认使用 UDID 安装到真机（避免误开模拟器）。
 */
export function resolveIosRunTarget(
  baseArgs: string[],
  options?: IosTargetOptions,
): IosTargetResolution {
  if (options?.simulator) {
    return { expoArgs: baseArgs, label: '模拟器', isSimulator: true };
  }

  const devices = listPhysicalIosDevices();

  if (options?.device) {
    const matched = matchDevice(options.device, devices);
    const udid = matched?.udid ?? options.device;
    const label = matched ? `${matched.name}（${matched.model}）` : options.device;
    return {
      expoArgs: [...baseArgs, '--device', udid],
      label,
      isSimulator: false,
    };
  }

  if (devices.length >= 1) {
    const d = devices[0]!;
    const extra =
      devices.length > 1 ? '（多台真机，已选第一台；可用 --device 指定）' : '';
    return {
      expoArgs: [...baseArgs, '--device', d.udid],
      label: `${d.name}（${d.model}）${extra}`,
      isSimulator: false,
    };
  }

  return {
    expoArgs: baseArgs,
    label: '模拟器（未检测到真机）',
    isSimulator: true,
  };
}

/** 模拟器用 localhost；真机用局域网 IP，避免红屏 No script URL */
export function getMetroEnvForIosTarget(isSimulator: boolean): Record<string, string> {
  if (isSimulator) {
    return {
      REACT_NATIVE_PACKAGER_HOSTNAME: '127.0.0.1',
      RCT_METRO_PORT: '8081',
    };
  }

  const lanIp = getLanIPv4();
  if (lanIp) {
    return {
      REACT_NATIVE_PACKAGER_HOSTNAME: lanIp,
      RCT_METRO_PORT: '8081',
    };
  }
  return { RCT_METRO_PORT: '8081' };
}

function getLanIPv4(): string | undefined {
  const nets = networkInterfaces();
  for (const entries of Object.values(nets)) {
    for (const net of entries ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return undefined;
}

export function printIosTargetHint(resolution: IosTargetResolution): void {
  console.log(`\n📱 安装目标: ${resolution.label}`);
  if (resolution.isSimulator) {
    console.log('   真机调试: USB 连接 iPhone → 信任此电脑 → aptool dev run-ios');
    console.log('   相机/闪光灯需真机，模拟器不支持完整硬件能力。');
  } else {
    const ip = getMetroEnvForIosTarget(false).REACT_NATIVE_PACKAGER_HOSTNAME;
    if (ip) console.log(`   Metro 地址: http://${ip}:8081（请保持 Mac 与 iPhone 同一 Wi‑Fi）`);
  }
}

export const IOS_METRO_HINT =
  '若红屏 "No script URL"：等待终端出现 Bundled 后，在 App 内按 ⌘R 重载；真机请确认与 Mac 同网。';
