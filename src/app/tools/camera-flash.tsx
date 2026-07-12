import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrightnessSlider } from '@/components/BrightnessSlider';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AppTheme } from '@/constants/theme';

const DEFAULT_BRIGHTNESS = 0.75;
const MIN_TORCH_BRIGHTNESS = 0.05;

export default function CameraFlashToolScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [brightness, setBrightness] = useState(DEFAULT_BRIGHTNESS);
  const [zoom, setZoom] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [torchActive, setTorchActive] = useState(false);
  const baseZoom = useRef(0);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const updateZoom = (nextZoom: number) => {
    const clamped = Math.min(1, Math.max(0, nextZoom));
    setZoom(clamped);
    baseZoom.current = clamped;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const next = baseZoom.current + (event.scale - 1) * 0.35;
      runOnJS(updateZoom)(next);
    });

  const torchEnabled = brightness >= MIN_TORCH_BRIGHTNESS;

  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  // 相机就绪后延迟开启 torch（解决 expo-camera 首次 enableTorch 不生效）
  useEffect(() => {
    if (!cameraReady || !torchEnabled) {
      if (cameraReady) {
        setTorchActive(false);
      }
      return;
    }

    setTorchActive(false);
    const timer = setTimeout(() => setTorchActive(true), 80);
    return () => clearTimeout(timer);
  }, [cameraReady, torchEnabled]);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={AppTheme.accent} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: '手电筒相机', headerShown: false }} />
        <Ionicons name="camera-outline" size={48} color={AppTheme.textSecondary} />
        <Text style={styles.permissionTitle}>需要相机权限</Text>
        <Text style={styles.permissionText}>
          手电筒相机需要访问后置摄像头与闪光灯，用于照明与预览。
        </Text>
        <View style={styles.permissionButton}>
          <PrimaryButton label="授权相机" onPress={requestPermission} />
        </View>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>返回</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: '手电筒相机', headerShown: false }} />
      <View style={styles.cameraContainer}>
        <GestureDetector gesture={pinchGesture}>
          <View style={StyleSheet.absoluteFill}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              autofocus="off"
              enableTorch={torchActive}
              torchLevel={brightness}
              zoom={zoom}
              onCameraReady={handleCameraReady}
            />
          </View>
        </GestureDetector>

        <View style={[styles.focusRing, styles.focusRingCenter]} pointerEvents="none">
          <View style={styles.focusCornerTL} />
          <View style={styles.focusCornerTR} />
          <View style={styles.focusCornerBL} />
          <View style={styles.focusCornerBR} />
        </View>

        <View style={[styles.topBar, { paddingTop: insets.top }]} pointerEvents="box-none">
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.topTitle} numberOfLines={1}>
            手电筒相机
          </Text>
          <View style={styles.zoomBadge}>
            <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
          </View>
        </View>

        <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 32 }]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, torchEnabled && styles.statusDotOn]} />
            <Text style={styles.statusText}>
              {torchEnabled ? '闪光灯已开启' : '闪光灯已关闭'}
            </Text>
            <Text style={styles.hintText}>双指捏合缩放 · 系统自动对焦</Text>
          </View>
          <BrightnessSlider value={brightness} onValueChange={setBrightness} />
          <Text style={styles.platformNote}>
            亮度通过原生 torch 级别调节；低于 5% 关闭闪光灯。
          </Text>
        </View>
      </View>
    </View>
  );
}

const cornerBase = {
  position: 'absolute' as const,
  width: 18,
  height: 18,
  borderColor: AppTheme.accentWarm,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    backgroundColor: AppTheme.background,
  },
  permissionTitle: {
    color: AppTheme.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  permissionText: {
    color: AppTheme.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionButton: {
    marginTop: 8,
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: 320,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: AppTheme.textSecondary,
    fontSize: 14,
  },
  focusRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 4,
  },
  focusRingCenter: {
    top: '42%',
    left: '50%',
    marginLeft: -36,
    marginTop: -36,
  },
  focusCornerTL: {
    ...cornerBase,
    top: -1,
    left: -1,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  focusCornerTR: {
    ...cornerBase,
    top: -1,
    right: -1,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  focusCornerBL: {
    ...cornerBase,
    bottom: -1,
    left: -1,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  focusCornerBR: {
    ...cornerBase,
    bottom: -1,
    right: -1,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.overlayButton,
  },
  topTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    flexShrink: 1,
  },
  zoomBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: AppTheme.overlayButton,
  },
  zoomText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: AppTheme.overlayScrim,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.textSecondary,
  },
  statusDotOn: {
    backgroundColor: AppTheme.accentWarm,
  },
  statusText: {
    color: AppTheme.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  hintText: {
    flex: 1,
    color: AppTheme.textSecondary,
    fontSize: 12,
  },
  platformNote: {
    color: AppTheme.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
});
