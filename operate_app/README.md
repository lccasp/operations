# 🚀 OperateApp - 苹果风格高端 React Native 应用

> 一个集成了现代化技术栈的高端移动应用，采用苹果风格设计，达到 20 美金付费产品的视觉效果标准。

## ✨ 特性亮点

- 🍎 **苹果风格设计系统** - 基于 iOS Human Interface Guidelines 的精美 UI
- 🎨 **动态主题** - 支持浅色/深色模式自动切换
- ⚡ **高性能架构** - 使用 Zustand + TanStack Query + MMKV 的现代化状态管理
- 🧭 **类型安全导航** - 完全类型化的 React Navigation 7 导航系统
- 📱 **响应式设计** - 适配各种屏幕尺寸和设备类型
- 🔒 **安全存储** - 使用 MMKV 的高性能加密存储
- 🎭 **流畅动画** - React Native Reanimated 3 提供的丝滑体验
- 📝 **智能表单** - React Hook Form 驱动的高效表单处理

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
│   ├── profile/             # 个人中心
│   └── settings/            # 设置页面
├── 🔀 navigation/           # 导航配置
│   ├── RootNavigator.tsx    # 根导航器
│   ├── AuthNavigator.tsx    # 认证导航器
│   └── MainNavigator.tsx    # 主导航器
├── 🗃️ store/                # 状态管理 (Zustand)
│   ├── slices/              # 状态切片
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

## 🚀 快速开始

### 环境要求

确保你已经完成了 [React Native 环境搭建](https://reactnative.dev/docs/environment-setup)：

- **Node.js** >= 20
- **React Native CLI**
- **Android Studio** (Android 开发)
- **Xcode** (iOS 开发，仅 macOS)

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd operate_app
```

2. **安装依赖**
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

3. **iOS 依赖安装** (仅 macOS)
```bash
cd ios && pod install && cd ..
```

4. **启动 Metro 服务器**
```bash
npm start
# 或
yarn start
```

5. **运行应用**

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

## 🎨 设计系统

### 颜色系统
- **动态颜色** - 自动适配浅色/深色模式
- **语义化颜色** - primary、success、warning、error 等
- **苹果标准色彩** - 基于 iOS 系统颜色

### 字体系统
- **SF Pro 风格** - 类似苹果系统字体的层次结构
- **动态字体** - 支持无障碍字体缩放
- **响应式字体** - 根据屏幕尺寸自适应

### 间距系统
- **8pt 网格** - 基于苹果设计规范的间距系统
- **组件间距** - 预定义的组件内外边距
- **响应式间距** - 根据设备尺寸调整

### 阴影系统
- **分层阴影** - 6 个层级的精细阴影定义
- **组件阴影** - 针对不同组件的专用阴影
- **深色模式适配** - 深色模式下的阴影调整

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

## 📱 支持平台

- ✅ **iOS** 13.0+
- ✅ **Android** API 21+ (Android 5.0)
- 📱 **手机** 和 **平板** 设备
- 🌙 **浅色** 和 **深色** 主题

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

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

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

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React Native](https://reactnative.dev/) - 优秀的跨平台框架
- [Expo](https://expo.dev/) - 强大的开发工具链
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) - 设计灵感来源

## 📞 支持

如果你有任何问题或建议，请：

- 创建 [Issue](https://github.com/your-username/operate_app/issues)
- 发送邮件到 support@operateapp.com
- 访问我们的 [文档网站](https://docs.operateapp.com)

---

**Made with ❤️ by OperateApp Team**