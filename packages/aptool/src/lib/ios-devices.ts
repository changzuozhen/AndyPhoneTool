import { execSync } from 'node:child_process';

export type IosDevice = {
  name: string;
  model: string;
  state: string;
};

/** 通过 xcrun devicectl 列出已连接的物理 iOS 设备 */
export function listPhysicalIosDevices(): IosDevice[] {
  try {
    const output = execSync('xcrun devicectl list devices 2>/dev/null', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    const devices: IosDevice[] = [];
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('Name') || trimmed.startsWith('---')) continue;

      // Name  Hostname  Identifier  State  Model
      const parts = trimmed.split(/\s{2,}/);
      if (parts.length < 4) continue;

      const name = parts[0]?.trim();
      const state = parts[3]?.trim();
      const model = parts.slice(4).join(' ').trim();
      if (state?.toLowerCase() !== 'connected') continue;
      if (!name) continue;

      devices.push({ name, model, state });
    }
    return devices;
  } catch {
    return [];
  }
}

export type IosTargetOptions = {
  /** 强制使用模拟器 */
  simulator?: boolean;
  /** 指定设备名称（如 "Andy iPhone13"） */
  device?: string;
};

export type IosTargetResolution = {
  expoArgs: string[];
  label: string;
};

/**
 * 为 expo run:ios 解析目标设备参数。
 * 默认：有真机 → 真机；无真机 → 模拟器。
 */
export function resolveIosRunTarget(
  baseArgs: string[],
  options?: IosTargetOptions,
): IosTargetResolution {
  if (options?.simulator) {
    return { expoArgs: baseArgs, label: '模拟器' };
  }

  if (options?.device) {
    return {
      expoArgs: [...baseArgs, '--device', options.device],
      label: options.device,
    };
  }

  const devices = listPhysicalIosDevices();
  if (devices.length === 1) {
    const d = devices[0]!;
    return {
      expoArgs: [...baseArgs, '--device', d.name],
      label: `${d.name}（${d.model}）`,
    };
  }

  if (devices.length > 1) {
    const d = devices[0]!;
    return {
      expoArgs: [...baseArgs, '--device', d.name],
      label: `${d.name}（多台真机已连接，已选第一台；可用 --device 指定）`,
    };
  }

  return {
    expoArgs: baseArgs,
    label: '模拟器（未检测到真机）',
  };
}

export function printIosTargetHint(resolution: IosTargetResolution): void {
  console.log(`\n📱 安装目标: ${resolution.label}`);
  if (resolution.label.includes('模拟器')) {
    console.log('   真机调试: USB 连接 iPhone → 信任此电脑 → aptool dev run-ios');
    console.log('   相机/闪光灯需真机，模拟器不支持完整硬件能力。');
  }
}

export const IOS_METRO_HINT =
  '若启动后红屏 "No script URL"，等待 Metro 日志出现 "Bundled" 后按 ⌘R 重载，或重新运行 aptool dev run-ios。';
