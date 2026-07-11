import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTheme } from '@/constants/theme';

type ScreenHeaderProps = {
  title: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
  variant?: 'default' | 'overlay';
};

export function ScreenHeader({
  title,
  onBack,
  rightSlot,
  variant = 'default',
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const isOverlay = variant === 'overlay';

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable
        style={[styles.iconButton, isOverlay && styles.iconButtonOverlay]}
        onPress={onBack}
        hitSlop={8}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={isOverlay ? '#fff' : AppTheme.textPrimary}
        />
      </Pressable>
      <Text style={[styles.title, isOverlay && styles.titleOverlay]}>{title}</Text>
      {rightSlot ?? <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.surface,
  },
  iconButtonOverlay: {
    backgroundColor: AppTheme.overlayButton,
  },
  title: {
    color: AppTheme.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  titleOverlay: {
    color: '#fff',
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});
