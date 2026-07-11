import { StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';

type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.bar} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: AppTheme.accent,
  },
  title: {
    color: AppTheme.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
