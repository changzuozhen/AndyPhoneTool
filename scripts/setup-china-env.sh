#!/usr/bin/env bash
# AndyPhoneTool 国内开发环境一键配置
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REGISTRY="https://registry.npmmirror.com"
NPMRC="$ROOT/.npmrc"

echo "==> AndyPhoneTool 国内基建配置"
echo "    项目目录: $ROOT"
echo ""

# 1. 确认 .npmrc 已指向国内镜像
if [[ -f "$NPMRC" ]] && grep -q "registry.npmmirror.com" "$NPMRC"; then
  echo "[ok] .npmrc 已配置 npmmirror 镜像"
else
  echo "[!!] 未找到 .npmrc 国内镜像配置，请检查仓库文件"
  exit 1
fi

# 2. 写入用户级 npm 镜像
if command -v npm >/dev/null 2>&1; then
  npm config set registry "$REGISTRY"
  echo "[ok] npm 用户级 registry -> $REGISTRY"
fi

# 3. 写入 Expo 专用 .env.local（仅 EXPO_* 变量，避免 SDK 57 安全拦截）
ENV_LOCAL="$ROOT/.env.local"
cat > "$ENV_LOCAL" <<'EOF'
EXPO_NO_TELEMETRY=1
EXPO_USE_METRO_WORKSPACE_ROOT=1
EOF
echo "[ok] 已更新 .env.local（仅 Expo 安全变量）"
echo "[ok] npm 镜像由 .npmrc 提供；二进制包镜像: source scripts/npm-binary-mirrors.env && npm install"

# 4. 检查 Node 版本
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
  if [[ "$NODE_MAJOR" -lt 20 ]]; then
    echo "[!!] 建议 Node >= 20（当前: $(node -v)）。可用 nvm: nvm install && nvm use"
  else
    echo "[ok] Node 版本: $(node -v)"
  fi
fi

# 5. 连通性探测
echo ""
echo "==> 镜像连通性检测"
if npm view expo version --registry="$REGISTRY" >/dev/null 2>&1; then
  echo "[ok] npmmirror 可解析 expo 包"
else
  echo "[!!] npmmirror 访问失败，请检查网络或代理"
  exit 1
fi

echo ""
echo "==> 下一步（新机器推荐直接运行）"
echo "    npm run setup            # 一键完整配置"
echo "    npm run setup -- --zsh   # 额外注入 zsh 全局 aptool"
echo ""
echo "    或手动:"
echo "    npm run aptool           # 交互模式"
echo "    npm run aptool -- shell install"
echo ""
echo "    完整说明见 docs/setup.md"
