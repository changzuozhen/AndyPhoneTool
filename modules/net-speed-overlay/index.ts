// Re-export the native module. On web, it will be resolved to NetSpeedOverlayModule.web.ts
// and on native platforms to NetSpeedOverlayModule.ts
export { default } from './src/NetSpeedOverlayModule';
export * from './src/NetSpeedOverlay.types';
