import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ToolCard } from '@/components/ToolCard';
import { AppTheme } from '@/constants/theme';
import { TOOLS } from '@/constants/tools';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.appName}>AndyPhoneTool</Text>
        <Text style={styles.subtitle}>手机快捷工具箱 · 一触即达</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>工具</Text>
        <View style={styles.toolList}>
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.background,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 28,
    gap: 6,
  },
  appName: {
    color: AppTheme.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: AppTheme.textSecondary,
    fontSize: 14,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    color: AppTheme.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  toolList: {
    gap: 12,
  },
});
