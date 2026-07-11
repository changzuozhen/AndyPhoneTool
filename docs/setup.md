# 新机器快速配置指南

本文档帮助你在**全新的电脑环境**中，一次性配置好 AndyPhoneTool 的开发工具链。

## 前置要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | >= 20 | 项目含 `.nvmrc`，推荐用 [nvm](https://github.com/nvm-sh/nvm) |
| npm | 随 Node 附带 | |
| zsh | 可选 | 仅 `--zsh` 全局 `aptool` 时需要 |
| Git | 可选 | 克隆仓库用 |

## 一键配置（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/changzuozhen/AndyPhoneTool.git
cd AndyPhoneTool

# 2. 切换 Node 版本（若使用 nvm）
nvm install && nvm use

# 3. 一键配置（镜像 + 依赖 + aptool 构建 + 验证）
npm run setup

# 4. 可选：注入 zsh，全局使用 aptool
npm run setup -- --zsh
source ~/.zshrc
```

`npm run setup` 会自动完成：

1. 检查 Node / npm 版本
2. 配置国内 npm 镜像（`.npmrc` + 用户级 registry）
3. 写入 Expo 安全环境变量（`.env.local`，仅 `EXPO_*`）
4. 加载二进制包镜像并 `npm install`
5. 构建 `aptool` CLI
6. TypeScript 类型检查验证

## 配置参数

```bash
npm run setup                  # 完整配置
npm run setup -- --zsh         # 额外写入 ~/.zshrc（全局 aptool）
npm run setup -- --skip-install  # 跳过 npm install（依赖已装好时）
npm run setup -- --help        # 查看帮助
```

## 配置完成后怎么用

### 方式 A：项目内（无需 zshrc）

```bash
npm run aptool                 # 交互菜单（推荐新手）
npm run aptool -- help         # 命令列表
npm run aptool -- dev start    # 启动 Metro
npm run aptool -- dev ios      # iOS Expo Go
npm run aptool -- adr          # Android Dev Build（相机/闪光灯完整）
npm run ios                    # 等同 expo start --ios
```

### 方式 B：全局 aptool（需 `--zsh`）

```bash
source ~/.zshrc                # 首次注入后执行一次
aptool                         # 任意目录可用
aptool adr
aptool shell status            # 检查 zsh 注入状态
```

`~/.zshrc` 中仅增加 3 行 function，**无 alias**：

```bash
# >>> AndyPhoneTool aptool >>>
aptool() { node "/path/to/AndyPhoneTool/packages/aptool/dist/index.js" "$@"; }
# <<< AndyPhoneTool aptool <<<
```

## 脚本分工

| 命令 | 作用 | 场景 |
|------|------|------|
| `npm run setup` | **新机器完整配置** | 首次克隆、换电脑 |
| `npm run setup:cn` | 仅镜像 / `.env.local` | 快速修复网络配置 |
| `npm run aptool:build` | 仅重建 CLI | 改了 aptool 源码后 |
| `npm run aptool -- shell install` | 仅注入 zsh（交互确认） | 单独配置全局命令 |
| `npm run aptool -- shell uninstall` | 移除 zsh 标记块 | 回滚 |

## 常见问题

### `npm run setup` 失败在 npm install？

```bash
# 确认镜像
npm config get registry
# 应输出 https://registry.npmmirror.com

# 重试
rm -rf node_modules
npm run setup
```

### Expo 启动报 `.env` 危险变量？

`.env.local` 中**不能**包含 `NPM_CONFIG_*`。运行 `npm run setup:cn` 会自动修复。

### `aptool: command not found`？

说明 zsh 未注入。二选一：

```bash
npm run setup -- --zsh && source ~/.zshrc
# 或
npm run aptool -- dev start   # 项目内使用
```

### 换了项目路径后 aptool 失效？

```bash
npm run aptool -- shell uninstall
npm run setup -- --zsh
source ~/.zshrc
```

## 相关文档

- [aptool CLI 使用指南](aptool-cli.md)
- [国内网络优化](development-china.md)
- [aptool 设计规格](aptool-design.md)
