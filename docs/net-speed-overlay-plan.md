# 网速悬浮窗工具 · 实现计划

> 状态：阶段 3 iOS PiP MVP 已完成 · 目标场景：**仅自用 / 侧载**（不上架 App Store）

## 1. 目标与验收标准

新增工具「网速悬浮窗」：在 App 内开启后，一个小浮窗**盖在其他 App / 桌面之上**，每秒刷新显示上/下行网速（如 `↓ 1.2 MB/s ↑ 0.3 MB/s`）。

两端实现方式不同，但**效果对齐**：都能浮在其他 App 上、都可被用户移动、都每秒更新。

验收标准：

- **Android**：授权「显示在其他应用上层」后，切到任意 App，浮窗持续可见并每秒刷新。
- **iOS**：App 内开启 PiP 后切到后台/桌面，PiP 小窗持续可见并每秒刷新。
- 关闭工具后浮窗/PiP 完全消失，无残留通知或后台任务。

## 2. 平台方案对比

| 维度 | Android | iOS |
|---|---|---|
| 悬浮技术 | `SYSTEM_ALERT_WINDOW` + 前台 Service + `WindowManager`（`TYPE_APPLICATION_OVERLAY`） | 画中画 PiP：`AVPictureInPictureController` + `AVSampleBufferDisplayLayer` 自绘内容 |
| 网速采集 | `TrafficStats.getTotalRxBytes()/getTotalTxBytes()` 每秒差值 | `getifaddrs` 读 `en0`/`pdp_ip0` 接口字节数，每秒差值 |
| 浮窗渲染 | 原生 `TextView` / 自定义 View | 把网速文字渲染进 `CVPixelBuffer → CMSampleBuffer`，每秒 `enqueue` |
| 位置控制 | 任意形状/位置，可拖动 | 系统圆角小窗，用户可拖到四角/缩放（系统管理）|
| 常驻方式 | 前台 Service 常驻 | App 内启动 PiP，切后台后持续 |
| 关键限制 | 需一次性授权「显示在其他应用上层」 | 需 Background Mode: `audio`；断帧会被系统关闭需心跳补帧 |

> **iOS 说明**：普通 App 没有 Android `SYSTEM_ALERT_WINDOW` 的等价物。系统唯一允许「盖在其他 App 之上」的方式是 PiP。因目标为自用/侧载，PiP 用于非视频用途的上架审核风险**不适用**。

## 3. 前置条件

