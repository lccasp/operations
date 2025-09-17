/**
 * 导航类型定义
 * 基于 React Navigation v7 的类型系统
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// 认证导航参数
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
  };
  VerifyEmail: {
    email: string;
  };
};

// 主导航参数
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ResourceManagementTab: NavigatorScreenParams<ResourceManagementStackParamList>;
  FaultAlarmTab: NavigatorScreenParams<FaultAlarmStackParamList>;
  WorkOrderTab: NavigatorScreenParams<WorkOrderStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// 首页导航参数
export type HomeStackParamList = {
  Home: undefined;
  Details: {
    id: string;
    title?: string;
  };
  Search: {
    initialQuery?: string;
  };
  Notifications: undefined;
};

// 资源管理导航参数
export type ResourceManagementStackParamList = {
  ResourceManagement: undefined;
  ResourceDetails: {
    id: string;
  };
};

// 故障告警导航参数
export type FaultAlarmStackParamList = {
  FaultAlarm: undefined;
  AlarmDetails: {
    id: string;
  };
};

// 运维工单导航参数
export type WorkOrderStackParamList = {
  WorkOrder: undefined;
  WorkOrderDetails: {
    id: string;
  };
  CreateWorkOrder: undefined;
};

// 个人中心导航参数
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  PrivacySettings: undefined;
  NotificationSettings: undefined;
};

// 根导航参数
export type RootStackParamList = {
  // 启动页
  Splash: undefined;
  
  // 引导页
  Onboarding: undefined;
  
  // 认证流程
  Auth: NavigatorScreenParams<AuthStackParamList>;
  
  // 主应用
  Main: NavigatorScreenParams<MainTabParamList>;
  
  // 模态页面
  Modal: {
    component: string;
    props?: Record<string, any>;
  };
  
  // 全屏页面
  FullScreen: {
    component: string;
    props?: Record<string, any>;
  };
  
  // 错误页面
  Error: {
    message: string;
    retry?: () => void;
  };
  
  // 维护页面
  Maintenance: undefined;
  
  // 网络错误页面
  NetworkError: undefined;
};

// 全局导航参数（跨导航器使用）
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// 屏幕组件 Props 类型
export type AuthScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

export type HomeScreenProps<T extends keyof HomeStackParamList> = StackScreenProps<
  HomeStackParamList,
  T
>;

export type ResourceManagementScreenProps<T extends keyof ResourceManagementStackParamList> = StackScreenProps<
  ResourceManagementStackParamList,
  T
>;

export type FaultAlarmScreenProps<T extends keyof FaultAlarmStackParamList> = StackScreenProps<
  FaultAlarmStackParamList,
  T
>;

export type WorkOrderScreenProps<T extends keyof WorkOrderStackParamList> = StackScreenProps<
  WorkOrderStackParamList,
  T
>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = StackScreenProps<
  ProfileStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type RootScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

// 导航配置接口
export interface NavigationConfig {
  initialRouteName?: string;
  screenOptions?: object;
  defaultNavigationOptions?: object;
}

// 标签栏配置
export interface TabBarConfig {
  activeTintColor?: string;
  inactiveTintColor?: string;
  showLabel?: boolean;
  showIcon?: boolean;
  labelStyle?: object;
  iconStyle?: object;
  tabStyle?: object;
  style?: object;
}

// 导航主题
export interface NavigationTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

// 导航动画配置
export interface NavigationAnimation {
  gestureEnabled?: boolean;
  cardStyleInterpolator?: any;
  headerStyleInterpolator?: any;
  transitionSpec?: {
    open: any;
    close: any;
  };
}

// 路由信息
export interface RouteInfo {
  name: string;
  params?: Record<string, any>;
  path?: string;
  state?: any;
}

// 导航状态
export interface NavigationState {
  routes: RouteInfo[];
  index: number;
  routeNames: string[];
  history?: any[];
  type: string;
  stale: boolean;
}

// 导航选项
export interface ScreenOptions {
  title?: string;
  headerShown?: boolean;
  headerTitle?: string;
  headerTitleAlign?: 'left' | 'center';
  headerBackTitleVisible?: boolean;
  headerLeft?: () => React.ReactNode;
  headerRight?: () => React.ReactNode;
  headerStyle?: object;
  headerTitleStyle?: object;
  headerTintColor?: string;
  headerBackgroundContainerStyle?: object;
  gestureEnabled?: boolean;
  animationEnabled?: boolean;
  presentation?: 'modal' | 'transparentModal' | 'fullScreenModal';
}

// 深层链接配置
export interface DeepLinkConfig {
  screens: Record<string, string | DeepLinkScreenConfig>;
}

export interface DeepLinkScreenConfig {
  path?: string;
  exact?: boolean;
  screens?: Record<string, string | DeepLinkScreenConfig>;
}

// 导航工具类型
export type NavigationProp = any; // 实际使用时会被具体的导航 hook 类型替换
export type RouteProp = any; // 实际使用时会被具体的路由 hook 类型替换
