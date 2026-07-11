# 国内开发环境指南

本文档说明在中国国内网络环境下，如何更快地完成 AndyPhoneTool 的依赖安装与构建。

## 已内置的基建

| 文件 | 作用 |
|------|------|
| `.npmrc` | 项目级 npm 镜像（npmmirror）+ 二进制包镜像 + 重试策略 |
| `.nvmrc` | 推荐 Node 20 LTS |
| `.env.example` | 可选环境变量模板 |
| `plugins/withChinaMirrors.js` | `expo prebuild` 时自动注入 Android Maven 国内源 |
| `scripts/setup.sh` | **新机器一键配置**（镜像 + 依赖 + aptool + 验证） |
| `scripts/setup-china-env.sh` | 仅配置国内镜像与 `.env.local` |

## 快速开始

新机器请直接使用一键配置，见 **[setup.md](setup.md)**。

```bash
git clone https://github.com/changzuozhen/AndyPhoneTool.git
cd AndyPhoneTool
nvm install && nvm use   # 可选
npm run setup            # 镜像 + 依赖 + aptool 构建
npm run setup -- --zsh   # 可选：全局 aptool
```

仅刷新镜像（不重装依赖）：

```bash
npm run setup:cn
```

## npm 镜像说明

项目已固定使用 [npmmirror](https://npmmirror.com)（原淘宝 npm 镜像）：

```
registry=https://registry.npmmirror.com
```

`npm run setup:cn` 会更新 `.env.local`，**仅写入 Expo 安全变量**（`EXPO_*`）。npm 镜像由 [`.npmrc`](../.npmrc) 提供；`NPM_CONFIG_*` 等变量不能放入 `.env.local`，否则 Expo SDK 57+ 会拒绝启动。

npm 安装时的二进制包镜像请使用：

```bash
source scripts/npm-binary-mirrors.env && npm install
# 或 npm run setup（自动处理）
```

如需临时切回官方源（海外网络）：

```bash
npm install --registry=https://registry.npmjs.org
```

## Expo / Metro

- `EXPO_NO_TELEMETRY=1`：关闭遥测，减少海外请求
- `npm run start:cn`：带国内推荐环境变量启动
- 首次 `npm install` 后，后续安装会受益于 `prefer-offline=true` 与本地缓存

## Android 原生构建加速

执行 `npx expo prebuild` 生成 `android/` 后，`withChinaMirrors` 插件会自动向 Gradle 配置阿里云 Maven 仓库，加速：

- Google Maven
- Maven Central
- Gradle Plugin Portal

本地编译 APK：

```bash
npm run prebuild:android
cd android && ./gradlew assembleDebug
```

## iOS 开发提示

- CocoaPods 可配置清华/阿里等镜像（系统级，按需设置）：

```bash
# 示例：清华 CocoaPods 镜像（按需选用）
pod repo remove master 2>/dev/null || true
pod repo add master https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git
pod repo update
```

- 真机调试推荐使用 **Expo Go** 或本地 dev build，避免频繁拉取海外原生依赖。

## 常见问题

### 安装仍然很慢？

1. 确认 `npm config get registry` 输出为 `https://registry.npmmirror.com`
2. 删除 `node_modules` 后重新 `npm install`
3. 检查公司代理是否劫持 npm 流量
4. 使用 `npm run setup:cn` 重新检测连通性

### `npx expo install` 报错？

Expo 会读取项目 `.npmrc`，确保在项目根目录执行：

```bash
npx expo install <package>
```

### EAS Build / 云构建

EAS 服务器在海外，国内上传/排队可能较慢。本期本地开发优先使用 Expo Go；若需云构建，建议在网络空闲时段提交。

## 海外开发者

若你在海外网络开发，可本地覆盖 registry，无需修改仓库：

```bash
npm config set registry https://registry.npmjs.org
```

或在单次安装时指定官方源（见上文）。
