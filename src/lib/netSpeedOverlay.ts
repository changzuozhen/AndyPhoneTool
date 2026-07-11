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

export function getPlatformHint(): string {
  if (Platform.OS === 'ios') {
    return 'iOS 画中画实现将在后续阶段完成。';
  }

  return 'Android 已支持系统悬浮窗与 TrafficStats 实时网速。iOS 画中画将在后续阶段实现。';
}

export function getHeroDescription(): string {
  if (Platform.OS === 'ios') {
    return '开启后请切到后台，系统会以画中画小窗显示网速。';
  }

  return '开启后可在任意 App 上方看到悬浮网速条，按住可拖动位置。';
}
