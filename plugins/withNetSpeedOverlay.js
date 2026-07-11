/**
 * Expo Config Plugin：为网速悬浮窗注入 Android 权限/Service 与 iOS Background Mode。
 */
const {
  AndroidConfig,
  withAndroidManifest,
  withInfoPlist,
} = require('expo/config-plugins');

const ANDROID_PERMISSIONS = [
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_SPECIAL_USE',
  'android.permission.POST_NOTIFICATIONS',
];

const SERVICE_CLASS = 'expo.modules.netspeedoverlay.NetSpeedService';

function ensurePermission(manifest, permission) {
  if (!manifest['uses-permission']) {
    manifest['uses-permission'] = [];
  }

  const exists = manifest['uses-permission'].some(
    (item) => item.$?.['android:name'] === permission,
  );

  if (!exists) {
    manifest['uses-permission'].push({
      $: { 'android:name': permission },
    });
  }
}

function withNetSpeedAndroidManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    ANDROID_PERMISSIONS.forEach((permission) => {
      ensurePermission(manifest, permission);
    });

    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    const hasService = mainApplication.service.some(
      (service) => service.$?.['android:name'] === SERVICE_CLASS,
    );

    if (!hasService) {
      mainApplication.service.push({
        $: {
          'android:name': SERVICE_CLASS,
          'android:enabled': 'true',
          'android:exported': 'false',
          'android:foregroundServiceType': 'specialUse',
        },
        property: [
          {
            $: {
              'android:name': 'android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE',
              'android:value': 'network speed overlay',
            },
          },
        ],
      });
    }

    return config;
  });
}

function withNetSpeedInfoPlist(config) {
  return withInfoPlist(config, (config) => {
    const modes = config.modResults.UIBackgroundModes ?? [];
    if (!modes.includes('audio')) {
      config.modResults.UIBackgroundModes = [...modes, 'audio'];
    }
    return config;
  });
}

/** @param {import('@expo/config-types').ExpoConfig} config */
module.exports = function withNetSpeedOverlay(config) {
  config = withNetSpeedAndroidManifest(config);
  config = withNetSpeedInfoPlist(config);
  return config;
};
