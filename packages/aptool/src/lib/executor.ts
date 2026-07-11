import { spawn } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { Listr } from 'listr2';

import { loadEnvLocal } from './project.js';
import { getMetroEnvForIosTarget } from './ios-devices.js';

export type RunOptions = {
  cwd: string;
  env?: Record<string, string>;
  longTask?: boolean;
  taskTitle?: string;
  steps?: Array<{ title: string; command: string; args?: string[]; cwd?: string; env?: Record<string, string> }>;
};

function mergeEnv(cwd: string, extra?: Record<string, string>): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ...loadEnvLocal(cwd),
    EXPO_NO_TELEMETRY: '1',
    ...extra,
  };
}

export function runCommand(
  command: string,
  args: string[],
  options: { cwd: string; env?: Record<string, string> },
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: mergeEnv(options.cwd, options.env),
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`命令失败 (${code}): ${command} ${args.join(' ')}`));
    });
  });
}

export async function runWithSteps(options: RunOptions): Promise<void> {
  const { cwd, steps, taskTitle = '执行任务' } = options;
  if (!steps?.length) {
    throw new Error('runWithSteps 需要 steps');
  }

  const tasks = new Listr(
    steps.map((step) => ({
      title: step.title,
      task: async () => {
        await runCommand(step.command, step.args ?? [], {
          cwd: step.cwd ?? cwd,
          env: step.env,
        });
      },
    })),
    { concurrent: false },
  );

  if (options.longTask) {
    const { terminal } = await import('./terminal.js');
    await terminal.withLongTask(taskTitle, () => tasks.run());
  } else {
    await tasks.run();
  }
}

export async function runNpmScript(
  cwd: string,
  script: string,
  extraArgs: string[] = [],
): Promise<void> {
  await runCommand('npm', ['run', script, '--', ...extraArgs], { cwd });
}

export async function runExpo(
  cwd: string,
  args: string[],
  env?: Record<string, string>,
): Promise<void> {
  const isSimulatorRun =
    args.includes('run:ios') &&
    !args.includes('--device') &&
    !args.some((a, i) => args[i - 1] === '--device');

  const metroEnv = args.includes('run:ios')
    ? getMetroEnvForIosTarget(isSimulatorRun)
    : {};

  await runCommand('npx', ['expo', ...args], {
    cwd,
    env: { ...metroEnv, ...env },
  });
}

/** 长任务：清屏 + 修改终端标题 + 执行 expo 命令 */
export async function runExpoLongTask(
  cwd: string,
  expoArgs: string[],
  taskTitle: string,
  env?: Record<string, string>,
): Promise<void> {
  const { terminal } = await import('./terminal.js');
  await terminal.withLongTask(taskTitle, async () => {
    await runExpo(cwd, expoArgs, env);
  });
}

/** 长任务：清屏 + 修改终端标题 + 执行 npm script */
export async function runNpmScriptLongTask(
  cwd: string,
  script: string,
  taskTitle: string,
  extraArgs: string[] = [],
): Promise<void> {
  const { terminal } = await import('./terminal.js');
  await terminal.withLongTask(taskTitle, async () => {
    await runNpmScript(cwd, script, extraArgs);
  });
}

export async function ensureAndroidPrebuild(cwd: string): Promise<void> {
  const { existsSync } = await import('node:fs');
  const { join } = await import('node:path');
  if (!existsSync(join(cwd, 'android'))) {
    await runExpo(cwd, ['prebuild', '--platform', 'android']);
  }
}
