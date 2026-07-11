import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';
import type { ToolDefinition } from '@/constants/tools';

type ToolCardProps = {
  tool: ToolDefinition;
};

const ICON_MAP = {
  flashlight: 'flashlight',
  'hardware-chip': 'hardware-chip-outline',
  speedometer: 'speedometer-outline',
  construct: 'construct-outline',
} as const;

export function ToolCard({ tool }: ToolCardProps) {
  const iconName = ICON_MAP[tool.icon];

  if (!tool.available) {
    return (
      <View style={[styles.card, styles.cardDisabled]}>
        <View style={[styles.iconWrap, styles.iconWrapDisabled]}>
          <Ionicons name={iconName} size={28} color={AppTheme.textSecondary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.titleDisabled}>{tool.title}</Text>
          <Text style={styles.description}>{tool.description}</Text>
          <Text style={styles.badge}>即将推出</Text>
        </View>
      </View>
    );
  }

  return (
    <Link href={tool.route} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.iconWrap}>
          <Ionicons name={iconName} size={28} color={AppTheme.accentWarm} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{tool.title}</Text>
          <Text style={styles.description}>{tool.description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={AppTheme.textSecondary} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: AppTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.border,
    padding: 18,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  cardDisabled: {
    opacity: 0.55,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.surfaceElevated,
  },
  iconWrapDisabled: {
    backgroundColor: AppTheme.surface,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: AppTheme.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  titleDisabled: {
    color: AppTheme.textSecondary,
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    color: AppTheme.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    marginTop: 4,
    alignSelf: 'flex-start',
    color: AppTheme.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
