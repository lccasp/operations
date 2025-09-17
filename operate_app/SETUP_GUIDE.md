# 📋 OperateApp 完整安装指南

> 从零开始，完整的 React Native 项目初始化步骤

## 🎯 项目概述

OperateApp 是一个采用苹果风格设计的高端 React Native 应用，集成了现代化的技术栈：

- **React Navigation 7** - 导航系统
- **Zustand 5** - 状态管理
- **TanStack Query 5** - 数据获取和缓存
- **MMKV** - 高性能存储
- **React Hook Form 7** - 表单处理
- **React Native Reanimated 3** - 动画系统

## 🔧 环境准备

### 1. 系统要求

**通用要求：**
- Node.js >= 20.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0
- Git

**macOS (iOS 开发)：**
- macOS 12.0+ (Monterey)
- Xcode 14.0+
- CocoaPods 1.11+

**Windows/Linux (Android 开发)：**
- Android Studio 2022.3.1+
- Android SDK API 33+
- Java Development Kit (JDK) 11

### 2. 安装开发环境

#### Node.js 安装
```bash
# 使用 nvm 安装 (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# 或直接从官网下载安装
# https://nodejs.org/
```

#### React Native CLI 安装
```bash
npm install -g @react-native-community/cli
```

#### Android 开发环境 (所有平台)

1. **下载 Android Studio**
   - 访问 https://developer.android.com/studio
   - 下载并安装 Android Studio

2. **配置 Android SDK**
   ```bash
   # 设置环境变量 (添加到 ~/.bashrc 或 ~/.zshrc)
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   export ANDROID_HOME=$HOME/Android/Sdk          # Linux
   export ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk # Windows

   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **安装 Android SDK**
   - 打开 Android Studio
   - SDK Manager → SDK Platforms → Android 13 (API 33)
   - SDK Tools → Android SDK Build-Tools 33.0.0

#### iOS 开发环境 (仅 macOS)

1. **安装 Xcode**
   ```bash
   # 从 App Store 安装 Xcode
   # 或从开发者网站下载
   ```

2. **安装 Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

3. **安装 CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

## 🚀 项目初始化

### 1. 创建项目

```bash
# 使用 React Native CLI 创建项目
npx @react-native-community/cli init operate_app

# 进入项目目录
cd operate_app
```

### 2. 安装项目依赖

```bash
# 安装所有 npm 依赖
npm install

# 或使用 yarn
yarn install
```

### 3. iOS 依赖安装 (仅 macOS)

```bash
# 进入 iOS 目录
cd ios

# 安装 CocoaPods 依赖
pod install

# 返回项目根目录
cd ..
```

### 4. 项目结构设置

按照以下结构创建目录：

```bash
mkdir -p src/{components,screens,navigation,store,services,theme,utils,hooks,types,assets}
mkdir -p src/components/{ui,forms,navigation,common}
mkdir -p src/screens/{auth,home,profile,settings}
mkdir -p src/store/slices
mkdir -p src/services/{api,queries,mutations}
mkdir -p src/assets/{images,icons,fonts}
```

## 📦 依赖包安装

### 核心依赖

```bash
npm install \
  @react-navigation/native \
  @react-navigation/stack \
  @react-navigation/bottom-tabs \
  @react-navigation/native-stack \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler \
  zustand \
  @tanstack/react-query \
  axios \
  react-native-mmkv \
  react-hook-form \
  @hookform/resolvers \
  yup \
  react-native-reanimated \
  react-native-paper \
  react-native-vector-icons \
  react-native-svg \
  react-native-device-info \
  react-native-haptic-feedback \
  react-native-blur \
  @react-native-community/netinfo
```

### 开发依赖

```bash
npm install -D \
  @types/react-native-vector-icons \
  eslint-plugin-react-hooks
```

## ⚙️ 配置文件设置

### 1. TypeScript 配置 (tsconfig.json)

```json
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/navigation/*": ["src/navigation/*"],
      "@/store/*": ["src/store/*"],
      "@/services/*": ["src/services/*"],
      "@/theme/*": ["src/theme/*"],
      "@/utils/*": ["src/utils/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"],
      "@/assets/*": ["src/assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "src/**/*"],
  "exclude": ["**/node_modules", "**/Pods", "**/*.test.ts", "**/*.test.tsx"]
}
```

### 2. Metro 配置 (metro.config.js)

```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    alias: {
      '@': './src',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### 3. Babel 配置 (babel.config.js)

```javascript
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/navigation': './src/navigation',
          '@/store': './src/store',
          '@/services': './src/services',
          '@/theme': './src/theme',
          '@/utils': './src/utils',
          '@/hooks': './src/hooks',
          '@/types': './src/types',
          '@/assets': './src/assets',
        },
      },
    ],
  ],
};
```

### 4. 更新 package.json 脚本

```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint . --fix",
    "start": "react-native start",
    "test": "jest",
    "clean": "cd android && ./gradlew clean && cd ../ios && xcodebuild clean",
    "reset-cache": "npx react-native start --reset-cache",
    "postinstall": "cd ios && pod install",
    "type-check": "tsc --noEmit"
  }
}
```

## 🔧 平台特定配置

### Android 配置

1. **权限配置 (android/app/src/main/AndroidManifest.xml)**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

2. **Proguard 配置 (android/app/proguard-rules.pro)**
```
# MMKV
-keep class com.tencent.mmkv.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
```

### iOS 配置

1. **Info.plist 权限配置**
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select images</string>
```

2. **Podfile 配置**
```ruby
platform :ios, '13.0'
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

target 'operate_app' do
  config = use_native_modules!
  
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => false,
    :flipper_configuration => FlipperConfiguration.enabled,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )
