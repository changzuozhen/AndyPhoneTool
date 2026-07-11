import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTheme } from '@/constants/theme';
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

  const handleRequestPermission = async () => {
    setBusy(true);
    try {
      await NetSpeedOverlay.requestPermission();
      await refreshState();
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async () => {
    setBusy(true);
    try {
      if (state.running) {
        await NetSpeedOverlay.stop();
      } else {
        await NetSpeedOverlay.start();
      }
      await refreshState();
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
        <Text style={styles.title}>当前平台不支持</Text>
        <Text style={styles.description}>
          网速悬浮窗需要 Android 或 iOS 原生构建，Web 端暂不可用。
        </Text>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>返回</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
      <Stack.Screen options={{ title: '网速悬浮窗', headerShown: false }} />

      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={AppTheme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>网速悬浮窗</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIconWrap}>
          <Ionicons name="speedometer-outline" size={36} color={AppTheme.accentWarm} />
        </View>
        <Text style={styles.heroTitle}>实时网速 · 盖在其他 App 上</Text>
        <Text style={styles.heroText}>
          {Platform.OS === 'ios'
            ? '开启后请切到后台，系统会以画中画小窗显示网速。'
            : '开启后可在任意 App 上方看到悬浮网速条。'}
        </Text>
      </View>

      <View style={styles.card}>
        <StatusRow
          label="原生模块"
          value={state.supported ? '已就绪（脚手架）' : '不可用'}
          ok={state.supported}
        />
        <StatusRow
          label="权限状态"
          value={state.hasPermission ? '已授权' : '未授权'}
          ok={state.hasPermission}
        />
        <StatusRow
          label="运行状态"
          value={state.running ? '运行中（桩实现）' : '已停止'}
          ok={state.running}
        />
      </View>

      {!state.hasPermission && (
        <Pressable
          style={[styles.primaryButton, busy && styles.buttonDisabled]}
          disabled={busy}
          onPress={handleRequestPermission}>
          <Text style={styles.primaryButtonText}>
            {Platform.OS === 'android' ? '前往授权「显示在其他应用上层」' : '检查画中画可用性'}
          </Text>
        </Pressable>
      )}

      <Pressable
        style={[
          styles.primaryButton,
          (!state.hasPermission || busy) && styles.buttonDisabled,
          state.running && styles.stopButton,
        ]}
        disabled={!state.hasPermission || busy}
        onPress={handleToggle}>
        <Text style={styles.primaryButtonText}>
          {state.running ? '停止悬浮窗' : '开启悬浮窗'}
        </Text>
      </Pressable>

      <Text style={styles.note}>
        当前为阶段 1 脚手架：原生接口已接通，悬浮窗渲染与网速采集将在后续阶段实现。
      </Text>
    </View>
  );
}

function StatusRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <View style={styles.statusRow}>
      <View style={[styles.statusDot, ok && styles.statusDotOn]} />
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppTheme.background,
    paddingHorizontal: 20,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    backgroundColor: AppTheme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.surface,
  },
  iconButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    color: AppTheme.textPrimary,
    fontSize: 17,
    fontWeight: '700',
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
    borderRadius: 16,
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.textSecondary,
  },
  statusDotOn: {
    backgroundColor: AppTheme.accentWarm,
  },
  statusLabel: {
    color: AppTheme.textSecondary,
    fontSize: 13,
    width: 72,
  },
  statusValue: {
    flex: 1,
    color: AppTheme.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  title: {
    color: AppTheme.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  description: {
    color: AppTheme.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: AppTheme.accent,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#8B3A3A',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: AppTheme.textSecondary,
    fontSize: 14,
  },
  note: {
    color: AppTheme.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
