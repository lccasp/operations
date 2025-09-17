# 项目目录结构规划

## 🚀 OperateApp - 苹果风格高端 React Native 应用

### 📁 目录结构

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
│   ├── types.ts             # 导航类型定义
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

### 🍎 苹果风格设计系统

- **颜色系统**: 动态颜色，支持深色/浅色模式
- **字体**: SF Pro 风格字体层次
- **阴影**: 精细的阴影系统
- **动画**: 流畅的苹果风格过渡动画
- **布局**: 符合iOS人机界面指南的布局
