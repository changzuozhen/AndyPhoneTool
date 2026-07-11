#!/usr/bin/env bash
# AndyPhoneTool 新机器一键配置
# 用法: bash scripts/setup.sh [--zsh] [--skip-install]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

INSTALL_ZSH=false
SKIP_INSTALL=false

for arg in "$@"; do
  case "$arg" in
    --zsh) INSTALL_ZSH=true ;;
    --skip-install) SKIP_INSTALL=true ;;
    -h|--help)
      cat <<'EOF'
AndyPhoneTool 新机器一键配置

用法:
  npm run setup              # 完整配置（推荐）
  npm run setup -- --zsh     # 额外注入 ~/.zshrc，全局可用 aptool
  npm run setup -- --skip-install  # 跳过 npm install

步骤:
  1. 检查 Node / npm
  2. 配置国内镜像与 .env.local
  3. npm install（含二进制包镜像）
  4. 构建 aptool CLI
  5. 可选: 注入 zsh
  6. 验证环境
EOF
      exit 0
      ;;
    *)
      echo "[!!] 未知参数: $arg（可用 --zsh / --skip-install）"
      exit 1
      ;;
  esac
done

echo "╔══════════════════════════════════════════╗"
echo "║   AndyPhoneTool 开发环境一键配置          ║"
echo "╚══════════════════════════════════════════╝"
echo "项目目录: $ROOT"
echo ""

# ── 1. 检查 Node / npm ──────────────────────────────────────
step() { echo ""; echo "==> $1"; }

step "检查运行环境"

if ! command -v node >/dev/null 2>&1; then
  echo "[!!] 未找到 Node.js，请先安装 Node >= 20"
  echo "     推荐: nvm install && nvm use（项目含 .nvmrc）"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[!!] 未找到 npm"
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" -lt 20 ]]; then
  echo "[!!] Node 版本过低: $(node -v)，需要 >= 20"
  echo "     若已安装 nvm: nvm install && nvm use"
  exit 1
fi
echo "[ok] Node $(node -v)  ·  npm $(npm -v)"

# 自动 nvm use（若可用）
if [[ -f "$ROOT/.nvmrc" ]] && command -v nvm >/dev/null 2>&1; then
  # shellcheck disable=SC1090
  source "$(brew --prefix nvm 2>/dev/null)/nvm.sh" 2>/dev/null || true
  if declare -f nvm >/dev/null 2>&1; then
    nvm use --silent 2>/dev/null || nvm install --silent 2>/dev/null || true
    echo "[ok] nvm use → Node $(node -v)"
  fi
fi

# ── 2. 国内镜像 / Expo 环境变量 ─────────────────────────────
step "配置国内镜像与 Expo 环境"
bash "$ROOT/scripts/setup-china-env.sh"

# ── 3. 二进制包镜像模板 ─────────────────────────────────────
MIRROR_EXAMPLE="$ROOT/scripts/npm-binary-mirrors.env.example"
MIRROR_LOCAL="$ROOT/scripts/npm-binary-mirrors.env"
if [[ -f "$MIRROR_EXAMPLE" && ! -f "$MIRROR_LOCAL" ]]; then
  cp "$MIRROR_EXAMPLE" "$MIRROR_LOCAL"
  echo "[ok] 已创建 scripts/npm-binary-mirrors.env"
fi

# ── 4. 安装依赖 ─────────────────────────────────────────────
if [[ "$SKIP_INSTALL" == "true" ]]; then
  echo "[--] 跳过 npm install（--skip-install）"
else
  step "安装项目依赖"
  if [[ -f "$MIRROR_LOCAL" ]]; then
    # shellcheck disable=SC1090
    set -a && source "$MIRROR_LOCAL" && set +a
    echo "[ok] 已加载二进制包镜像"
  fi
  npm install
  echo "[ok] npm install 完成"
fi

# ── 5. 构建 aptool CLI ──────────────────────────────────────
step "构建 aptool CLI"
npm run aptool:build
echo "[ok] aptool CLI 已构建"

# ── 6. 可选: 注入 zsh ───────────────────────────────────────
if [[ "$INSTALL_ZSH" == "true" ]]; then
  step "注入 zsh 全局命令"
  npm run aptool -- shell install --yes
else
  echo ""
  echo "[--] 未注入 zsh（可加 --zsh 参数全局启用 aptool）"
fi

# ── 7. 验证 ─────────────────────────────────────────────────
step "验证环境"

npm run aptool -- shell status

if npx tsc --noEmit >/dev/null 2>&1; then
  echo "[ok] TypeScript 类型检查通过"
else
  echo "[!!] TypeScript 类型检查失败，请检查源码"
fi

# ── 完成 ────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   ✓ 配置完成                             ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "常用命令:"
echo "  npm run aptool              # 交互式开发菜单"
echo "  npm run aptool -- dev start # 启动 Metro"
echo "  npm run aptool -- dev ios   # iOS Expo Go"
echo "  npm run aptool -- adr       # Android Dev Build（相机完整）"
echo "  npm run ios                 # 快捷启动 iOS"
echo ""
if [[ "$INSTALL_ZSH" == "true" ]]; then
  echo "已注入 zsh，请执行: source ~/.zshrc"
  echo "之后任意目录可用: aptool"
else
  echo "全局 aptool: npm run setup -- --zsh"
fi
echo ""
echo "文档: docs/setup.md"
