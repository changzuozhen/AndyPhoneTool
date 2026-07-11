import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export type LastRunRecord = {
  /** 展开后的 aptool 参数，如 ['dev', 'run-ios', '--device', '...'] */
  argv: string[];
  /** 人类可读描述 */
  label: string;
  at: string;
};

const DIR_NAME = '.aptool';
const FILE_NAME = 'last-run.json';

function historyPath(root: string): string {
  return join(root, DIR_NAME, FILE_NAME);
}

export function saveLastRun(root: string, argv: string[], label?: string): void {
  if (argv.length === 0) return;
  if (argv[0] === 'repeat' || argv[0] === 'rerun') return;

  const dir = join(root, DIR_NAME);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const record: LastRunRecord = {
    argv,
    label: label ?? `aptool ${argv.join(' ')}`,
    at: new Date().toISOString(),
  };
  writeFileSync(historyPath(root), `${JSON.stringify(record, null, 2)}\n`, 'utf8');
}

export function loadLastRun(root: string): LastRunRecord | null {
  const path = historyPath(root);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as LastRunRecord;
  } catch {
    return null;
  }
}

export function formatLastRunHint(record: LastRunRecord | null): string | undefined {
  if (!record) return undefined;
  return `aptool ${record.argv.join(' ')}`;
}
