import { StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';

type StatusRowProps = {
  label: string;
  value: string;
  active?: boolean;
};

export function StatusRow({ label, value, active = false }: StatusRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, active && styles.dotActive]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.textSecondary,
  },
  dotActive: {
    backgroundColor: AppTheme.accentWarm,
  },
  label: {
    color: AppTheme.textSecondary,
    fontSize: 13,
    width: 72,
  },
  value: {
    flex: 1,
    color: AppTheme.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
});
