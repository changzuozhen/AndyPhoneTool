import * as p from '@clack/prompts';

import type { ProjectContext } from '../lib/project.js';
import { formatCommandList } from '../config/registry.js';
import { getShortcutEntries } from '../config/shortcuts.js';
import { envSetupCn, promptBuildMenu, promptDevMenu } from '../commands/dev.js';
import { shellInstall, shellStatus, shellUninstall } from '../commands/shell.js';
import { loadLastRun, saveLastRun, formatLastRunHint } from '../lib/history.js';

function printStatusBar(ctx: ProjectContext, breadcrumb: string): void {
  p.intro('AndyPhoneTool aptool');
  p.note(
    [
      `📁 ${ctx.root}`,
      `🟢 Node ${ctx.nodeVersion}${ctx.expoVersion ? `  ·  Expo SDK ${ctx.expoVersion}` : ''}`,
      `🤖 android/ ${ctx.hasAndroid ? '✓' : '✗'}    ios/ ${ctx.hasIos ? '✓' : '✗'}`,
      `📦 Registry: ${ctx.registry ?? 'default'}`,
      `📍 ${breadcrumb}`,
      `⚡ 推荐: aptool dev run-android（相机/闪光灯需 Dev Build）`,
    ].join('\n'),
    '全局配置',
  );
}

export async function runInteractive(ctx: ProjectContext): Promise<void> {
  let running = true;

  while (running) {
    printStatusBar(ctx, '首页');

    const lastHint = formatLastRunHint(loadLastRun(ctx.root));
    const options = [
      ...(lastHint
        ? [{ value: 'repeat' as const, label: '↻ 重复上一次', hint: lastHint }]
        : []),
      { value: 'dev' as const, label: '开发调试', hint: 'Metro / Expo Go / Dev Build' },
      { value: 'build' as const, label: '构建安装包', hint: 'Android / iOS debug & release' },
      { value: 'env' as const, label: '环境配置', hint: 'aptool env setup-cn' },
      { value: 'shell' as const, label: 'Shell 集成', hint: 'aptool shell install' },
      { value: 'help' as const, label: '查看命令列表', hint: 'aptool list' },
      { value: 'quit' as const, label: '退出' },
    ];

    const choice = await p.select({
      message: '你要做什么？',
      options,
    });

    if (p.isCancel(choice) || choice === 'quit') {
      p.outro('再见');
      running = false;
      continue;
    }

    switch (choice) {
      case 'repeat': {
        const last = loadLastRun(ctx.root);
        if (!last) break;
        const { dispatchArgv } = await import('../dispatch.js');
        await dispatchArgv(last.argv);
        saveLastRun(ctx.root, last.argv, last.label);
        break;
      }
      case 'dev':
        printStatusBar(ctx, '首页 › 开发调试');
        await promptDevMenu(ctx);
        break;
      case 'build':
        printStatusBar(ctx, '首页 › 构建安装包');
        await promptBuildMenu();
        break;
      case 'env': {
        const ok = await p.confirm({ message: '配置国内 npm 镜像与环境变量？' });
        if (!p.isCancel(ok) && ok) await envSetupCn();
        break;
      }
      case 'shell': {
        const action = await p.select({
          message: 'Shell 集成',
          options: [
            { value: 'install', label: '注入 zsh（仅 function，无 alias）' },
            { value: 'uninstall', label: '卸载 zsh 标记块' },
            { value: 'status', label: '查看状态' },
            { value: 'back', label: '‹ 返回' },
          ],
        });
        if (p.isCancel(action) || action === 'back') break;
        if (action === 'install') await shellInstall();
        if (action === 'uninstall') await shellUninstall();
        if (action === 'status') shellStatus();
        break;
      }
      case 'help':
        printHelp();
        await p.confirm({ message: '按 Enter 继续' });
        break;
    }
  }
}

export function printHelp(): void {
  console.log('\naptool — AndyPhoneTool 开发 CLI\n');
  console.log(formatCommandList());
  console.log('\n项目内快捷码（不写 zshrc）：');
  for (const { key, expandsTo } of getShortcutEntries()) {
    console.log(`  aptool ${key.padEnd(6)} → aptool ${expandsTo}`);
  }
  console.log('\n无参数运行 aptool 进入交互模式。');
}

export function printList(): void {
  printHelp();
}
