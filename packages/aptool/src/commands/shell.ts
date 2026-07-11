import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { cancel, confirm, isCancel } from '@clack/prompts';

import { findProjectRoot } from '../lib/project.js';

const MARKER_BEGIN = '# >>> AndyPhoneTool aptool >>>';
const MARKER_END = '# <<< AndyPhoneTool aptool <<<';

function getZshrcPath(): string {
  return join(homedir(), '.zshrc');
}

function buildBlock(projectRoot: string, cliPath: string): string {
  return [
    MARKER_BEGIN,
    `aptool() { node "${cliPath}" "$@"; }`,
    MARKER_END,
  ].join('\n');
}

function readZshrc(): string {
  const path = getZshrcPath();
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8');
}

export function shellStatus(): void {
  const content = readZshrc();
  const installed = content.includes(MARKER_BEGIN);
  const root = findProjectRoot();
  const cliPath = join(root, 'packages/aptool/dist/index.js');

  console.log(`zsh 注入: ${installed ? '已安装' : '未安装'}`);
  console.log(`项目根目录: ${root}`);
  console.log(`CLI 路径: ${cliPath}`);
  console.log(`CLI 已构建: ${existsSync(cliPath) ? '是' : '否（请先 npm run aptool:build）'}`);
}

export async function shellInstall(options?: { yes?: boolean }): Promise<void> {
  const root = findProjectRoot();
  const cliPath = join(root, 'packages/aptool/dist/index.js');

  if (!existsSync(cliPath)) {
    console.log('CLI 尚未构建，正在执行 npm run aptool:build ...');
    const { runCommand } = await import('../lib/executor.js');
    await runCommand('npm', ['run', 'aptool:build'], { cwd: root });
  }

  const zshrcPath = getZshrcPath();
  let content = readZshrc();

  if (content.includes(MARKER_BEGIN)) {
    console.log('aptool 已注入 ~/.zshrc，无需重复安装。');
    console.log('如需更新路径，请先 aptool shell uninstall 再 install。');
    return;
  }

  if (!options?.yes) {
    const ok = await confirm({
      message: `将向 ~/.zshrc 注入 aptool 函数（仅 3 行，无 alias）。继续？`,
    });
    if (isCancel(ok) || !ok) {
      cancel('已取消');
      return;
    }
  }

  const block = buildBlock(root, cliPath);
  const suffix = content.endsWith('\n') || content.length === 0 ? '' : '\n';
  writeFileSync(zshrcPath, `${content}${suffix}\n${block}\n`, 'utf8');

  console.log('\n✓ 已注入 ~/.zshrc');
  console.log('  执行 source ~/.zshrc 或重新打开终端后，即可全局使用 aptool');
}

export async function shellUninstall(): Promise<void> {
  const zshrcPath = getZshrcPath();
  const content = readZshrc();

  if (!content.includes(MARKER_BEGIN)) {
    console.log('未找到 aptool 标记块，无需卸载。');
    return;
  }

  const pattern = new RegExp(
    `${MARKER_BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n?`,
  );
  const next = content.replace(pattern, '').replace(/\n{3,}/g, '\n\n');
  writeFileSync(zshrcPath, next, 'utf8');
  console.log('✓ 已从 ~/.zshrc 移除 aptool 标记块');
}
