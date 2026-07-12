import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroBlock } from '@/components/HeroBlock';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusRow } from '@/components/StatusRow';
import { AppLayout, AppTheme } from '@/constants/theme';
import {
  ensureAndroidNotificationPermission,
  formatSpeed,
  getHeroDescription,
  getPermissionGuide,
  getPlatformHint,
  mapOverlayError,
} from '@/lib/netSpeedOverlay';
import NetSpeedOverlay from 'net-speed-overlay';

type OverlayState = {
  supported: boolean;
  hasPermission: boolean;
  running: boolean;
};

type SpeedPreview = {
  downloadBps: number;
  uploadBps: number;
};

const RUNNING_REFRESH_MS = 1000;

export default function NetSpeedToolScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<OverlayState>({
    supported: false,
    hasPermission: false,
    running: false,
  });
  const [speedPreview, setSpeedPreview] = useState<SpeedPreview | null>(null);

  const refreshState = useCallback(async () => {
    const [hasPermission, running] = await Promise.all([
      NetSpeedOverlay.hasPermission(),
      NetSpeedOverlay.isRunning(),
    ]);

    setState({
      supported: NetSpeedOverlay.isSupported(),
      hasPermission,
      running,
    });

    if (running && typeof NetSpeedOverlay.getLastSpeed === 'function') {
      try {
        const sample = await NetSpeedOverlay.getLastSpeed();
        setSpeedPreview(sample);
      } catch {
        setSpeedPreview(null);
      }
    } else {
      setSpeedPreview(null);
    }

    if (hasPermission) {
      setError(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    refreshState()
      .catch(() => {})
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [refreshState]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        refreshState().catch(() => {});
      }
    });

    return () => subscription.remove();
  }, [refreshState]);

  useEffect(() => {
    if (!state.running) {
      return;
    }

    const timer = setInterval(() => {
      refreshState().catch(() => {});
    }, RUNNING_REFRESH_MS);

    return () => clearInterval(timer);
  }, [state.running, refreshState]);

  const handleRequestPermission = async () => {
    setBusy(true);
    setError(null);
    try {
      const granted = await NetSpeedOverlay.requestPermission();
      if (granted) {
        await refreshState();
        return;
      }

      if (Platform.OS === 'android') {
        setError('请在系统设置中开启权限，返回 App 后会自动刷新状态。');
      } else {
        await refreshState();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async () => {
    setBusy(true);
    setError(null);
    try {
      if (state.running) {
        await NetSpeedOverlay.stop();
      } else {
        if (Platform.OS === 'android') {
          await ensureAndroidNotificationPermission();
        }
        await NetSpeedOverlay.start();
      }
      await refreshState();
    } catch (e) {
      setError(mapOverlayError(e));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={AppTheme.accent} />
      </View>
    );
  }

  if (!state.supported) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: '网速悬浮窗', headerShown: false }} />
        <Ionicons name="speedometer-outline" size={48} color={AppTheme.textSecondary} />
        <Text style={styles.unsupportedTitle}>当前平台不支持</Text>
        <Text style={styles.unsupportedText}>
          网速悬浮窗需要 Android 或 iOS 原生构建，Web 端暂不可用。
        </Text>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>返回</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 24 }]}>
      <Stack.Screen options={{ title: '网速悬浮窗', headerShown: false }} />
      <ScreenHeader title="网速悬浮窗" onBack={() => router.back()} />

      <View style={styles.body}>
        <HeroBlock
          icon={
            <Ionicons name="speedometer-outline" size={36} color={AppTheme.accentWarm} />
          }
          title="实时网速 · 盖在其他 App 上"
          description={getHeroDescription()}
        />

        {state.running && speedPreview ? (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>当前采样</Text>
            <Text style={styles.previewDownload}>
              ↓ {formatSpeed(speedPreview.downloadBps)}
            </Text>
            <Text style={styles.previewUpload}>↑ {formatSpeed(speedPreview.uploadBps)}</Text>
            {Platform.OS === 'ios' ? (
              <Text style={styles.previewHint}>
                以上为 App 内采样值。画中画小窗需切到后台后查看。
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.card}>
          <StatusRow
            label="原生模块"
            value={state.supported ? '已就绪' : '不可用'}
            active={state.supported}
          />
          <StatusRow
            label="权限状态"
            value={state.hasPermission ? '已授权' : '未授权'}
            active={state.hasPermission}
          />
          <StatusRow
            label="运行状态"
            value={state.running ? '运行中' : '已停止'}
            active={state.running}
          />
        </View>

        {!state.hasPermission ? (
          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>需要权限</Text>
            <Text style={styles.guideText}>{getPermissionGuide()}</Text>
          </View>
        ) : null}

        {!state.hasPermission ? (
          <PrimaryButton
            label={
              Platform.OS === 'android'
                ? '前往授权「显示在其他应用上层」'
                : '检查画中画可用性'
            }
            onPress={handleRequestPermission}
            disabled={busy}
          />
        ) : null}

        {!state.running ? (
          <PrimaryButton
            label="开启悬浮窗"
            onPress={handleToggle}
            disabled={!state.hasPermission || busy}
          />
        ) : (
          <PrimaryButton
            label="停止悬浮窗"
            onPress={handleToggle}
            disabled={busy}
            variant="stop"
          />
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.note}>{getPlatformHint(state.running)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  body: {
    flex: 1,
    gap: 16,
    paddingTop: 8,
    paddingHorizontal: AppLayout.screenPaddingX,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    backgroundColor: AppTheme.background,
  },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: AppLayout.toolCardRadius,
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  previewCard: {
    gap: 6,
    padding: 16,
    borderRadius: AppLayout.toolCardRadius,
    backgroundColor: AppTheme.surfaceElevated,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  previewTitle: {
    color: AppTheme.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  previewDownload: {
    color: AppTheme.success,
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  previewUpload: {
    color: AppTheme.accent,
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  previewHint: {
    color: AppTheme.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  guideCard: {
    gap: 6,
    padding: 14,
    borderRadius: AppLayout.cardRadius,
    backgroundColor: AppTheme.surfaceElevated,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  guideTitle: {
    color: AppTheme.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  guideText: {
    color: AppTheme.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  unsupportedTitle: {
    color: AppTheme.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  unsupportedText: {
    color: AppTheme.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: AppTheme.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: AppTheme.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  note: {
    color: AppTheme.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
