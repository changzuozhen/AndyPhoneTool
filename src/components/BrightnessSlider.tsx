import { useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

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

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .activeOffsetX([-4, 4])
    .onBegin((event) => {
      runOnJS(updateFromX)(event.x);
    })
    .onUpdate((event) => {
      runOnJS(updateFromX)(event.x);
    });

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.touchArea} onLayout={onLayout}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${value * 100}%` }]} />
            <View style={[styles.thumb, { left: `${value * 100}%` }]} />
          </View>
        </View>
      </GestureDetector>
      <Text style={styles.value}>亮度 {Math.round(value * 100)}%</Text>
    </View>
  );
}

const THUMB_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  touchArea: {
    minHeight: 52,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: AppTheme.border,
    justifyContent: 'center',
    overflow: 'visible',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 5,
    backgroundColor: AppTheme.accentWarm,
  },
  thumb: {
    position: 'absolute',
    top: (10 - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -THUMB_SIZE / 2,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: AppTheme.accentWarm,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  value: {
    color: AppTheme.textSecondary,
    fontSize: 12,
  },
});
