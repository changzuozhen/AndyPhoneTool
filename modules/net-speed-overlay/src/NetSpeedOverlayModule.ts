import { NativeModule, requireNativeModule } from 'expo';

import type { NetSpeedOverlayModuleEvents, NetSpeedSample } from './NetSpeedOverlay.types';

declare class NetSpeedOverlayModule extends NativeModule<NetSpeedOverlayModuleEvents> {
  isSupported(): boolean;
  hasPermission(): Promise<boolean>;
  requestPermission(): Promise<boolean>;
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): Promise<boolean>;
  getLastSpeed(): Promise<NetSpeedSample>;
}

export default requireNativeModule<NetSpeedOverlayModule>('NetSpeedOverlay');
