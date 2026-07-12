import { Linking, PermissionsAndroid, Platform } from 'react-native';

const ERROR_PATTERNS: Array<{ match: RegExp; message: string }> = [
  {
    match: /E_NO_PERMISSION|Overlay permission|悬浮窗权限/i,
    message: '未获得「显示在其他应用上层」权限，请在系统设置中开启后重试。',
  },
  {
    match: /E_NO_CONTEXT|React context/i,
    message: '应用尚未就绪，请返回后重新进入此页面。',
  },
  {
    match: /不支持画中画|Picture in Picture|PiP/i,
    message: '当前设备不支持画中画，无法显示网速悬浮窗。',
  },
  {
    match: /画中画暂不可用|notPossible/i,
    message: '画中画暂不可用，请保持 App 在前台后重试。',
  },
  {
    match: /无法获取应用窗口|noWindow/i,
    message: '无法初始化悬浮窗，请完全关闭 App 后重新打开。',
  },
];

export function mapOverlayError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const matched = ERROR_PATTERNS.find(({ match }) => match.test(message));
  return matched?.message ?? (message || '操作失败，请稍后重试');
}

export function formatSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond < 1024) {
    return `${bytesPerSecond} B/s`;
  }

  const kb = bytesPerSecond / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB/s`;
  }

  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(1)} MB/s`;
  }

  return `${(mb / 1024).toFixed(2)} GB/s`;
}

export async function ensureAndroidNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || Number(Platform.Version) < 33) {
    return true;
  }

  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  const alreadyGranted = await PermissionsAndroid.check(permission);
  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission, {
    title: '通知权限',
    message: '网速悬浮窗需要通知权限以显示前台服务通知，便于你从通知栏停止监控。',
    buttonPositive: '允许',
    buttonNegative: '暂不',
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export function openAppSettings(): void {
  Linking.openSettings().catch(() => {});
}

export function getPlatformHint(running: boolean): string {
  if (Platform.OS === 'ios') {
    return running
      ? '画中画已启动。请切到桌面或其他 App 查看小窗（App 内不会显示悬浮条）。'
      : 'iOS 通过画中画显示网速；开启后需切到后台才能看到小窗。';
  }

  return running
    ? '悬浮窗运行中。可切到其他 App 验证，按住浮窗可拖动；也可从通知栏停止。'
    : 'Android 使用系统悬浮窗显示全局网速（含其他 App 流量）。';
}

export function getHeroDescription(): string {
  if (Platform.OS === 'ios') {
    return '开启后系统会启动画中画；请切到桌面或其他 App 查看网速小窗。';
  }

  return '开启后可在任意 App 上方看到悬浮网速条，按住可拖动位置。';
}

export function getPermissionGuide(): string {
  if (Platform.OS === 'android') {
    return '请在系统设置中为 AndyPhoneTool 开启「显示在其他应用上层」，返回 App 后点「刷新状态」。';
  }

  return '请确认设备支持画中画。开启后若 App 内看不到浮窗，属于正常现象，请切到后台查看。';
}
