export type CommandMeta = {
  id: string;
  group: string;
  action: string;
  description: string;
  examples: string[];
  longTask?: boolean;
  recommended?: boolean;
};

export const commandRegistry: CommandMeta[] = [
  {
    id: 'dev:start',
    group: 'dev',
    action: 'start',
    description: '启动 Metro 开发服务',
    examples: ['aptool dev start', 'aptool d'],
  },
  {
    id: 'dev:android',
    group: 'dev',
    action: 'android',
    description: 'Expo Go 快速预览 Android',
    examples: ['aptool dev android'],
  },
  {
    id: 'dev:ios',
    group: 'dev',
    action: 'ios',
    description: 'Expo Go 快速预览 iOS',
    examples: ['aptool dev ios'],
  },
  {
    id: 'dev:run-android',
    group: 'dev',
    action: 'run-android',
    description: 'Dev Build 真机 Android（相机/闪光灯完整支持）',
    examples: ['aptool dev run-android', 'aptool adr'],
    longTask: true,
    recommended: true,
  },
  {
    id: 'dev:run-ios',
    group: 'dev',
    action: 'run-ios',
    description: 'Dev Build 真机 iOS（默认优先已连接真机）',
    examples: ['aptool dev run-ios', 'aptool ai'],
    longTask: true,
  },
  {
    id: 'build:android:debug',
    group: 'build',
    action: 'android debug',
    description: '构建 Android Debug APK',
    examples: ['aptool build android debug', 'aptool bbd'],
    longTask: true,
  },
  {
    id: 'build:android:release',
    group: 'build',
    action: 'android release',
    description: '构建 Android Release APK（未签名）',
    examples: ['aptool build android release', 'aptool bar'],
    longTask: true,
  },
  {
    id: 'build:ios:debug',
    group: 'build',
    action: 'ios debug',
    description: '构建 iOS Debug',
    examples: ['aptool build ios debug'],
    longTask: true,
  },
  {
    id: 'build:ios:release',
    group: 'build',
    action: 'ios release',
    description: '构建 iOS Release（需 Xcode 签名）',
    examples: ['aptool build ios release'],
    longTask: true,
  },
  {
    id: 'meta:repeat',
    group: 'repeat',
    action: '',
    description: '重复执行上一次命令（参数与设备配置不变）',
    examples: ['aptool repeat', 'aptool rr'],
  },
  {
    group: 'env',
    action: 'setup-cn',
    description: '配置国内 npm 镜像与环境变量',
    examples: ['aptool env setup-cn'],
  },
  {
    id: 'shell:install',
    group: 'shell',
    action: 'install',
    description: '向 ~/.zshrc 注入 aptool 函数（仅 3 行）',
    examples: ['aptool shell install'],
  },
  {
    id: 'shell:uninstall',
    group: 'shell',
    action: 'uninstall',
    description: '从 ~/.zshrc 移除 aptool 标记块',
    examples: ['aptool shell uninstall'],
  },
  {
    id: 'shell:status',
    group: 'shell',
    action: 'status',
    description: '检查 zsh 注入状态',
    examples: ['aptool shell status'],
  },
];

export function formatCommandList(): string {
  return commandRegistry
    .map((cmd) => {
      const full = `aptool ${cmd.group} ${cmd.action}`;
      const tag = cmd.recommended ? ' [推荐]' : '';
      return `  ${full.padEnd(32)} ${cmd.description}${tag}\n    例: ${cmd.examples.join(', ')}`;
    })
    .join('\n');
}
