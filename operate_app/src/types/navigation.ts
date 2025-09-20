/**
 * 导航相关类型定义
 * 
 * 本文件定义了React Navigation的所有类型安全配置
 * 包括路由参数、导航属性、屏幕组件类型等
 */

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ID } from './common';

// ===== 根导航参数类型 =====

/** 
 * 根导航栈参数列表
 * 定义应用的顶层导航结构
 */
export type RootStackParamList = {
  /** 启动屏 - 应用初始化时显示 */
  Splash: undefined;
  
  /** 引导屏 - 首次使用时的引导流程 */
  Onboarding: undefined;
  
  /** 认证流程 - 包含登录、注册等页面 */
  Auth: NavigatorScreenParams<AuthStackParamList>;
  
  /** 主应用 - 包含底部标签导航 */
  Main: NavigatorScreenParams<MainTabParamList>;
  
  /** 模态页面 - 全屏模态展示 */
  Modal: {
    /** 模态页面类型 */
    type: 'settings' | 'profile' | 'help' | 'about';
    /** 传递的数据 */
    data?: any;
  };
  
  /** 全屏页面 - 特殊的全屏展示页面 */
  FullScreen: {
    /** 页面类型 */
    type: 'image' | 'video' | 'document';
    /** 资源URL */
    url: string;
    /** 页面标题 */
    title?: string;
  };
  
  /** 错误页面 - 应用错误时显示 */
  Error: {
    /** 错误信息 */
    error: string;
    /** 错误代码 */
    code?: string;
    /** 重试函数 */
    retry?: () => void;
  };
};

// ===== 认证导航参数类型 =====

/** 
 * 认证导航栈参数列表
 * 定义认证相关页面的导航结构
 */
export type AuthStackParamList = {
  /** 欢迎页面 */
  Welcome: undefined;
  
  /** 登录页面 */
  Login: undefined;
  
  /** 注册页面 */
  Register: undefined;
  
  /** 忘记密码页面 */
  ForgotPassword: undefined;
  
  /** 重置密码页面 */
  ResetPassword: {
    /** 重置令牌 */
    token: string;
    /** 用户邮箱 */
    email: string;
  };
  
  /** 邮箱验证页面 */
  EmailVerification: {
    /** 用户邮箱 */
    email: string;
  };
};

// ===== 主应用标签导航参数类型 =====

/** 
 * 主标签导航参数列表
 * 定义底部标签栏的导航结构
 */
