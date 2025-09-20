/**
 * 通用类型定义
 * 
 * 本文件包含了应用中使用的所有通用类型和接口定义
 * 遵循严格的类型安全原则，确保代码的健壮性和可维护性
 */

// ===== 基础类型定义 =====

/** 统一的ID类型 - 支持字符串和数字 */
export type ID = string | number;

/** 时间戳类型 - Unix时间戳（毫秒） */
export type Timestamp = number;

/** 状态枚举 - 通用状态定义 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/** 主题模式类型 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/** 语言代码类型 */
export type LanguageCode = 'zh-CN' | 'en-US' | 'ja-JP';

// ===== 用户相关类型 =====

/** 
 * 用户基础信息接口
 * @interface User
 */
export interface User {
  /** 用户唯一标识符 */
  id: ID;
  /** 用户邮箱地址 */
  email: string;
  /** 用户显示名称 */
  name: string;
  /** 用户头像URL（可选） */
  avatar?: string;
  /** 用户角色 */
  role?: 'admin' | 'operator' | 'viewer';
  /** 用户状态 */
  status?: 'active' | 'inactive' | 'suspended';
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
  /** 最后登录时间 */
  lastLoginAt?: Timestamp;
}

/** 
 * 用户偏好设置接口
 * @interface UserPreferences  
 */
export interface UserPreferences {
  /** 主题偏好 */
  theme: ThemeMode;
  /** 语言偏好 */
  language: LanguageCode;
  /** 通知设置 */
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  /** 显示设置 */
  display: {
    density: 'compact' | 'comfortable' | 'spacious';
    animations: boolean;
    reducedMotion: boolean;
  };
}

// ===== API响应类型 =====

/** 
 * 标准API响应接口
 * @template T 响应数据类型
 */
export interface ApiResponse<T = any> {
  /** 请求是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 成功消息 */
  message?: string;
  /** 错误信息 */
  error?: string;
  /** 错误代码 */
  code?: string;
  /** 响应时间戳 */
  timestamp?: Timestamp;
  /** 请求追踪ID */
  traceId?: string;
}

/** 
 * 分页信息接口
 * @interface Pagination
 */
export interface Pagination {
  /** 当前页码（从1开始） */
  page: number;
  /** 每页条目数量 */
  pageSize: number;
  /** 总条目数 */
  total: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrev: boolean;
}

/** 
 * 分页数据响应接口
 * @template T 数据项类型
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  /** 分页信息 */
  pagination: Pagination;
}

// ===== 应用配置类型 =====

/** 
 * 应用设置接口
 * @interface AppSettings
 */
export interface AppSettings {
  /** 主题设置 */
  theme: ThemeMode;
  /** 语言设置 */
  language: LanguageCode;
  /** 通知设置 */
  notifications: boolean;
  /** 生物识别认证 */
  biometrics: boolean;
  /** 数据分析 */
  analytics: boolean;
  /** 自动更新 */
  autoUpdate: boolean;
  /** 调试模式 */
  debugMode: boolean;
}

// ===== 通知类型 =====

/** 通知类型枚举 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/** 
 * 通知接口
 * @interface Notification
 */
export interface Notification {
  /** 通知唯一标识符 */
  id: string;
  /** 通知标题 */
  title: string;
  /** 通知内容 */
  message: string;
  /** 通知类型 */
  type: NotificationType;
  /** 显示持续时间（毫秒），0表示永不消失 */
  duration?: number;
  /** 是否可关闭 */
  closable?: boolean;
  /** 操作按钮 */
  action?: {
    label: string;
    onPress: () => void;
  };
  /** 创建时间 */
  createdAt: Timestamp;
}

// ===== 菜单类型 =====

/** 
 * 菜单项接口
 * @interface MenuItem
 */
export interface MenuItem {
  /** 菜单项唯一标识符 */
  id: string;
  /** 菜单项标题 */
  title: string;
  /** 菜单项图标 */
  icon?: string;
  /** 点击处理函数 */
  onPress?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否为危险操作 */
  destructive?: boolean;
  /** 子菜单项 */
  children?: MenuItem[];
}

// ===== 设备信息类型 =====

/** 
 * 设备信息接口
 * @interface DeviceInfo
 */
export interface DeviceInfo {
  /** 设备平台 */
  platform: 'ios' | 'android';
  /** 设备型号 */
  model: string;
  /** 系统版本 */
  systemVersion: string;
  /** 应用版本 */
  appVersion: string;
  /** 构建号 */
  buildNumber: string;
  /** 设备唯一标识符 */
  deviceId: string;
  /** 屏幕尺寸 */
  screenSize: {
    width: number;
    height: number;
    scale: number;
  };
}

// ===== 错误类型 =====

