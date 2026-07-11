export const shortcuts = {
  d: 'dev start',
  adr: 'dev run-android',
  ai: 'dev run-ios',
  bbd: 'build android debug',
  bar: 'build android release',
} as const;

export type ShortcutKey = keyof typeof shortcuts;

export function expandShortcut(argv: string[]): string[] {
  const first = argv[0];
  if (first && first in shortcuts) {
    const expanded = shortcuts[first as ShortcutKey].split(' ');
    return [...expanded, ...argv.slice(1)];
  }
  return argv;
}

export function getShortcutEntries(): Array<{ key: string; expandsTo: string }> {
  return Object.entries(shortcuts).map(([key, value]) => ({ key, expandsTo: value }));
}
