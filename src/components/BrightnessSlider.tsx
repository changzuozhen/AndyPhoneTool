import { useRef } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';

type BrightnessSliderProps = {
  value: number;
  onValueChange: (value: number) => void;
};

export function BrightnessSlider({ value, onValueChange }: BrightnessSliderProps) {
  const trackWidth = useRef(0);

  const updateFromX = (x: number) => {
    if (trackWidth.current <= 0) return;
    const next = Math.min(1, Math.max(0, x / trackWidth.current));
    onValueChange(next);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => updateFromX(event.nativeEvent.locationX),
      onPanResponderMove: (event) => updateFromX(event.nativeEvent.locationX),
    }),
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>闪光灯亮度</Text>
        <Text style={styles.value}>{Math.round(value * 100)}%</Text>
      </View>
      <View
        style={styles.track}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View style={[styles.fill, { width: `${value * 100}%` }]} />
        <View style={[styles.thumb, { left: `${value * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: AppTheme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: AppTheme.accentWarm,
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    overflow: 'visible',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 179, 71, 0.45)',
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    borderRadius: 12,
    backgroundColor: AppTheme.accentWarm,
    borderWidth: 2,
    borderColor: '#FFF8EC',
  },
});
