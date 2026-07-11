# AndyPhoneTool

跨端手机快捷工具箱，基于 [Expo](https://expo.dev) 构建，支持 iOS / Android（及 Web 预览）。

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

## 设计

需求明细与设计 Token 见 [`design/REQUIREMENTS.md`](design/REQUIREMENTS.md)。  
使用 [Pencil](https://pencil.dev) 维护 `design/AndyPhoneTool.pen` 设计稿（需在 Pencil 中打开该文件后，Agent 可通过 MCP 协作）。

## 开发

### 国内网络环境（推荐）

项目已配置 [npmmirror](https://npmmirror.com) 镜像与国内 Android Gradle 加速，详见 [`docs/development-china.md`](docs/development-china.md)。

```bash
# 一键配置国内环境
npm run setup:cn

# 安装依赖（自动使用 .npmrc 镜像）
npm install

# 启动开发服务器
npm run start:cn
```

### 通用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 真机调试（需安装 Expo Go 或 dev build）
npm run ios
npm run android
```

> 相机与闪光灯功能需在真机上测试，模拟器不支持完整硬件能力。

## 项目结构

```
app/
  (tabs)/index.tsx      # 工具导航首页
  tools/camera-flash.tsx # 手电筒相机
components/
  ToolCard.tsx          # 工具入口卡片
  BrightnessSlider.tsx  # 闪光灯亮度滑杆
constants/
  tools.ts              # 工具注册表
  theme.ts              # 主题色
design/
  REQUIREMENTS.md       # Pencil 设计需求
```

## 扩展新工具

1. 在 `constants/tools.ts` 的 `TOOLS` 数组中注册工具
2. 在 `app/tools/` 下新增页面
3. 在 `app/_layout.tsx` 的 Stack 中注册路由

## License

MIT
