import { Command } from 'commander';

import {
  buildAndroid,
  buildIos,
  devAndroid,
  devIos,
  devRunAndroid,
  devRunIos,
  devStart,
  envSetupCn,
} from './commands/dev.js';
import { shellInstall, shellStatus, shellUninstall } from './commands/shell.js';
import { printHelp, printList } from './interactive/app.js';

export function createCli(): Command {
  const program = new Command();

  program
    .name('aptool')
    .description('AndyPhoneTool 开发 CLI — Expo 开发/构建快捷入口')
    .version('0.1.0');

  const dev = program.command('dev').description('本地开发调试');

  dev
    .command('start')
    .description('启动 Metro 开发服务')
    .action(async () => devStart());

  dev
    .command('android')
    .description('Expo Go 快速预览 Android')
    .action(async () => devAndroid());

  dev
    .command('ios')
    .description('Expo Go 快速预览 iOS')
    .action(async () => devIos());

  dev
    .command('run-android')
    .description('Dev Build 真机 Android（相机/闪光灯完整支持）')
    .action(async () => devRunAndroid());

  dev
    .command('run-ios')
    .description('Dev Build 真机/模拟器 iOS')
    .action(async () => devRunIos());

  const build = program.command('build').description('本地构建安装包');

  build
    .command('android')
    .description('Android 构建')
    .argument('<variant>', 'debug | release')
    .action(async (variant: string) => {
      if (variant !== 'debug' && variant !== 'release') {
        throw new Error('variant 必须是 debug 或 release');
      }
      await buildAndroid(variant);
    });

  build
    .command('ios')
    .description('iOS 构建')
    .argument('<variant>', 'debug | release')
    .action(async (variant: string) => {
      if (variant !== 'debug' && variant !== 'release') {
        throw new Error('variant 必须是 debug 或 release');
      }
      await buildIos(variant);
    });

  const env = program.command('env').description('环境配置');

  env
    .command('setup-cn')
    .description('配置国内 npm 镜像与环境变量')
    .action(async () => envSetupCn());

  const shell = program.command('shell').description('zsh 集成（最小侵入）');

  shell
    .command('install')
    .description('向 ~/.zshrc 注入 aptool 函数')
    .action(async () => shellInstall());

  shell
    .command('uninstall')
    .description('从 ~/.zshrc 移除 aptool 标记块')
    .action(async () => shellUninstall());

  shell
    .command('status')
    .description('检查 zsh 注入状态')
    .action(() => shellStatus());

  program
    .command('help')
    .description('显示帮助')
    .action(() => printHelp());

  program
    .command('list')
    .description('列出全部命令')
    .action(() => printList());

  return program;
}
