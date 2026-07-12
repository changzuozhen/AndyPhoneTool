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
      <View style={styles.touchArea} onLayout={onLayout} {...panResponder.panHandlers}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${value * 100}%` }]} />
          <View style={[styles.thumb, { left: `${value * 100}%` }]} />
        </View>
      </View>
      <Text style={styles.value}>亮度 {Math.round(value * 100)}%</Text>
    </View>
  );
}

const THUMB_SIZE = 22;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  touchArea: {
    paddingVertical: 18,
    justifyContent: 'center',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.border,
    justifyContent: 'center',
    overflow: 'visible',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
    backgroundColor: AppTheme.accentWarm,
  },
  thumb: {
    position: 'absolute',
    top: (8 - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -THUMB_SIZE / 2,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: AppTheme.accentWarm,
  },
  value: {
    color: AppTheme.textSecondary,
    fontSize: 12,
  },
});