export type MainTabParamList = {
  /** 首页标签 - 数据概览 */
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  
  /** 资源管理标签 */
  ResourceManagementTab: NavigatorScreenParams<ResourceManagementStackParamList>;
  
  /** 故障告警标签 */
  FaultAlarmTab: NavigatorScreenParams<FaultAlarmStackParamList>;
  
  /** 运维工单标签 */
  WorkOrderTab: NavigatorScreenParams<WorkOrderStackParamList>;
  
  /** 个人中心标签 */
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ===== 首页导航参数类型 =====

/** 
 * 首页栈导航参数列表
 */
export type HomeStackParamList = {
  /** 首页主屏 */
  Home: undefined;
  
  /** 搜索页面 */
  Search: {
    /** 搜索类型 */
    type?: 'global' | 'alarms' | 'workorders' | 'resources';
    /** 初始搜索词 */
    initialQuery?: string;
  };
  
  /** 通知列表 */
  Notifications: undefined;
  
  /** 通知详情 */
  NotificationDetail: {
    /** 通知ID */
    notificationId: ID;
  };
};

// ===== 资源管理导航参数类型 =====

/** 
 * 资源管理栈导航参数列表
 */
export type ResourceManagementStackParamList = {
  /** 资源管理主屏 */
  ResourceManagement: undefined;
  
  /** 资源详情 */
  ResourceDetails: {
    /** 资源ID */
    resourceId: ID;
    /** 资源名称（用于标题显示） */
    resourceName?: string;
  };
  
  /** 资源编辑 */
  ResourceEdit: {
    /** 资源ID（编辑时） */
    resourceId?: ID;
    /** 资源类型（新建时） */
    resourceType?: string;
  };
  
  /** 资源拓扑图 */
  ResourceTopology: {
    /** 根资源ID */
    rootResourceId: ID;
  };
  
  /** 资源性能监控 */
  ResourcePerformance: {
    /** 资源ID */
    resourceId: ID;
    /** 监控指标类型 */
    metricType?: 'cpu' | 'memory' | 'network' | 'disk';
  };
};

// ===== 故障告警导航参数类型 =====

/** 
 * 故障告警栈导航参数列表
 */
export type FaultAlarmStackParamList = {
  /** 故障告警主屏 */
  FaultAlarm: undefined;
  
  /** 告警详情 */
  AlarmDetails: {
    /** 告警ID */
    alarmId: ID;
  };
  
  /** 告警处理 */
  AlarmHandle: {
    /** 告警ID */
    alarmId: ID;
    /** 处理类型 */
    handleType: 'acknowledge' | 'resolve' | 'escalate';
  };
  
  /** 告警统计 */
  AlarmStatistics: {
    /** 统计时间范围 */
    timeRange?: 'today' | 'week' | 'month' | 'custom';
    /** 自定义时间范围 */
    customRange?: [number, number];
  };
  
  /** 告警规则配置 */
  AlarmRules: undefined;
  
  /** 告警规则编辑 */
  AlarmRuleEdit: {
    /** 规则ID（编辑时） */
    ruleId?: ID;
  };
};

// ===== 工单管理导航参数类型 =====

/** 
 * 工单管理栈导航参数列表
 */
export type WorkOrderStackParamList = {
  /** 工单管理主屏 */
  WorkOrder: undefined;
  
  /** 工单详情 */
  WorkOrderDetails: {
    /** 工单ID */
    workOrderId: ID;
  };
  
  /** 创建工单 */
  CreateWorkOrder: {
    /** 工单类型 */
    type?: 'maintenance' | 'incident' | 'request' | 'change';
    /** 关联资源ID */
    relatedResourceId?: ID;
    /** 关联告警ID */
    relatedAlarmId?: ID;
  };
  
  /** 工单编辑 */
  WorkOrderEdit: {
    /** 工单ID */
    workOrderId: ID;
  };
  
  /** 工单流程 */
  WorkOrderFlow: {
    /** 工单ID */
    workOrderId: ID;
  };
  
  /** 工单统计 */
  WorkOrderStatistics: {
    /** 统计维度 */
    dimension: 'status' | 'type' | 'assignee' | 'priority';
    /** 统计时间范围 */
    timeRange?: 'today' | 'week' | 'month' | 'custom';
  };
};

// ===== 个人中心导航参数类型 =====

/** 
 * 个人中心栈导航参数列表
 */
export type ProfileStackParamList = {
  /** 个人中心主屏 */
  Profile: undefined;
  
  /** 个人信息编辑 */
  ProfileEdit: undefined;
  
  /** 账户设置 */
  AccountSettings: undefined;
  
  /** 应用设置 */
  AppSettings: undefined;
  
  /** 通知设置 */
  NotificationSettings: undefined;
  
  /** 安全设置 */
  SecuritySettings: undefined;
  
  /** 修改密码 */
  ChangePassword: undefined;
  
  /** 关于页面 */
  About: undefined;
  
  /** 帮助中心 */
  Help: undefined;
  
  /** 反馈建议 */
  Feedback: undefined;
};

// ===== 屏幕组件Props类型定义 =====

/** 根导航屏幕Props */
export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

/** 认证导航屏幕Props */
export type AuthScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, T>,
  RootScreenProps<keyof RootStackParamList>
>;

/** 主标签导航屏幕Props */
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootScreenProps<keyof RootStackParamList>
>;

/** 首页导航屏幕Props */
export type HomeScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

/** 资源管理导航屏幕Props */
export type ResourceManagementScreenProps<T extends keyof ResourceManagementStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ResourceManagementStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

/** 故障告警导航屏幕Props */
export type FaultAlarmScreenProps<T extends keyof FaultAlarmStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<FaultAlarmStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

/** 工单管理导航屏幕Props */
export type WorkOrderScreenProps<T extends keyof WorkOrderStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<WorkOrderStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

/** 个人中心导航屏幕Props */
export type ProfileScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

// ===== 导航相关工具类型 =====

/** 
 * 导航参数提取工具类型
 * @template T 导航参数列表类型
 * @template K 路由名称
 */
export type NavigationParams<T, K extends keyof T> = T[K];

/** 
 * 路由名称联合类型
 */
export type RootRouteName = keyof RootStackParamList;
export type AuthRouteName = keyof AuthStackParamList;
export type MainTabRouteName = keyof MainTabParamList;
export type HomeRouteName = keyof HomeStackParamList;
export type ResourceManagementRouteName = keyof ResourceManagementStackParamList;
export type FaultAlarmRouteName = keyof FaultAlarmStackParamList;
export type WorkOrderRouteName = keyof WorkOrderStackParamList;
export type ProfileRouteName = keyof ProfileStackParamList;

/** 
 * 所有路由名称的联合类型
 */
export type AllRouteName = 
  | RootRouteName
  | AuthRouteName
  | MainTabRouteName
  | HomeRouteName
  | ResourceManagementRouteName
  | FaultAlarmRouteName
  | WorkOrderRouteName
  | ProfileRouteName;

// ===== 导航配置类型 =====

/** 
 * 导航选项配置类型
 */
export interface NavigationOptions {
  /** 页面标题 */
  title?: string;
  /** 是否显示头部 */
  headerShown?: boolean;
  /** 是否显示返回按钮 */
  headerBackVisible?: boolean;
  /** 头部背景色 */
  headerStyle?: {
    backgroundColor?: string;
  };
  /** 头部文字颜色 */
  headerTintColor?: string;
  /** 标题文字样式 */
  headerTitleStyle?: {
    fontWeight?: string;
    fontSize?: number;
  };
  /** 是否启用手势 */
  gestureEnabled?: boolean;
  /** 动画类型 */
  presentation?: 'card' | 'modal' | 'transparentModal';
}

/** 
 * 标签栏配置类型
 */
export interface TabBarOptions {
  /** 标签文本 */
  tabBarLabel?: string;
  /** 标签图标 */
  tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  /** 徽章文本 */
  tabBarBadge?: string | number;
  /** 是否显示标签 */
  tabBarItemStyle?: object;
  /** 标签激活时的颜色 */
  tabBarActiveTintColor?: string;
  /** 标签未激活时的颜色 */
  tabBarInactiveTintColor?: string;
}

// ===== 深度链接类型 =====

/** 
 * 深度链接配置类型
 */
export interface DeepLinkConfig {
  /** URL方案 */
  scheme: string;
  /** 主机名 */
  host?: string;
  /** 路径配置 */
  config: {
    screens: Record<string, string | DeepLinkScreenConfig>;
  };
}

/** 
 * 深度链接屏幕配置
 */
export interface DeepLinkScreenConfig {
  /** 路径模式 */
  path: string;
  /** 参数解析函数 */
  parse?: Record<string, (value: string) => any>;
  /** 参数序列化函数 */
  stringify?: Record<string, (value: any) => string>;
}

// ===== 导航状态类型 =====

/** 
 * 导航状态接口
 */
export interface NavigationState {
  /** 当前路由索引 */
  index: number;
  /** 路由列表 */
  routes: NavigationRoute[];
  /** 导航器类型 */
  type: string;
  /** 导航器键 */
  key: string;
}

/** 
 * 导航路由接口
 */
export interface NavigationRoute {
  /** 路由键 */
  key: string;
  /** 路由名称 */
  name: string;
  /** 路由参数 */
  params?: object;
  /** 子导航状态 */
  state?: NavigationState;
}

// ===== 导出类型别名 =====
export type {
  // 屏幕Props类型
  RootScreenProps as RootProps,
  AuthScreenProps as AuthProps,
  MainTabScreenProps as TabProps,
  HomeScreenProps as HomeProps,
  ResourceManagementScreenProps as ResourceProps,
  FaultAlarmScreenProps as AlarmProps,
  WorkOrderScreenProps as WorkOrderProps,
  ProfileScreenProps as ProfileProps,
  
  // 导航参数类型
  RootStackParamList as RootParams,
  AuthStackParamList as AuthParams,
  MainTabParamList as TabParams,
  
  // 路由名称类型
  AllRouteName as RouteName,
  NavigationOptions as NavOptions,
  TabBarOptions as TabOptions,
};