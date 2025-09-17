/**
 * 通用类型定义
 */

// 基础 ID 类型
export type ID = string | number;

// 时间戳类型
export type Timestamp = number;

// 用户信息接口
export interface User {
  id: ID;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// API 响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

// 分页信息
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 分页数据响应
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// 加载状态
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 通用异步状态
export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 表单字段配置
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rules?: ValidationRule[];
}

// 验证规则
export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// 选项类型
export interface Option<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
}

// 菜单项类型
export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  children?: MenuItem[];
}

// 通知类型
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// 设备信息
export interface DeviceInfo {
  platform: 'ios' | 'android';
  version: string;
  model: string;
  isTablet: boolean;
  hasNotch: boolean;
}

// 应用设置
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  biometrics: boolean;
  analytics: boolean;
}

// 错误信息
export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: Timestamp;
}

// 数据状态管理
export interface DataState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  lastUpdated: Timestamp | null;
  hasMore: boolean;
}

// 搜索参数
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

// 文件上传信息
export interface FileUpload {
  uri: string;
  name: string;
  type: string;
  size: number;
}

// 位置信息
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: Timestamp;
}

// 社交分享内容
export interface ShareContent {
  title: string;
  message: string;
  url?: string;
  imageUrl?: string;
}

// 权限状态
export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

// 网络状态
export interface NetworkState {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'bluetooth' | 'ethernet' | 'wimax' | 'vpn' | 'other' | 'unknown' | 'none';
  isInternetReachable: boolean;
}

// 应用状态
export type AppState = 'active' | 'background' | 'inactive';

// 屏幕尺寸信息
export interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

// 触觉反馈类型
export type HapticFeedbackType = 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationWarning' | 'notificationError';

// 工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type NonNullable<T> = T extends null | undefined ? never : T;
