import { join } from 'node:path';

import { cancel, confirm, isCancel, select } from '@clack/prompts';

import type { ProjectContext } from '../lib/project.js';
import {
  runWithSteps,
  runCommand,
  runNpmScriptLongTask,
} from '../lib/executor.js';
import { findProjectRoot } from '../lib/project.js';
import {
  type IosTargetOptions,
  type IosTargetResolution,
  listPhysicalIosDevices,
  resolveIosRunTarget,
  printIosTargetHint,
  getMetroEnvForIosTarget,
  IOS_METRO_HINT,
} from '../lib/ios-devices.js';
import { saveLastRun } from '../lib/history.js';

function printIosSigningHint(error: unknown): void {
  const msg = error instanceof Error ? error.message : String(error);
  if (!/code signing|signing certificates/i.test(msg)) return;
  console.log(`
⚠️  iOS 真机需要 Xcode 签名：
   1. Xcode 打开 ios/*.xcworkspace → Signing & Capabilities → 选 Team
   2. iPhone：设置 → 通用 → VPN与设备管理 → 信任开发者
   3. 再运行 aptool ai 或 aptool rr
`);
}

export async function devStart(): Promise<void> {
  const root = findProjectRoot();
  await runNpmScriptLongTask(root, 'start:cn', 'Metro 开发服务');
}

export async function devAndroid(): Promise<void> {
  const root = findProjectRoot();
  await runNpmScriptLongTask(root, 'android', 'Expo Go · Android');
}

export async function devIos(): Promise<void> {
  const root = findProjectRoot();
  await runNpmScriptLongTask(root, 'ios', 'Expo Go · iOS');
}

export async function devRunAndroid(): Promise<void> {
  const root = findProjectRoot();
  await runWithSteps({
    cwd: root,
    longTask: true,
    taskTitle: 'Android Dev Build',
    steps: [
      { title: '检查/生成 android 原生工程', command: 'npx', args: ['expo', 'prebuild', '--platform', 'android'] },
      { title: '构建并安装到设备', command: 'npx', args: ['expo', 'run:android'] },
    ],
  });
}

async function recordIosRun(
  root: string,
  command: 'dev run-ios' | 'build ios debug' | 'build ios release',
  target: IosTargetResolution,
  options?: IosTargetOptions,
): Promise<void> {
  const parts = command.split(' ');
  const argv = [...parts];
  if (options?.simulator) argv.push('--simulator');
  else if (options?.device) argv.push('--device', options.device);
  else {
    const idx = target.expoArgs.indexOf('--device');
    if (idx >= 0 && target.expoArgs[idx + 1]) {
      argv.push('--device', target.expoArgs[idx + 1]!);
    }
  }
  saveLastRun(root, argv, `aptool ${argv.join(' ')} → ${target.label}`);
}

export async function devRunIos(options?: IosTargetOptions): Promise<void> {
  const root = findProjectRoot();
  const target = resolveIosRunTarget(['run:ios'], options);

  const { terminal } = await import('../lib/terminal.js');
  terminal.clear();
  terminal.setTitle(`⏳ aptool: iOS Dev Build → ${target.label}`);
  printIosTargetHint(target);
  await recordIosRun(root, 'dev run-ios', target, options);

  try {
    const metroEnv = getMetroEnvForIosTarget(target.isSimulator);
    await runWithSteps({
      cwd: root,
      longTask: false,
      taskTitle: 'iOS Dev Build',
      steps: [
        { title: '检查/生成 iOS 原生工程', command: 'npx', args: ['expo', 'prebuild', '--platform', 'ios'] },
        {
          title: `构建并安装 → ${target.label}`,
          command: 'npx',
          args: ['expo', ...target.expoArgs],
          env: metroEnv,
        },
      ],
    });
    terminal.setTitle('✓ aptool: iOS Dev Build 完成');
    console.log(`\n${IOS_METRO_HINT}`);
  } catch (error) {
    terminal.setTitle('✗ aptool: iOS Dev Build 失败');
    printIosSigningHint(error);
    throw error;
  }
}

export async function buildAndroid(variant: 'debug' | 'release'): Promise<void> {
  const root = findProjectRoot();
  const gradleTask = variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
  const apkSub = variant === 'debug' ? 'debug' : 'release';
  const apkName = variant === 'debug' ? 'app-debug.apk' : 'app-release.apk';

  await runWithSteps({
    cwd: root,
    longTask: true,
    taskTitle: `Android ${variant} 构建`,
    steps: [
      { title: 'expo prebuild (android)', command: 'npx', args: ['expo', 'prebuild', '--platform', 'android'] },
      { title: `gradlew ${gradleTask}`, command: './gradlew', args: [gradleTask], cwd: join(root, 'android') },
    ],
  });

  const apkPath = `${root}/android/app/build/outputs/apk/${apkSub}/${apkName}`;
  console.log(`\n📦 产物: ${apkPath}`);
  if (variant === 'release') {
    console.log('ℹ️  Release APK 未签名，正式发布需配置 keystore。');
  }
}

