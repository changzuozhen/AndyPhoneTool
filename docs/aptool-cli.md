# aptool CLI 使用指南

`aptool` 是 AndyPhoneTool 的 Node/TypeScript 开发 CLI，设计规格见 [`aptool-design.md`](aptool-design.md)。

## 快速开始

新机器推荐：

```bash
npm run setup            # 一键：镜像 + 依赖 + 构建
npm run setup -- --zsh   # 可选：全局 aptool
source ~/.zshrc
```

手动步骤：

```bash
# 构建 CLI（首次或源码变更后）
npm run aptool:build

# 交互模式（无参数）
npm run aptool

# 直接执行
npm run aptool -- dev run-android
npm run aptool -- adr          # 快捷码

# 全局使用（可选）
npm run aptool -- shell install
source ~/.zshrc
aptool adr
```

详见 [setup.md](setup.md)。

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
| `repeat` / `rr` | 重复上一次命令（含设备参数） |

## 项目内快捷码

| 快捷码 | 等价命令 |
|--------|----------|
| `d` | `dev start` |
| `adr` | `dev run-android` |
| `ai` | `dev run-ios` |
| `bbd` | `build android debug` |
| `bar` | `build android release` |
| `rr` | `repeat` |

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

若存在上一次执行记录，首页会显示 **↻ 重复上一次**（等价 `aptool rr`）。记录保存在项目根 `.aptool/last-run.json`，iOS 命令会记住 `--device` UDID。

```bash
aptool rr              # 重复上一次完整命令
aptool repeat          # 同上
```

### iOS Dev Build 与真机

`aptool dev run-ios` / `aptool ai` **默认优先安装到已连接的 iPhone**（通过 `xcrun devicectl` 检测）。

```bash
aptool dev run-ios                    # 自动选真机（如 Andy iPhone13）
aptool dev run-ios --device "Andy iPhone13"
aptool dev run-ios --simulator        # 强制模拟器
```

若红屏 **"No script URL"**：等待 Metro 日志出现 Bundled 后按 **⌘R** 重载 App，或重新运行命令。相机/闪光灯需真机。

**模拟器**会自动使用 `127.0.0.1:8081`；**真机**使用 Mac 局域网 IP，请保持同一 Wi‑Fi。

### iOS 真机签名（常见报错）

若出现 `No code signing certificates are available`：

1. 用 Xcode 打开 `ios/AndyPhoneTool.xcworkspace`（先执行一次 `npx expo prebuild --platform ios` 生成 `ios/`）
2. 选中 Target → **Signing & Capabilities** → 勾选 **Automatically manage signing**
3. 选择你的 **Team**（个人 Apple ID 即可免费开发签名）
4. iPhone 上信任开发者证书：**设置 → 通用 → VPN与设备管理**
5. 再运行 `aptool ai` 或 `aptool rr`

### 长任务体验

构建类命令会自动**清屏**并修改**终端标题**，步骤通过 listr2 展示。
