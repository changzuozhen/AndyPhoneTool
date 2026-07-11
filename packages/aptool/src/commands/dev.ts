import { join } from 'node:path';

import { cancel, confirm, isCancel, select } from '@clack/prompts';

import type { ProjectContext } from '../lib/project.js';
import { runExpo, runNpmScript, runWithSteps, runCommand } from '../lib/executor.js';
import { findProjectRoot } from '../lib/project.js';

export async function devStart(): Promise<void> {
  const root = findProjectRoot();
  await runNpmScript(root, 'start:cn');
}

export async function devAndroid(): Promise<void> {
  const root = findProjectRoot();
  await runNpmScript(root, 'android');
}

export async function devIos(): Promise<void> {
  const root = findProjectRoot();
  await runNpmScript(root, 'ios');
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

export async function devRunIos(): Promise<void> {
  const root = findProjectRoot();
  await runExpo(root, ['run:ios']);
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

export async function buildIos(variant: 'debug' | 'release'): Promise<void> {
  const root = findProjectRoot();
  const configuration = variant === 'debug' ? 'Debug' : 'Release';

  const ok = await confirm({
    message: `即将构建 iOS ${configuration}，需本机 Xcode 环境。继续？`,
  });
  if (isCancel(ok) || !ok) {
    cancel('已取消');
    return;
  }

  const { terminal } = await import('../lib/terminal.js');
  await terminal.withLongTask(`iOS ${configuration} 构建`, async () => {
    await runExpo(root, ['run:ios', '--configuration', configuration]);
  });
}

export async function envSetupCn(): Promise<void> {
  const root = findProjectRoot();
  await runCommand('bash', ['scripts/setup-china-env.sh'], { cwd: root });
}

export async function promptDevMenu(ctx: ProjectContext): Promise<void> {
  const choice = await select({
    message: '开发调试',
    options: [
      {
        value: 'start',
        label: '启动 Metro 开发服务',
        hint: 'aptool dev start',
      },
      {
        value: 'expo-android',
        label: 'Expo Go 快速预览 Android',
        hint: 'aptool dev android',
      },
      {
        value: 'expo-ios',
        label: 'Expo Go 快速预览 iOS',
        hint: 'aptool dev ios',
      },
      {
        value: 'run-android',
        label: 'Dev Build 真机 Android [推荐]',
        hint: 'aptool dev run-android — 相机/闪光灯完整',
      },
      {
        value: 'run-ios',
        label: 'Dev Build 真机/模拟器 iOS',
        hint: 'aptool dev run-ios',
      },
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
    case 'run-ios':
      await devRunIos();
      break;
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
      { value: 'debug', label: 'Debug', hint: platform === 'android' ? 'aptool build android debug' : 'aptool build ios debug' },
      { value: 'release', label: 'Release', hint: platform === 'android' ? 'aptool build android release' : 'aptool build ios release' },
      { value: 'back', label: '‹ 返回' },
    ],
  });
  if (isCancel(variant) || variant === 'back') return;

  const fullCmd = `aptool build ${platform} ${variant}`;
  const ok = await confirm({ message: `确认执行：${fullCmd}？` });
  if (isCancel(ok) || !ok) {
    cancel('已取消');
    return;
  }

  if (platform === 'android') {
    await buildAndroid(variant as 'debug' | 'release');
  } else {
    await buildIos(variant as 'debug' | 'release');
  }
}