export async function buildIos(
  variant: 'debug' | 'release',
  options?: IosTargetOptions,
): Promise<void> {
  const root = findProjectRoot();
  const configuration = variant === 'debug' ? 'Debug' : 'Release';
  const target = resolveIosRunTarget(['run:ios', '--configuration', configuration], options);

  const ok = await confirm({
    message: `即将构建 iOS ${configuration} → ${target.label}。继续？`,
  });
  if (isCancel(ok) || !ok) {
    cancel('已取消');
    return;
  }

  const { terminal } = await import('../lib/terminal.js');
  terminal.clear();
  terminal.setTitle(`⏳ aptool: iOS ${configuration} → ${target.label}`);
  printIosTargetHint(target);
  await recordIosRun(root, variant === 'debug' ? 'build ios debug' : 'build ios release', target, options);

  try {
    const metroEnv = getMetroEnvForIosTarget(target.isSimulator);
    await runWithSteps({
      cwd: root,
      longTask: false,
      taskTitle: `iOS ${configuration}`,
      steps: [
        { title: '检查/生成 iOS 原生工程', command: 'npx', args: ['expo', 'prebuild', '--platform', 'ios'] },
        {
          title: `构建并安装 → ${target.label}`,
          command: 'npx',
          args: ['expo', ...target.expoArgs],
          env: metroEnv,
        },
      ],
    });
    terminal.setTitle(`✓ aptool: iOS ${configuration} 完成`);
    console.log(`\n${IOS_METRO_HINT}`);
  } catch (error) {
    terminal.setTitle(`✗ aptool: iOS ${configuration} 失败`);
    printIosSigningHint(error);
    throw error;
  }
}

export async function envSetupCn(): Promise<void> {
  const root = findProjectRoot();
  await runCommand('bash', ['scripts/setup-china-env.sh'], { cwd: root });
}

async function pickIosDeviceIfNeeded(options?: IosTargetOptions): Promise<IosTargetOptions | undefined> {
  if (options?.simulator || options?.device) return options;

  const devices = listPhysicalIosDevices();
  if (devices.length <= 1) return options;

  const choice = await select({
    message: '选择 iOS 安装目标',
    options: [
      ...devices.map((d) => ({
        value: d.udid,
        label: `${d.name}（${d.model}）`,
        hint: '真机',
      })),
      { value: '__simulator__', label: '模拟器', hint: '无相机/闪光灯完整能力' },
    ],
  });

  if (isCancel(choice)) return options;
  if (choice === '__simulator__') return { simulator: true };
  return { device: choice as string };
}

export async function promptDevMenu(_ctx: ProjectContext): Promise<void> {
  const choice = await select({
    message: '开发调试',
    options: [
      { value: 'start', label: '启动 Metro 开发服务', hint: 'aptool dev start' },
      { value: 'expo-android', label: 'Expo Go 快速预览 Android', hint: 'aptool dev android' },
      { value: 'expo-ios', label: 'Expo Go 快速预览 iOS', hint: 'aptool dev ios' },
      { value: 'run-android', label: 'Dev Build 真机 Android [推荐]', hint: 'aptool dev run-android' },
      { value: 'run-ios', label: 'Dev Build 真机 iOS [推荐]', hint: 'aptool dev run-ios' },
      { value: 'back', label: '‹ 返回' },
    ],
  });

  if (isCancel(choice) || choice === 'back') return;

  switch (choice) {
    case 'start':
      await devStart();
      break;
    case 'expo-android':
      await devAndroid();
      break;
    case 'expo-ios':
      await devIos();
      break;
    case 'run-android':
      await devRunAndroid();
      break;
    case 'run-ios': {
      const iosOpts = await pickIosDeviceIfNeeded();
      await devRunIos(iosOpts);
      break;
    }
  }
}

export async function promptBuildMenu(): Promise<void> {
  const platform = await select({
    message: '选择平台',
    options: [
      { value: 'android', label: 'Android' },
      { value: 'ios', label: 'iOS' },
      { value: 'back', label: '‹ 返回' },
    ],
  });
  if (isCancel(platform) || platform === 'back') return;

  const variant = await select({
    message: '选择构建类型',
    options: [
      { value: 'debug', label: 'Debug' },
      { value: 'release', label: 'Release' },
      { value: 'back', label: '‹ 返回' },
    ],
  });
  if (isCancel(variant) || variant === 'back') return;

  const ok = await confirm({ message: `确认执行：aptool build ${platform} ${variant}？` });
  if (isCancel(ok) || !ok) {
    cancel('已取消');
    return;
  }

  if (platform === 'android') {
    await buildAndroid(variant as 'debug' | 'release');
  } else {
    const iosOpts = await pickIosDeviceIfNeeded();
    await buildIos(variant as 'debug' | 'release', iosOpts);
  }
}