/** 
 * 应用错误接口
 * @interface AppError
 */
export interface AppError {
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code?: string;
  /** 错误详情 */
  details?: any;
  /** 错误发生时间 */
  timestamp: Timestamp;
  /** 错误堆栈信息 */
  stack?: string;
  /** 错误上下文 */
  context?: Record<string, any>;
}

// ===== 数据状态管理类型 =====

/** 
 * 数据状态接口
 * @template T 数据类型
 */
export interface DataState<T> {
  /** 数据项列表 */
  items: T[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 最后更新时间 */
  lastUpdated: Timestamp | null;
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 是否正在刷新 */
  refreshing: boolean;
}

// ===== 搜索和筛选类型 =====

/** 排序方向 */
export type SortDirection = 'asc' | 'desc';

/** 
 * 排序配置接口
 * @interface SortConfig
 */
export interface SortConfig {
  /** 排序字段 */
  field: string;
  /** 排序方向 */
  direction: SortDirection;
}

/** 
 * 搜索参数接口
 * @interface SearchParams
 */
export interface SearchParams {
  /** 搜索关键词 */
  query: string;
  /** 搜索字段 */
  fields?: string[];
  /** 筛选条件 */
  filters?: Record<string, any>;
  /** 排序配置 */
  sort?: SortConfig;
  /** 分页配置 */
  pagination?: Pick<Pagination, 'page' | 'pageSize'>;
}

// ===== 业务相关类型 =====

/** 告警级别 */
export type AlarmLevel = 'critical' | 'major' | 'minor' | 'warning' | 'info';

/** 工单状态 */
export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';

/** 资源状态 */
export type ResourceStatus = 'online' | 'offline' | 'maintenance' | 'error';

/** 
 * 告警信息接口
 * @interface Alarm
 */
export interface Alarm {
  /** 告警ID */
  id: ID;
  /** 告警标题 */
  title: string;
  /** 告警描述 */
  description: string;
  /** 告警级别 */
  level: AlarmLevel;
  /** 告警来源 */
  source: string;
  /** 告警对象 */
  target: string;
  /** 首次发生时间 */
  firstOccurredAt: Timestamp;
  /** 最后发生时间 */
  lastOccurredAt: Timestamp;
  /** 是否已确认 */
  acknowledged: boolean;
  /** 确认人 */
  acknowledgedBy?: string;
  /** 确认时间 */
  acknowledgedAt?: Timestamp;
}

/** 
 * 工单信息接口
 * @interface WorkOrder
 */
export interface WorkOrder {
  /** 工单ID */
  id: ID;
  /** 工单标题 */
  title: string;
  /** 工单描述 */
  description: string;
  /** 工单类型 */
  type: 'maintenance' | 'incident' | 'request' | 'change';
  /** 工单状态 */
  status: WorkOrderStatus;
  /** 优先级 */
  priority: 'low' | 'medium' | 'high' | 'urgent';
  /** 创建人 */
  createdBy: string;
  /** 分配给 */
  assignedTo?: string;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
  /** 预计完成时间 */
  dueAt?: Timestamp;
  /** 实际完成时间 */
  completedAt?: Timestamp;
}

/** 
 * 资源信息接口
 * @interface Resource
 */
export interface Resource {
  /** 资源ID */
  id: ID;
  /** 资源名称 */
  name: string;
  /** 资源类型 */
  type: '5GC' | 'cloud' | 'network' | 'server';
  /** 资源状态 */
  status: ResourceStatus;
  /** 资源位置 */
  location: string;
  /** IP地址 */
  ipAddress?: string;
  /** 资源属性 */
  properties: Record<string, any>;
  /** 创建时间 */
  createdAt: Timestamp;
  /** 更新时间 */
  updatedAt: Timestamp;
}

// ===== 工具类型 =====

/** 
 * 将接口中的所有属性变为可选
 * @template T 原始接口类型
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 
 * 将接口中的指定属性变为必需
 * @template T 原始接口类型
 * @template K 要变为必需的属性键
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** 
 * 从联合类型中排除指定类型
 * @template T 原始联合类型
 * @template U 要排除的类型
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/** 
 * 互斥类型 - 确保两个类型不能同时存在
 * @template T 类型A
 * @template U 类型B
 */
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

// ===== 常量类型 =====

/** HTTP状态码 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** 存储键名 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PROFILE: 'user_profile',
  APP_SETTINGS: 'app_settings',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
} as const;

/** 动画持续时间 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// ===== 类型导出 =====
export type { 
  // 重新导出所有类型以便统一管理
  ID as Identifier,
  Timestamp as UnixTimestamp,
  Status as AsyncStatus,
  ThemeMode as AppThemeMode,
  LanguageCode as SupportedLanguage,
};