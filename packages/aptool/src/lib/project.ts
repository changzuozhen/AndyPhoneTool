import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export type ProjectContext = {
  root: string;
  name: string;
  expoVersion: string | null;
  nodeVersion: string;
  hasAndroid: boolean;
  hasIos: boolean;
  registry: string | null;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

export function findProjectRoot(startDir = process.cwd()): string {
  if (process.env.APTOOL_ROOT && existsSync(join(process.env.APTOOL_ROOT, 'package.json'))) {
    return process.env.APTOOL_ROOT;
  }

  let dir = startDir;
  while (true) {
    const pkgPath = join(dir, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { name?: string };
        if (pkg.name === 'andyphonetool') {
          return dir;
        }
      } catch {
        // continue walking up
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // fallback: relative to aptool package (packages/aptool/dist or src)
  const fromPackage = join(__dirname, '../../..');
  if (existsSync(join(fromPackage, 'package.json'))) {
    return fromPackage;
  }

  return process.cwd();
}

export function loadProjectContext(root = findProjectRoot()): ProjectContext {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
    name: string;
    dependencies?: Record<string, string>;
  };

  let registry: string | null = null;
  const npmrcPath = join(root, '.npmrc');
  if (existsSync(npmrcPath)) {
    const match = readFileSync(npmrcPath, 'utf8').match(/^registry=(.+)$/m);
    registry = match?.[1]?.trim() ?? null;
  }

  const expoDep = pkg.dependencies?.expo ?? null;
  const expoVersion = expoDep?.replace(/^[^\d]*/, '') ?? null;

  return {
    root,
    name: pkg.name,
    expoVersion,
    nodeVersion: process.version,
    hasAndroid: existsSync(join(root, 'android')),
    hasIos: existsSync(join(root, 'ios')),
    registry,
  };
}

export function loadEnvLocal(root: string): Record<string, string> {
  const path = join(root, '.env.local');
  if (!existsSync(path)) return {};

  const env: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    // 仅加载 Expo 安全变量，避免 NPM_CONFIG_* 等传入子进程
    if (key.startsWith('EXPO_')) {
      env[key] = trimmed.slice(idx + 1);
    }
  }
  return env;
}
