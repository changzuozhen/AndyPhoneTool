import { expandShortcut } from './config/shortcuts.js';
import { createCli } from './cli.js';
import { runInteractive } from './interactive/app.js';
import { loadProjectContext } from './lib/project.js';

async function main(): Promise<void> {
  const rawArgv = process.argv.slice(2);
  const argv = expandShortcut(rawArgv);

  // 无参数 → 交互模式
  if (argv.length === 0) {
    const ctx = loadProjectContext();
    await runInteractive(ctx);
    return;
  }

  // help / list 直接处理（避免 commander 默认 help 覆盖）
  if (argv.length >= 1 && argv[0] === 'list') {
    const { printList } = await import('./interactive/app.js');
    printList();
    return;
  }

  if (argv.length >= 1 && (argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h')) {
    const { printHelp } = await import('./interactive/app.js');
    printHelp();
    return;
  }

  const program = createCli();
  await program.parseAsync(['node', 'aptool', ...argv]);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n✗ ${message}`);
  process.exit(1);
});
