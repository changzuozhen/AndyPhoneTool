import { StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';

type HeroBlockProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export function HeroBlock({ icon, title, description }: HeroBlockProps) {
  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 10,
    paddingVertical: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  title: {
    color: AppTheme.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  description: {
    color: AppTheme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
