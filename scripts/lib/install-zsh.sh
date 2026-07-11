#!/usr/bin/env bash
# 将 aptool 函数注入 ~/.zshrc（非交互，供 setup 脚本调用）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ZSHRC="${HOME}/.zshrc"
CLI_PATH="${ROOT}/packages/aptool/dist/index.js"
MARKER_BEGIN='# >>> AndyPhoneTool aptool >>>'
MARKER_END='# <<< AndyPhoneTool aptool <<<'

if [[ ! -f "$CLI_PATH" ]]; then
  echo "[!!] aptool CLI 未构建: $CLI_PATH"
  echo "    请先运行: npm run aptool:build"
  exit 1
fi

if [[ -f "$ZSHRC" ]] && grep -qF "$MARKER_BEGIN" "$ZSHRC"; then
  echo "[ok] aptool 已在 ~/.zshrc 中配置"
  exit 0
fi

BLOCK="${MARKER_BEGIN}
aptool() { node \"${CLI_PATH}\" \"\$@\"; }
${MARKER_END}"

if [[ ! -f "$ZSHRC" ]]; then
  printf '%s\n' "$BLOCK" > "$ZSHRC"
else
  [[ "$(tail -c1 "$ZSHRC" 2>/dev/null || echo)" == "" ]] || echo "" >> "$ZSHRC"
  printf '\n%s\n' "$BLOCK" >> "$ZSHRC"
fi

echo "[ok] 已注入 aptool 到 ~/.zshrc"
echo "    执行: source ~/.zshrc"
