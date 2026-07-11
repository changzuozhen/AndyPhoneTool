import { createCli } from './cli.js';

/** 将 argv 交给 commander 执行（不含 repeat / interactive 逻辑） */
export async function dispatchArgv(argv: string[]): Promise<void> {
  const program = createCli();
  await program.parseAsync(['node', 'aptool', ...argv]);
}
