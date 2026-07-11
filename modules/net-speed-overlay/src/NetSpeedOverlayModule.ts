import { NativeModule, requireNativeModule } from 'expo';

import type { NetSpeedOverlayModuleEvents } from './NetSpeedOverlay.types';

declare class NetSpeedOverlayModule extends NativeModule<NetSpeedOverlayModuleEvents> {
  isSupported(): boolean;
  hasPermission(): Promise<boolean>;
  requestPermission(): Promise<boolean>;
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): Promise<boolean>;
}

export default requireNativeModule<NetSpeedOverlayModule>('NetSpeedOverlay');