- **必须使用 development build**（`expo prebuild` + 原生编译），Expo Go 无法加载自定义原生模块。项目已有 `prebuild:android` 脚本。
- 新增一个本地 Expo Module（原生代码）+ config plugin（改 `AndroidManifest.xml` / `Info.plist`）。
- 按 `AGENTS.md`：动手写原生代码前核对 [Expo 57 Modules API 文档](https://docs.expo.dev/versions/v57.0.0/) 的写法。

## 4. 架构设计

### 4.1 JS 侧统一接口（原生模块 `NetSpeedOverlay`）

```ts
type NetSpeedOverlay = {
  isSupported(): boolean;
  hasPermission(): Promise<boolean>;   // Android: overlay 权限; iOS: PiP 是否可用
  requestPermission(): Promise<boolean>;
  start(): Promise<void>;              // 开启悬浮窗 / PiP
  stop(): Promise<void>;
  isRunning(): Promise<boolean>;
};
```

网速采集与渲染逻辑全部放原生层（两端各自实现），JS 只负责授权引导、开关、状态展示，保证跨端体验一致。

### 4.2 Android 实现要点

1. Config plugin 往 `AndroidManifest.xml` 注入：
   - `android.permission.SYSTEM_ALERT_WINDOW`
   - `android.permission.FOREGROUND_SERVICE`
   - `android.permission.FOREGROUND_SERVICE_SPECIAL_USE`（Android 14+）
   - 注册 `NetSpeedService`（前台 Service，`foregroundServiceType="specialUse"`）
2. `requestPermission()`：用 `Settings.canDrawOverlays()` 判断，未授权则 `Intent(ACTION_MANAGE_OVERLAY_PERMISSION)` 跳系统设置页。
3. `start()`：启动前台 Service（带常驻通知）→ `WindowManager.addView()` 添加浮窗 → 每秒定时器读 `TrafficStats` 算差值刷新文本 → 支持拖动（`OnTouchListener` 更新 `LayoutParams.x/y`）。
4. `stop()`：`removeView` + `stopService`。

### 4.3 iOS 实现要点

1. Config plugin 往 `Info.plist` 注入 `UIBackgroundModes: [audio]`。
2. `SpeedPiPView: UIView`，`layerClass` 返回 `AVSampleBufferDisplayLayer`。
3. `start()`：
   - 建 `AVPictureInPictureController.ContentSource(sampleBufferDisplayLayer:playbackDelegate:)`
   - `playbackDelegate` 时间区间返回 `duration = .positiveInfinity`（live 内容）
   - 每秒：读 `getifaddrs` 算网速 → 用 CoreGraphics 把文字画到 `CVPixelBuffer` → 转 `CMSampleBuffer` → `enqueue`
   - 心跳：断帧时每 500ms 补喂上一帧，防止 PiP 判定「播放结束」自动关闭
   - `startPictureInPicture()`（需 App 在前台触发，之后切后台持续）
4. `stop()`：`stopPictureInPicture()` + 停定时器。
5. 用 `AVPictureInPictureController.isPictureInPictureSupported()` 做兜底判断。

## 5. 文件改动清单

**新增（原生模块）**

- `modules/net-speed-overlay/` — 本地 Expo Module
  - `expo-module.config.json`
  - `android/…/NetSpeedOverlayModule.kt`、`NetSpeedService.kt`、浮窗布局资源
  - `ios/NetSpeedOverlayModule.swift`、`SpeedPiPView.swift`、`SpeedRenderer.swift`
  - `index.ts`（JS 接口导出）
- `plugins/withNetSpeedOverlay.js` — 注入权限 / Background Mode / Service 声明

**修改（JS 层，沿用现有模式）**

- `src/constants/tools.ts` — 放宽 `ToolDefinition` 的 `icon` / `route` 联合类型，`TOOLS` 加入 `net-speed` 项（`icon: 'speedometer'`，`route: '/tools/net-speed'`）。
- `src/app/tools/net-speed.tsx` — 新工具页：授权引导 + 开关 + 运行状态（参考 `camera-flash.tsx` 的权限/UI 结构）。
- `src/app/_layout.tsx` — `<Stack>` 注册 `tools/net-speed` 路由。
- `app.json` — `plugins` 数组加入 `./plugins/withNetSpeedOverlay`（与现有 `./plugins/withChinaMirrors.js` 同样式）。
- 因启用了 `experiments.typedRoutes`，新增路由后需重新生成类型（`expo start` 或 prebuild 会刷新）。

## 6. 实施阶段

1. **脚手架**：建本地 module + config plugin，跑通 `prebuild:android`，JS 能调到空的原生方法（返回桩数据）。✅
2. **Android MVP**：授权流程 → 前台 Service → 浮窗显示固定文字 → 接 `TrafficStats` 实时刷新 → 拖动。✅
3. **iOS MVP**：PiP 显示固定文字 → 自绘帧管线 → 接 `getifaddrs` 实时刷新 → 心跳防关闭。✅
4. **JS 工具页**：授权引导、开关、状态、平台差异文案（iOS 提示「切后台后显示」）。
5. **打磨**：单位换算（B/KB/MB/GB）、样式对齐、异常兜底、权限被拒引导。

## 7. 风险与注意事项

- iOS PiP 窗口形状/位置由系统管理，无法像 Android 那样完全自定义；与 Android 存在体验差异，属可接受范围。
- Android 14+ 前台 Service 必须声明类型（`specialUse`）并在运行时正确处理，否则启动会抛异常。
- iOS 后台若未开启 `audio` Background Mode，切后台后 PiP 会被系统终止。
- 全局网速为接口累计字节差值，含系统/其他 App 流量，非本 App 独占——符合「网速监控」预期。

## 8. 已确认决策

- iOS 目标：**仅自用 / 侧载**（不上架，PiP 非视频用途的审核风险不适用）。
- 文档落地路径：`docs/net-speed-overlay-plan.md`（本文件）。
