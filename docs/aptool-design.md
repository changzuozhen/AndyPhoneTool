# aptool CLI 设计规格

> 版本：v0.1 | 状态：已定稿，进入开发

## 目标

构建 **Node/TypeScript** 驱动的 `aptool` 命令行工具，作为 AndyPhoneTool 的统一开发入口：

1. 快捷执行 Expo 开发调试与 Android/iOS debug/release 本地构建
2. 无参数时进入**渐进式交互引导**，有参数时直接执行（可脚本化）
3. 快捷码**内聚在项目源码**，zsh 仅注入一个函数，不写 alias
4. 长任务自动清屏并修改终端标题

## 设计原则

| 原则 | 实现 |
|------|------|
| 渐进式披露 | 交互菜单分层，面包屑导航，推荐项标注 |
| 全局配置可见 | 每步交互前展示 StatusBar（项目路径、Node、native 目录、镜像源） |
| 命令自解释 | 每个菜单项显示 description + 等价完整命令 |
| 最小 shell 侵入 | `shell install` 仅写入 3 行 function 标记块 |
| 可扩展 | `commands/registry.ts` 单一数据源 + `config/shortcuts.ts` |

## 入口行为

```bash
aptool                    # 无参数 → 交互模式
aptool dev run-android    # 有参数 → 直接执行
aptool adr                # 快捷码 → 展开为 dev run-android
```

## 技术栈

| 职责 | 库 |
|------|-----|
| 子命令路由 | commander |
| 交互引导 | @clack/prompts |
| 长任务步骤 | listr2 |
| 终端控制 | 自封装 `lib/terminal.ts` |
| 构建 | tsup |
| 开发运行 | tsx |

## 目录结构

```
packages/aptool/
  src/
    index.ts              # 入口：无参 → interactive，有参 → dispatch
    cli.ts                # commander 注册
    config/
      shortcuts.ts        # adr → dev run-android（项目内，不写 zshrc）
      registry.ts         # 命令元数据（help / 菜单同源）
    commands/
      dev.ts
      build.ts
      env.ts
      shell.ts
    interactive/
      app.ts              # 交互主循环
      status-bar.ts       # 全局配置面板
    lib/
      terminal.ts         # clear / setTitle / withLongTask
      project.ts          # 根目录检测、android/ios、registry
      executor.ts         # 子进程执行 + listr2
docs/
  aptool-design.md        # 本文件
  aptool-cli.md           # 使用与扩展
```

## 命令注册表

| 命令 | 说明 | 长任务 |
|------|------|--------|
| `dev start` | Metro 开发服务 | 否 |
| `dev android` | Expo Go 调试 Android | 否 |
| `dev ios` | Expo Go 调试 iOS | 否 |
| `dev run-android` | Dev Build 真机 Android（相机完整） | 是 |
| `dev run-ios` | Dev Build 真机/模拟器 iOS | 是 |
| `build android debug` | prebuild + assembleDebug | 是 |
| `build android release` | prebuild + assembleRelease | 是 |
| `build ios debug` | run:ios Debug | 是 |
| `build ios release` | run:ios Release | 是 |
| `env setup-cn` | 国内镜像配置 | 否 |
| `shell install` | 注入 zsh function | 否 |
| `shell uninstall` | 移除 zsh 标记块 | 否 |
| `shell status` | 检查注入状态 | 否 |
| `help` / `list` | 帮助与命令列表 | 否 |

## 项目内快捷码

定义于 `config/shortcuts.ts`，由 CLI 路由层展开，**不写入 zshrc**：

| 快捷码 | 展开为 |
|--------|--------|
| `d` | `dev start` |
| `adr` | `dev run-android` |
| `ai` | `dev run-ios` |
| `bbd` | `build android debug` |
| `bar` | `build android release` |

## zsh 注入（最小侵入）

`shell install` 仅向 `~/.zshrc` 写入：

```bash
# >>> AndyPhoneTool aptool >>>
aptool() { node "/abs/path/AndyPhoneTool/packages/aptool/dist/index.js" "$@"; }
# <<< AndyPhoneTool aptool <<<
```

- 使用绝对路径
- 标记块可安全 `uninstall`
- 不注入任何 alias

## 交互模式

仅 `aptool` 无参数时触发，不提供 `aptool ui`。

```
┌ AndyPhoneTool aptool ────────────────────────────────┐
│ 📁 项目路径    Node 20.x    Expo SDK 57               │
│ 🤖 android/ ✓  ios/ ✗     Registry: npmmirror       │
│ ⚡ 推荐: dev run-android（相机/闪光灯需 Dev Build）     │
├──────────────────────────────────────────────────────┤
│ 首页 › 开发调试                                       │
│  ❯ Expo Go 快速预览       aptool dev android          │
│    Dev Build 真机 [推荐]  aptool dev run-android      │
│    ‹ 返回                                            │
├──────────────────────────────────────────────────────┤
│  b 返回   q 退出   ? 帮助                              │
└──────────────────────────────────────────────────────┘
```

## 长任务体验

`lib/terminal.withLongTask()`：

1. 任务开始：`clear()` + `setTitle('⏳ aptool: ...')`
2. 执行中：listr2 展示步骤
3. 成功：`setTitle('✓ aptool: ...')` + 打印产物路径
4. 失败：`setTitle('✗ aptool: ...')` + 保留错误输出

## 扩展方式

1. 在 `config/registry.ts` 注册命令元数据
2. 在 `commands/` 实现 handler
3. 在 `cli.ts` 挂载子命令
4. 可选：在 `shortcuts.ts` 添加快捷码

预留：`commands/eas.ts`（云构建）、`src/local.ts`（gitignore 个人扩展）

## 风险说明

- release APK/IPA 首期为未签名产物
- iOS release 依赖本机 Xcode 签名配置
- 相机/闪光灯需 Dev Build，Expo Go 不完整支持
