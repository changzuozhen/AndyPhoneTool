/**
 * Expo Config Plugin：为 Android 原生构建注入国内 Maven / Gradle 镜像。
 * 在 `npx expo prebuild` 生成 android/ 目录时自动生效。
 */
const { withProjectBuildGradle, withSettingsGradle, withGradleProperties } = require('expo/config-plugins');

const ALIYUN_MAVEN_REPOS = `
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/public' }
        maven { url 'https://maven.aliyun.com/repository/central' }
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }`;

const ALIYUN_PLUGIN_REPOS = `
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
        maven { url 'https://maven.aliyun.com/repository/public' }
        maven { url 'https://maven.aliyun.com/repository/google' }`;

function injectRepos(block, marker, repos) {
  if (block.includes('maven.aliyun.com')) {
    return block;
  }
  return block.replace(/repositories\s*\{/, `repositories {${repos}`);
}

function withChinaProjectBuildGradle(config) {
  return withProjectBuildGradle(config, (gradle) => {
    gradle.modResults.contents = injectRepos(
      gradle.modResults.contents,
      'allprojects',
      ALIYUN_MAVEN_REPOS,
    );
    return gradle;
  });
}

function withChinaSettingsGradle(config) {
  return withSettingsGradle(config, (gradle) => {
    let contents = gradle.modResults.contents;
    if (!contents.includes('maven.aliyun.com')) {
      contents = contents.replace(
        /pluginManagement\s*\{[\s\S]*?repositories\s*\{/,
        (match) => `${match}${ALIYUN_PLUGIN_REPOS}`,
      );
      contents = contents.replace(
        /dependencyResolutionManagement\s*\{[\s\S]*?repositories\s*\{/,
        (match) => `${match}${ALIYUN_MAVEN_REPOS}`,
      );
    }
    gradle.modResults.contents = contents;
    return gradle;
  });
}

function withChinaGradleProperties(config) {
  return withGradleProperties(config, (gradle) => {
    gradle.modResults.push({
      type: 'property',
      key: 'systemProp.org.gradle.internal.http.connectionTimeout',
      value: '120000',
    });
    gradle.modResults.push({
      type: 'property',
      key: 'systemProp.org.gradle.internal.http.socketTimeout',
      value: '120000',
    });
    return gradle;
  });
}

/** @param {import('@expo/config-types').ExpoConfig} config */
module.exports = function withChinaMirrors(config) {
  config = withChinaProjectBuildGradle(config);
  config = withChinaSettingsGradle(config);
  config = withChinaGradleProperties(config);
  return config;
};
