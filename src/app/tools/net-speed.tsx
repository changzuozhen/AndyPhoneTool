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

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusRow } from '@/components/StatusRow';
import { AppLayout, AppTheme } from '@/constants/theme';
import NetSpeedOverlay from 'net-speed-overlay';

type OverlayState = {
  supported: boolean;
  hasPermission: boolean;
  running: boolean;
};

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

  const handleRequestPermission = async () => {
    setBusy(true);
    setError(null);
    try {
      await NetSpeedOverlay.requestPermission();
      await refreshState();
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
        await NetSpeedOverlay.start();
      }
      await refreshState();
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败，请稍后重试');
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
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="speedometer-outline" size={36} color={AppTheme.accentWarm} />
          </View>
          <Text style={styles.heroTitle}>实时网速 · 盖在其他 App 上</Text>
          <Text style={styles.heroText}>
            {Platform.OS === 'ios'
              ? '开启后请切到后台，系统会以画中画小窗显示网速。'
              : '开启后可在任意 App 上方看到悬浮网速条，按住可拖动位置。'}
          </Text>
        </View>

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

        {!state.hasPermission && (
          <PrimaryButton
            label={
              Platform.OS === 'android'
                ? '前往授权「显示在其他应用上层」'
                : '检查画中画可用性'
            }
            onPress={handleRequestPermission}
            disabled={busy}
          />
        )}

        <PrimaryButton
          label={state.running ? '停止悬浮窗' : '开启悬浮窗'}
          onPress={handleToggle}
          disabled={!state.hasPermission || busy}
          variant={state.running ? 'stop' : 'primary'}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.note}>
          {Platform.OS === 'android'
            ? 'Android 已支持系统悬浮窗与 TrafficStats 实时网速。iOS 画中画将在后续阶段实现。'
            : 'iOS 画中画实现将在后续阶段完成。'}
        </Text>
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
  hero: {
    gap: 10,
    paddingVertical: 8,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  heroTitle: {
    color: AppTheme.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  heroText: {
    color: AppTheme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: AppLayout.toolCardRadius,
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
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
    color: '#FF8A8A',
    fontSize: 13,
    lineHeight: 18,
  },
  note: {
    color: AppTheme.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
