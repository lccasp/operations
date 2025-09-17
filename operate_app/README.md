# 📋 OperateApp 完整项目文档

> 苹果风格高端 React Native 运维管理应用 - 完整开发指南与设计规范

---

## 📖 目录

1. [项目概述](#-项目概述)
2. [特性亮点](#-特性亮点)
3. [技术栈](#️-技术栈)
4. [项目结构](#-项目结构)
5. [设计系统](#-设计系统)
6. [界面设计规范](#-界面设计规范)
7. [环境搭建](#-环境搭建)
8. [安装指南](#-安装指南)
9. [开发指南](#️-开发指南)
10. [构建发布](#-构建发布)
11. [故障排除](#-故障排除)

---

## 🚀 项目概述

OperateApp 是一个集成了现代化技术栈的高端移动应用，采用苹果风格设计，达到 20 美金付费产品的视觉效果标准。这是一个专为运维管理设计的移动应用，支持资源管理、故障告警、工单处理等核心功能。

### 应用定位
- **专网综合网管掌上运维平台**
- **高端移动运维解决方案**
- **苹果风格企业级应用**
- **现代化React Native架构典范**

---

## ✨ 特性亮点

- 🍎 **苹果风格设计系统** - 基于 iOS Human Interface Guidelines 的精美 UI
- 🎨 **动态主题** - 支持浅色/深色模式自动切换
- ⚡ **高性能架构** - 使用 Zustand + TanStack Query + MMKV 的现代化状态管理
- 🧭 **类型安全导航** - 完全类型化的 React Navigation 7 导航系统
- 📱 **响应式设计** - 适配各种屏幕尺寸和设备类型
- 🔒 **安全存储** - 使用 MMKV 的高性能加密存储
- 🎭 **流畅动画** - React Native Reanimated 3 提供的丝滑体验
- 📝 **智能表单** - React Hook Form 驱动的高效表单处理

---

## 🏗️ 技术栈

### 核心框架
- **React Native 0.81.1** - 跨平台移动应用框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **React 19.1.0** - 最新的 React 版本

### 导航系统
- **React Navigation 7** - 原生导航体验
- **Stack Navigator** - 页面栈导航
- **Bottom Tabs** - 底部标签导航

### 状态管理
- **Zustand 5.0** - 轻量级状态管理库
- **TanStack Query 5** - 强大的数据获取和缓存
- **MMKV** - 高性能键值存储

### UI 组件
- **React Native Paper 5** - Material Design 组件（自定义苹果风格）
- **React Native Vector Icons** - 丰富的图标库
- **React Native SVG** - SVG 图形支持
- **React Native Blur** - 毛玻璃效果

### 动画和手势
- **React Native Reanimated 3** - 高性能动画库
- **React Native Gesture Handler 2** - 手势识别系统
- **React Native Haptic Feedback** - 触觉反馈

### 表单处理
- **React Hook Form 7** - 高性能表单库
- **Yup** - 模式验证库
- **@hookform/resolvers** - 解析器集成

### 网络请求
- **Axios 1.7** - HTTP 客户端
- **@react-native-community/netinfo** - 网络状态监听

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript** - 静态类型检查

---

## 📁 项目结构

```
src/
├── 📱 components/           # 可复用UI组件
│   ├── ui/                  # 基础UI组件（按钮、输入框等）
│   ├── forms/               # 表单相关组件
│   ├── navigation/          # 导航相关组件
│   └── common/              # 通用组件
├── 📄 screens/              # 页面组件
│   ├── auth/                # 认证相关页面
│   ├── home/                # 首页
│   ├── alarm/               # 故障告警页面
│   ├── resource/            # 资源管理页面
│   ├── workorder/           # 工单管理页面
│   ├── profile/             # 个人中心
│   └── settings/            # 设置页面
├── 🔀 navigation/           # 导航配置
│   ├── RootNavigator.tsx    # 根导航器
│   ├── AuthNavigator.tsx    # 认证导航器
│   └── MainNavigator.tsx    # 主导航器
├── 🗃️ store/                # 状态管理 (Zustand)
│   ├── slices/              # 状态切片
│   ├── middleware/          # 中间件
│   └── index.ts             # 状态导出
├── 🌐 services/             # API服务层
│   ├── api/                 # API接口定义
│   ├── queries/             # TanStack Query查询
│   ├── mutations/           # TanStack Query变更
│   └── client.ts            # Axios客户端配置
├── 🎨 theme/                # 苹果风格主题系统
│   ├── colors.ts            # 颜色定义
│   ├── typography.ts        # 字体定义
│   ├── spacing.ts           # 间距定义
│   ├── shadows.ts           # 阴影定义
│   └── index.ts             # 主题导出
├── 🔧 utils/                # 工具函数
│   ├── storage.ts           # MMKV存储工具
│   ├── validation.ts        # 表单验证
│   ├── formatters.ts        # 格式化工具
│   └── constants.ts         # 常量定义
├── 🏗️ hooks/                # 自定义Hooks
│   ├── useStorage.ts        # 存储Hook
│   ├── useAuth.ts           # 认证Hook
│   └── useTheme.ts          # 主题Hook
├── 📋 types/                # TypeScript类型定义
│   ├── api.ts               # API类型
│   ├── navigation.ts        # 导航类型
│   └── common.ts            # 通用类型
└── 📦 assets/               # 静态资源
    ├── images/              # 图片资源
    ├── icons/               # 图标资源
    └── fonts/               # 字体资源
```

### 🎯 核心技术栈集成

- **🧭 React Navigation** - 类型安全的导航系统
- **🗃️ Zustand** - 轻量级状态管理
- **🔄 TanStack Query + Axios** - 数据获取和缓存
- **💾 MMKV** - 高性能键值存储
- **📝 React Hook Form** - 高性能表单处理
- **✨ React Native Reanimated** - 流畅动画
- **🎨 React Native Paper** - Material Design组件（自定义为苹果风格）

---

## 🎨 设计系统

### 颜色系统
- **动态颜色** - 自动适配浅色/深色模式
- **语义化颜色** - primary、success、warning、error 等
- **苹果标准色彩** - 基于 iOS 系统颜色

### 字体系统
- **SF Pro 风格** - 类似苹果系统字体的层次结构
- **动态字体** - 支持无障碍字体缩放
- **响应式字体** - 根据屏幕尺寸自适应

### 🍎 苹果风格设计系统

- **颜色系统**: 动态颜色，支持深色/浅色模式
- **字体**: SF Pro 风格字体层次
- **阴影**: 精细的阴影系统
- **动画**: 流畅的苹果风格过渡动画
- **布局**: 符合iOS人机界面指南的布局

### 间距系统
- **8pt 网格** - 基于苹果设计规范的间距系统
- **组件间距** - 预定义的组件内外边距
- **响应式间距** - 根据设备尺寸调整

### 阴影系统
- **分层阴影** - 6 个层级的精细阴影定义
- **组件阴影** - 针对不同组件的专用阴影
- **深色模式适配** - 深色模式下的阴影调整

---

## 📱 界面设计规范

### 应用整体结构设计

#### 导航模式
采用底部标签栏 (Bottom Tab Bar) 作为一级导航，持久显示在主界面底部。

#### 标签栏设计
共设置四个主标签页：
- **"首页概览"** - 运维数据总览
- **"资源管理"** - 设备资源管理
- **"故障告警"** - 告警信息处理
- **"运维工单"** - 工单流程管理

性能管理作为一项专业性强的分析功能，其核心概览信息将融入"首页概览"，详细查询功能则整合进"资源管理"和"故障告警"的相关设备详情页中。

#### 通用页面元素
- **顶部导航栏**: 每个页面顶部都应有一个导航栏，包含页面标题，左侧为"返回"按钮（在非一级页面），右侧可放置"搜索"、"筛选"或"新建"等操作图标。
- **列表与卡片**: 广泛使用卡片式设计来承载信息块，使界面清晰、易于点选。列表应支持下拉刷新和上拉加载更多。
- **数据展示**: 所有敏感数据，如IP地址、用户信息等，均需进行脱敏展示。

### 各界面详细设计

#### 1. 登录界面
- **背景**: 简洁的科技风格背景，突出中国移动的品牌元素
- **Logo**: 页面顶部或中央展示项目Logo或名称"专网综合网管掌上运维平台"
- **输入框**:
  - 一个"用户名"输入框，带有清晰的标签和图标
  - 一个"密码"输入框，带有标签和图标，并提供密码可见/隐藏切换功能
- **按钮**: 页面下方一个醒目的"登录"按钮
- **其他**: 可根据需要添加"记住密码"复选框或"忘记密码"链接

#### 2. 主界面：首页概览 (第一个Tab)
此页面作为运维人员进入APP后的第一个视图，旨在快速洞察网络整体运行状况。

**顶部区域**:
- **公告栏**: 顶部可以有一个滚动播放的公告弹窗区域，用于展示重要信息
- **核心指标统计**: 以大字体和醒目颜色展示几个最关键的实时指标，例如："当前活动告警总数"、"进行中工单数"、"资源健康度评分"

**中间卡片区域 (网格布局)**:
- **故障概览卡片**:
  - 标题："故障告警"
  - 内容：使用环形图或仪表盘展示不同告警级别的告警数量（如：紧急、重要、次要）。下方显示"重大故障"的计数
  - 交互：点击卡片可跳转至"故障告警"Tab页面
- **性能概览卡片**:
  - 标题："网络性能"
  - 内容：展示当前性能异常设备的分类统计，并以列表形式展示Top N关键性能指标的异常情况，如"XX设备CPU使用率过高"
  - 交互：点击可跳转至特定设备的性能详情页
- **资源概览卡片**:
  - 标题："资源统计"
  - 内容：以简洁的条形图展示核心资源的规模统计，如5GC、云资源、承载设备数量。显示全局的资源合规概况百分比
  - 交互：点击卡片可跳转至"资源管理"Tab页面
- **工单概览卡片**:
  - 标题："运维工单"
  - 内容：显示"在途工单"、"超时工单"和"今日已完成"的数量统计
  - 交互：点击卡片可跳转至"运维工单"Tab页面

#### 3. 资源管理界面 (第二个Tab)
- **顶部**: 一个贯穿整个页面的"搜索框"，提示用户"按资源名称/类型搜索"
- **内容区域**:
  - **统计视图**: 搜索框下方以标签页或分段控件的形式，展示不同维度的资源统计，如"按专业"、"按类型"，点击后下方列表会相应筛选
  - **资源列表**:
    - 以卡片列表形式展示资源条目
    - 每个卡片上显示资源的核心信息：资源名称、资源类型、当前状态（如：正常、告警）、所属机房
    - 点击任一卡片，进入"资源详情"页面

**3.1 资源详情页 (从资源列表点击进入)**
- **顶部**: 显示资源名称
- **内容区域 (分段显示)**:
  - **基础信息**: "详细属性"区域，用键值对列表展示该资源的详细脱敏信息
  - **关联信息**:
    - "关联拓扑"标签页：展示该资源的上下级关联信息和图形化的拓扑图
    - "资源履历"标签页：展示该资源的历史变更记录
  - **关联数据**:
    - "当前告警"标签页：显示与此资源直接相关的当前活动告警列表
    - "性能指标"标签页：显示此资源的核心性能指标，并支持选择时间范围查询趋势图

#### 4. 故障告警界面 (第三个Tab)
**顶部**:
- **统计概览**: 用一组数据卡片展示告警生命周期统计，如"总告警数"、"已派单"、"处理中"、"已解决"
- **筛选栏**: 提供一个筛选按钮，点击后弹出筛选面板，支持按"告警级别"、"状态"、"时间范围"等条件查询告警

**内容区域**:
- **告警列表**: 以列表形式展示告警信息
- **列表项**: 每个告警条目应包含：
  - 告警级别（用不同颜色标记，如红色表示紧急）
  - 告警标题/内容
  - 告警对象（设备名称）
  - 首次发生时间
- **交互**: 点击列表项进入"告警详情"页面

**4.1 告警详情页 (从告警列表点击进入)**
- **顶部**: 显示告警标题
- **内容区域**:
  - **告警详情**: 展示告警的所有字段信息，如告警ID、级别、状态、发生时间、定位信息等
  - **故障诊断**:
    - 一个名为"智能诊断"的区域或按钮
    - 点击后，显示拉通数字员工后反馈的告警定位及问题详情。例如，可能会显示："诊断结论：链路故障。原因：光功率过低。"

#### 5. 运维工单界面 (第四个Tab)
**顶部**:
- **统计概览**: 用数据卡片展示各类工单的在途数量和超时数量
- **筛选/分类**: 提供"全部"、"待处理"、"处理中"、"已完成"等状态筛选标签
- **新建按钮**: 右上角放置一个"+"号按钮，用于创建特定类型的工单

**内容区域**:
- **工单列表**: 以卡片列表形式展示工单
- **卡片内容**: 显示工单标题、工单类型（如：故障工单、割接巡检）、当前状态、创建时间
- **交互**: 点击卡片进入"工单详情"页面

**5.1 工单详情页 (从工单列表点击进入)**
- **顶部**: 显示工单标题和ID
- **内容区域**:
  - **工单信息**: 展示工单的详细内容、创建人、创建时间、处理时限等
  - **处理流程**: 以时间轴的形式展示工单的处理过程和每个节点的反馈信息
  - **操作栏 (底部)**: 根据工单状态和用户权限，提供不同的操作按钮，如"督办"、"转派"、"处理"、"关闭"等

**5.2 新建工单页 (从工单列表点击"+"进入)**
- **表单类型**: 根据规范，此页面主要用于"割接巡检申请"和"介质携带类工单"的创建
- **表单字段**:
  - 工单类型选择器（割接巡检/介质携带）
  - 标题输入框
  - 详细描述文本域
  - 时间选择器（计划开始/结束时间）
  - 附件上传功能
- **按钮**: 底部提供"提交"按钮

---

## 🔧 环境搭建

### 系统要求

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

### 安装开发环境

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

---

## 🚀 安装指南

### 快速开始

确保你已经完成了 [React Native 环境搭建](https://reactnative.dev/docs/environment-setup)：

- **Node.js** >= 20
- **React Native CLI**
- **Android Studio** (Android 开发)
- **Xcode** (iOS 开发，仅 macOS)

### 项目初始化

#### 1. 克隆项目
```bash
git clone <repository-url>
cd operate_app
```

#### 2. 安装项目依赖
```bash
# 安装所有 npm 依赖
npm install

# 或使用 yarn
yarn install
```

#### 3. iOS 依赖安装 (仅 macOS)
```bash
cd ios && pod install && cd ..
```

#### 4. 启动 Metro 服务器
```bash
npm start
# 或
yarn start
```

#### 5. 运行应用

**Android:**
```bash
npm run android
# 或
yarn android
```

**iOS:**
```bash
npm run ios
# 或
yarn ios
```

### 依赖包安装

#### 核心依赖
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

#### 开发依赖
```bash
npm install -D \
  @types/react-native-vector-icons \
  eslint-plugin-react-hooks
```

### 配置文件设置

#### 1. TypeScript 配置 (tsconfig.json)
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

#### 2. Metro 配置 (metro.config.js)
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

#### 3. Babel 配置 (babel.config.js)
```javascript
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
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
    'react-native-reanimated/plugin', // 必须是最后一个插件
  ],
};
```

### 平台特定配置

#### Android 配置

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

#### iOS 配置

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

---

## 🔧 核心功能

### 状态管理 (Zustand)
- **认证状态** - 用户登录、注册、token 管理
- **应用状态** - 主题、语言、设置管理
- **用户数据** - 个人资料、偏好设置、收藏等
- **持久化** - 自动保存重要状态到本地存储

### 数据获取 (TanStack Query)
- **智能缓存** - 自动缓存和失效策略
- **后台更新** - 数据自动同步和更新
- **错误处理** - 统一的错误处理和重试机制
- **加载状态** - 细粒度的加载状态管理

### 存储系统 (MMKV)
- **高性能** - 比 AsyncStorage 快 30 倍
- **加密存储** - 敏感数据加密保护
- **类型安全** - TypeScript 类型支持
- **便捷 API** - 简化的存储操作接口

### 导航系统
- **类型安全** - 完全类型化的导航参数
- **深层链接** - 支持应用内外链接跳转
- **动画过渡** - 流畅的页面切换动画
- **状态管理** - 导航状态与应用状态同步

---

## 🛠️ 开发指南

### 添加新页面

1. 在 `src/screens/` 下创建页面组件
2. 在 `src/types/navigation.ts` 中添加路由参数类型
3. 在对应的导航器中添加路由配置

### 添加新状态

1. 在 `src/store/slices/` 下创建状态切片
2. 在 `src/store/index.ts` 中集成新切片
3. 导出相关的选择器和操作方法

### 添加新组件

1. 在 `src/components/` 对应目录下创建组件
2. 使用 `useTheme` Hook 获取主题配置
3. 遵循苹果设计规范和组件 API 设计

### API 集成

1. 在 `src/services/api/` 下定义 API 接口
2. 在 `src/services/queries/` 下创建查询 Hook
3. 在 `src/services/mutations/` 下创建变更 Hook

### 开发脚本

```bash
# 启动开发服务器
npm start

# 运行 Android 应用
npm run android

# 运行 iOS 应用
npm run ios

# 代码检查和修复
npm run lint

# TypeScript 类型检查
npm run type-check

# 清理缓存
npm run reset-cache

# 清理构建文件
npm run clean
```

---

## 📱 支持平台

- ✅ **iOS** 13.0+
- ✅ **Android** API 21+ (Android 5.0)
- 📱 **手机** 和 **平板** 设备
- 🌙 **浅色** 和 **深色** 主题

---

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

---

## 📦 构建发布

### Android
```bash
# 生成 Release APK
cd android && ./gradlew assembleRelease

# 生成 AAB (推荐)
cd android && ./gradlew bundleRelease
```

### iOS
```bash
# 使用 Xcode 构建和发布
# 或使用 Fastlane 自动化构建
```

---

## 🐛 故障排除

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

---

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

---

## 🎉 完成！

恭喜！你已经成功设置了一个功能完整的 React Native 项目。现在你可以：

1. 开始开发你的应用功能
2. 自定义主题和样式
3. 添加新的页面和组件
4. 集成后端 API
5. 测试和发布应用

---

## 📚 下一步学习

- [React Navigation 文档](https://reactnavigation.org/)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [TanStack Query 文档](https://tanstack.com/query)
- [React Native Reanimated 文档](https://docs.swmansion.com/react-native-reanimated/)
- [苹果人机界面指南](https://developer.apple.com/design/human-interface-guidelines/)

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- [React Native](https://reactnative.dev/) - 优秀的跨平台框架
- [Expo](https://expo.dev/) - 强大的开发工具链
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) - 设计灵感来源

---

## 📞 支持

如果你有任何问题或建议，请：

- 创建 [Issue](https://github.com/your-username/operate_app/issues)
- 发送邮件到 support@operateapp.com
- 访问我们的 [文档网站](https://docs.operateapp.com)

---

**Made with ❤️ by OperateApp Team**

**祝你开发愉快！如有问题，请查看项目文档或提交 Issue。**