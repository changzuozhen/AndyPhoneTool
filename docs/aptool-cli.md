# aptool CLI 使用指南

`aptool` 是 AndyPhoneTool 的 Node/TypeScript 开发 CLI，设计规格见 [`aptool-design.md`](aptool-design.md)。

## 快速开始

```bash
# 构建 CLI（首次或源码变更后）
npm run aptool:build

# 交互模式（无参数）
npm run aptool

# 直接执行
npm run aptool -- dev run-android
npm run aptool -- adr          # 快捷码

# 全局使用（可选，仅注入一个 zsh function）
npm run aptool -- shell install
source ~/.zshrc
aptool adr
```

## 命令一览

| 命令 | 说明 |
|------|------|
| `dev start` | Metro 开发服务 |
| `dev android` / `dev ios` | Expo Go 预览 |
| `dev run-android` / `dev run-ios` | Dev Build 真机调试 |
| `build android debug\|release` | 本地 APK 构建 |
| `build ios debug\|release` | iOS 构建（需 Xcode） |
| `env setup-cn` | 国内镜像配置 |
| `shell install\|uninstall\|status` | zsh 集成 |
| `help` / `list` | 帮助 |

## 项目内快捷码

| 快捷码 | 等价命令 |
|--------|----------|
| `d` | `dev start` |
| `adr` | `dev run-android` |
| `ai` | `dev run-ios` |
| `bbd` | `build android debug` |
| `bar` | `build android release` |

快捷码由 CLI 内部展开，**不写入 zshrc**。

## 扩展新命令

1. 在 `packages/aptool/src/config/registry.ts` 添加元数据
2. 在 `packages/aptool/src/commands/` 实现 handler
3. 在 `packages/aptool/src/cli.ts` 注册子命令
4. 可选：在 `config/shortcuts.ts` 添加快捷码
5. `npm run aptool:build` 重新构建

## 交互模式

仅无参数时触发：

```bash
aptool
# 或
npm run aptool
```

每步展示全局配置（项目路径、Node、native 目录、镜像源），菜单项附带等价完整命令。

## 长任务

构建类命令会自动清屏并修改终端标题，步骤通过 listr2 展示。
