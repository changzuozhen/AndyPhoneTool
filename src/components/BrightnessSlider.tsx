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
      <View
        style={styles.track}
        onLayout={onLayout}
        {...panResponder.panHandlers}>
        <View style={[styles.fill, { width: `${value * 100}%` }]} />
      </View>
      <Text style={styles.value}>亮度 {Math.round(value * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: AppTheme.border,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 3,
    backgroundColor: AppTheme.accentWarm,
  },
  value: {
    color: AppTheme.textSecondary,
    fontSize: 12,
  },
});
