import { existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expandShortcut } from './config/shortcuts.js';
import { runInteractive } from './interactive/app.js';
import { findProjectRoot, loadProjectContext } from './lib/project.js';
import { loadLastRun, saveLastRun } from './lib/history.js';
import { runCommand } from './lib/executor.js';
import { dispatchArgv } from './dispatch.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APTOOL_PKG = join(__dirname, '..');
const APTOOL_DIST = join(APTOOL_PKG, 'dist', 'index.js');

async function ensureAptoolBuilt(): Promise<void> {
  if (!existsSync(APTOOL_DIST)) {
    await rebuildAptool();
    return;
  }

  const distMtime = statSync(APTOOL_DIST).mtimeMs;
  const srcDir = join(APTOOL_PKG, 'src');
  let srcNewer = false;

  const walk = (dir: string) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.endsWith('.ts') && statSync(p).mtimeMs > distMtime) {
        srcNewer = true;
      }
    }
  };
  if (existsSync(srcDir)) walk(srcDir);

  if (srcNewer) {
    console.log('⟳ 检测到 aptool 源码更新，正在自动重建...');
    await rebuildAptool();
  }
}

async function rebuildAptool(): Promise<void> {
  const root = findProjectRoot();
  await runCommand('npm', ['run', 'aptool:build'], { cwd: root });
}

async function dispatch(argv: string[]): Promise<void> {
  if (argv.length >= 1 && (argv[0] === 'repeat' || argv[0] === 'rerun' || argv[0] === 'rr')) {
    const root = findProjectRoot();
    const last = loadLastRun(root);
    if (!last) {
      throw new Error('没有可重复的上一次命令。先执行任意 aptool 任务后会自动记录。');
    }
    console.log(`↻ 重复执行: ${last.label}`);
    argv = [...last.argv];
  }

  if (argv.length === 0) {
    await runInteractive(loadProjectContext());
    return;
  }

  if (argv[0] === 'list') {
    const { printList } = await import('./interactive/app.js');
    printList();
    return;
  }

  if (argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h') {
    const { printHelp } = await import('./interactive/app.js');
    printHelp();
    return;
  }

  await dispatchArgv(argv);

  // iOS 命令在内部 recordIosRun 写入带 --device 的完整 argv；此处不覆盖
  const iosSelfSaved =
    (argv[0] === 'dev' && argv[1] === 'run-ios') ||
    (argv[0] === 'build' && argv[1] === 'ios');
  if (!iosSelfSaved) {
    saveLastRun(findProjectRoot(), argv);
  }
}

async function main(): Promise<void> {
  await ensureAptoolBuilt();
  const rawArgv = process.argv.slice(2);
  const argv = expandShortcut(rawArgv);
  await dispatch(argv);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n✗ ${message}`);
  process.exit(1);
});
