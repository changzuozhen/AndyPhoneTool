# AndyPhoneTool

跨端手机快捷工具箱，基于 [Expo](https://expo.dev) 构建，支持 iOS / Android（及 Web 预览）。

## 新机器快速开始

```bash
git clone https://github.com/changzuozhen/AndyPhoneTool.git
cd AndyPhoneTool
nvm install && nvm use          # 可选，推荐 Node 20
npm run setup                   # 一键配置：镜像 + 依赖 + aptool
npm run setup -- --zsh          # 可选：全局 aptool 命令
source ~/.zshrc                 # 注入 zsh 后执行

npm run aptool                  # 交互式开发菜单
npm run ios                     # 启动 iOS 调试
```

完整配置说明见 **[`docs/setup.md`](docs/setup.md)**。

## 功能（v0.1）

- **工具导航首页**：卡片式入口，便于扩展更多工具
- **手电筒相机**：
  - 进入即开启后置摄像头与闪光灯（默认 75% 亮度）
  - 亮度滑杆调节闪光灯开关阈值
  - 系统连续自动对焦 + 中心对焦框指示
  - 双指捏合缩放，实时显示缩放比例

## 技术栈

- Expo SDK 57 + Expo Router
- TypeScript
- expo-camera（相机 / 闪光灯 / 缩放）
- react-native-gesture-handler（捏合缩放）
- aptool CLI（开发/构建快捷入口）

## 设计

需求明细与设计 Token 见 [`design/REQUIREMENTS.md`](design/REQUIREMENTS.md)。  
使用 [Pencil](https://pencil.dev) 维护 `design/AndyPhoneTool.pen` 设计稿（需在 Pencil 中打开该文件后，Agent 可通过 MCP 协作）。

## 开发

### aptool 调试工具

| 调用方式 | 示例 |
|----------|------|
| 交互菜单 | `npm run aptool` |
| 项目内直调 | `npm run aptool -- dev ios` |
| 全局（需 setup --zsh） | `aptool` / `aptool adr` |

常用命令：

```bash
npm run aptool -- dev start     # Metro 开发服务
npm run aptool -- dev ios        # iOS Expo Go
npm run aptool -- adr            # Android Dev Build（相机完整）
npm run aptool -- env setup-cn   # 修复国内镜像配置
npm run aptool -- shell status   # 检查 zsh 注入状态
```

详见 [`docs/aptool-cli.md`](docs/aptool-cli.md)。

### 国内网络

项目已配置 [npmmirror](https://npmmirror.com) 镜像，详见 [`docs/development-china.md`](docs/development-china.md)。

```bash
npm run setup:cn    # 仅刷新镜像配置（不必重装依赖）
```

### 通用命令

```bash
npm start           # 启动 Metro
npm run ios         # iOS 调试
npm run android     # Android 调试
```

> 相机与闪光灯功能需在真机上测试；完整能力请用 `npm run aptool -- adr`（Dev Build）。

## 项目结构

```
src/
  app/                  # Expo Router 路由
  components/           # UI 组件
  constants/            # 主题、工具注册表
  assets/               # 图片、字体
packages/aptool/        # 开发 CLI（Node/TS）
scripts/
  setup.sh              # 新机器一键配置
  setup-china-env.sh    # 国内镜像配置
docs/
  setup.md              # 新机器配置指南
  aptool-cli.md         # aptool 使用说明
```

## 扩展新工具

1. 在 `src/constants/tools.ts` 的 `TOOLS` 数组中注册工具
2. 在 `src/app/tools/` 下新增页面
3. 在 `src/app/_layout.tsx` 的 Stack 中注册路由

## License

MIT