end
```

## 🎨 主题系统初始化

创建基础主题文件，参考项目中的完整主题系统：

1. `src/theme/colors.ts` - 颜色系统
2. `src/theme/typography.ts` - 字体系统
3. `src/theme/spacing.ts` - 间距系统
4. `src/theme/shadows.ts` - 阴影系统
5. `src/theme/index.ts` - 主题入口

## 🗃️ 状态管理初始化

设置 Zustand 状态管理：

1. `src/store/slices/authSlice.ts` - 认证状态
2. `src/store/slices/appSlice.ts` - 应用状态
3. `src/store/slices/userSlice.ts` - 用户状态
4. `src/store/index.ts` - 状态入口

## 🧭 导航系统初始化

配置 React Navigation：

1. `src/navigation/RootNavigator.tsx` - 根导航
2. `src/navigation/AuthNavigator.tsx` - 认证导航
3. `src/navigation/MainNavigator.tsx` - 主导航
4. `src/types/navigation.ts` - 导航类型

## 🚀 运行项目

### 1. 启动 Metro 服务器

```bash
npm start
# 或
yarn start
```

### 2. 运行 Android 应用

```bash
# 确保 Android 模拟器正在运行或设备已连接
npm run android
# 或
yarn android
```

### 3. 运行 iOS 应用 (仅 macOS)

```bash
# 确保 iOS 模拟器可用
npm run ios
# 或
yarn ios

# 指定特定设备
npm run ios -- --simulator="iPhone 14 Pro"
```

## 🐛 常见问题解决

### 1. Metro 缓存问题

```bash
# 清理 Metro 缓存
npm run reset-cache

# 或手动清理
npx react-native start --reset-cache
```

### 2. Android 构建问题

```bash
# 清理 Android 构建
cd android
./gradlew clean
cd ..

# 重新构建
npm run android
```

### 3. iOS 构建问题

```bash
# 清理 iOS 构建
cd ios
xcodebuild clean
rm -rf build/
pod install
cd ..

# 重新构建
npm run ios
```

### 4. 依赖冲突问题

```bash
# 删除 node_modules 和锁文件
rm -rf node_modules
rm package-lock.json  # 或 yarn.lock

# 重新安装
npm install
cd ios && pod install && cd ..
```

### 5. React Native Reanimated 配置

确保在 `babel.config.js` 中 `react-native-reanimated/plugin` 是最后一个插件。

### 6. 向量图标配置

**Android:**
在 `android/app/build.gradle` 中添加：
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

**iOS:**
运行 `cd ios && pod install`

## 📱 开发建议

### 1. 开发工具推荐

- **VS Code** - 代码编辑器
- **React Native Debugger** - 调试工具
- **Flipper** - 移动应用调试平台

### 2. VS Code 插件推荐

- React Native Tools
- TypeScript Hero
- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint

### 3. 调试技巧

```bash
# 开启远程调试
在模拟器中摇动设备 → Debug → Debug with Chrome

# 查看应用日志
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

### 4. 性能优化建议

- 使用 `React.memo` 优化组件重渲染
- 使用 `useCallback` 和 `useMemo` 优化计算
- 合理使用 `FlatList` 处理长列表
- 图片优化和懒加载

## 🎉 完成！

恭喜！你已经成功设置了一个功能完整的 React Native 项目。现在你可以：

1. 开始开发你的应用功能
2. 自定义主题和样式
3. 添加新的页面和组件
4. 集成后端 API
5. 测试和发布应用

## 📚 下一步学习

- [React Navigation 文档](https://reactnavigation.org/)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [TanStack Query 文档](https://tanstack.com/query)
- [React Native Reanimated 文档](https://docs.swmansion.com/react-native-reanimated/)
- [苹果人机界面指南](https://developer.apple.com/design/human-interface-guidelines/)

---

**祝你开发愉快！如有问题，请查看项目文档或提交 Issue。**
