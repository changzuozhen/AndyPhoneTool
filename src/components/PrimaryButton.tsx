import { Pressable, StyleSheet, Text } from 'react-native';

import { AppLayout, AppTheme } from '@/constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'stop';
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        variant === 'stop' && styles.stop,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: AppLayout.buttonHeight,
    borderRadius: AppLayout.buttonRadius,
    backgroundColor: AppTheme.accent,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stop: {
    backgroundColor: AppTheme.stop,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
