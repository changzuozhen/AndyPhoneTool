import { spawn } from 'node:child_process';
import { Listr } from 'listr2';

import { loadEnvLocal } from './project.js';

export type RunOptions = {
  cwd: string;
  env?: Record<string, string>;
  longTask?: boolean;
  taskTitle?: string;
  steps?: Array<{ title: string; command: string; args?: string[]; cwd?: string }>;
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
  await runCommand('npx', ['expo', ...args], { cwd, env });
}

export async function ensureAndroidPrebuild(cwd: string): Promise<void> {
  const { existsSync } = await import('node:fs');
  const { join } = await import('node:path');
  if (!existsSync(join(cwd, 'android'))) {
    await runExpo(cwd, ['prebuild', '--platform', 'android']);
  }
}
