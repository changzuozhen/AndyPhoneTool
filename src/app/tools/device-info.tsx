import {
  BatteryState,
  useBatteryLevel,
  useBatteryState,
  useLowPowerMode,
} from 'expo-battery';
import * as Device from 'expo-device';
import { getIpAddressAsync, useNetworkState } from 'expo-network';
import { Stack, useRouter } from 'expo-router';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { AppLayout, AppTheme } from '@/constants/theme';

type Vector = { x: number; y: number; z: number };

const ZERO_VECTOR: Vector = { x: 0, y: 0, z: 0 };
const SENSOR_INTERVAL_MS = 300;

const BATTERY_STATE_LABEL: Record<number, string> = {
  [BatteryState.UNKNOWN]: '未知',
  [BatteryState.UNPLUGGED]: '使用电池中',
  [BatteryState.CHARGING]: '充电中',
  [BatteryState.FULL]: '已充满',
  [BatteryState.NOT_CHARGING]: '未充电',
};

function formatUptime(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const hhmm = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return days > 0 ? `${days} 天 ${hhmm}` : hhmm;
}

function formatMemory(bytes: number | null): string | null {
  if (bytes == null) return null;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

export default function DeviceInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [uptime, setUptime] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [accel, setAccel] = useState<Vector>(ZERO_VECTOR);
  const [gyro, setGyro] = useState<Vector>(ZERO_VECTOR);
  const [magnet, setMagnet] = useState<Vector>(ZERO_VECTOR);

  const batteryLevel = useBatteryLevel();
  const batteryState = useBatteryState();
  const lowPowerMode = useLowPowerMode();
  const network = useNetworkState();

  useEffect(() => {
    let mounted = true;
    Device.getUptimeAsync()
      .then((ms) => mounted && setUptime(formatUptime(ms)))
      .catch(() => {});
    getIpAddressAsync()
      .then((ip) => mounted && setIpAddress(ip))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    Accelerometer.setUpdateInterval(SENSOR_INTERVAL_MS);
    Gyroscope.setUpdateInterval(SENSOR_INTERVAL_MS);
    Magnetometer.setUpdateInterval(SENSOR_INTERVAL_MS);
    const subs = [
      Accelerometer.addListener(setAccel),
      Gyroscope.addListener(setGyro),
      Magnetometer.addListener(setMagnet),
    ];
    return () => subs.forEach((sub) => sub.remove());
  }, []);

  const deviceRows: { label: string; value: string }[] = [
    { label: '品牌', value: Device.brand ?? Device.manufacturer ?? '—' },
    { label: '型号', value: Device.modelName ?? '—' },
    {
      label: '系统',
      value: `${Device.osName ?? '—'} ${Device.osVersion ?? ''}`.trim(),
    },
    {
      label: 'CPU 架构',
      value: Device.supportedCpuArchitectures?.[0] ?? '—',
    },
    { label: '运行内存', value: formatMemory(Device.totalMemory) ?? '—' },
    { label: '开机时长', value: uptime ?? '—' },
  ];

  const batteryPercent =
    batteryLevel >= 0 ? Math.round(batteryLevel * 100) : null;

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="设备信息中心" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Section title="设备参数">
          <View style={styles.card}>
            {deviceRows.map((row, index) => (
              <InfoRow
                key={row.label}
                label={row.label}
                value={row.value}
                last={index === deviceRows.length - 1}
              />
            ))}
          </View>
        </Section>

        <Section title="电量">
          <View style={styles.card}>
            <InfoRow
              label="电量"
              value={batteryPercent != null ? `${batteryPercent}%` : '不可用'}
            />
            <InfoRow
              label="状态"
              value={BATTERY_STATE_LABEL[batteryState] ?? '未知'}
            />
            <InfoRow
              label="低电量模式"
              value={lowPowerMode ? '开启' : '关闭'}
              last
            />
          </View>
        </Section>

        <Section title="网络">
          <View style={styles.card}>
            <InfoRow label="类型" value={network.type ?? '未知'} />
            <InfoRow label="已连接" value={network.isConnected ? '是' : '否'} />
            <InfoRow
              label="互联网可达"
              value={network.isInternetReachable ? '是' : '否'}
            />
            <InfoRow label="IP 地址" value={ipAddress ?? '—'} last />
          </View>
        </Section>

        <Section title="传感器 · 实时">
          <View style={styles.sensorRow}>
            <SensorCard title="加速度计" data={accel} axis="x" />
            <SensorCard title="陀螺仪" data={gyro} axis="y" />
            <SensorCard title="磁力计" data={magnet} axis="z" />
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} />
      {children}
    </View>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function SensorCard({
  title,
  data,
  axis,
}: {
  title: string;
  data: Vector;
  axis: 'x' | 'y' | 'z';
}) {
  return (
    <View style={styles.sensorCard}>
      <Text style={styles.sensorTitle}>{title}</Text>
      <Text style={styles.sensorData}>
        {axis}:{data[axis].toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: AppLayout.screenPaddingX,
    gap: AppLayout.sectionGap,
  },
  section: {
    gap: 10,
  },
  card: {
    backgroundColor: AppTheme.surface,
    borderRadius: AppLayout.cardRadius,
    borderWidth: 1,
    borderColor: AppTheme.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
  },
  infoLabel: {
    color: AppTheme.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    flexShrink: 1,
    color: AppTheme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  sensorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sensorCard: {
    flex: 1,
    backgroundColor: AppTheme.surface,
    borderRadius: AppLayout.cardRadius,
    borderWidth: 1,
    borderColor: AppTheme.border,
    padding: 14,
    gap: 8,
  },
  sensorTitle: {
    color: AppTheme.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  sensorData: {
    color: AppTheme.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
});
