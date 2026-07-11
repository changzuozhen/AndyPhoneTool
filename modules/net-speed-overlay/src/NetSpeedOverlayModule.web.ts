import { NativeModule, registerWebModule } from 'expo';

import type { NetSpeedOverlayModuleEvents } from './NetSpeedOverlay.types';

class NetSpeedOverlayModule extends NativeModule<NetSpeedOverlayModuleEvents> {
  isSupported(): boolean {
    return false;
  }

  async hasPermission(): Promise<boolean> {
    return false;
  }

  async requestPermission(): Promise<boolean> {
    return false;
  }

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  async isRunning(): Promise<boolean> {
    return false;
  }
}

export default registerWebModule(NetSpeedOverlayModule, 'NetSpeedOverlay');
