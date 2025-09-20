/**
 * 类型定义统一导出入口
 * 
 * 本文件作为所有类型定义的统一入口，方便其他模块导入使用
 * 避免循环依赖，提供清晰的类型导出结构
 */

// ===== 通用类型导出 =====
export type {
  // 基础类型
  ID,
  Timestamp,
  Status,
  ThemeMode,
  LanguageCode,
  
  // 用户相关类型
  User,
  UserPreferences,
  
  // API响应类型
  ApiResponse,
  Pagination,
  PaginatedResponse,
  
  // 应用配置类型
  AppSettings,
  
  // 通知类型
  Notification,
  NotificationType,
  
  // 菜单类型
  MenuItem,
  
  // 设备信息类型
  DeviceInfo,
  
  // 错误类型
  AppError,
  
  // 数据状态管理类型
  DataState,
  
  // 搜索和筛选类型
  SortDirection,
  SortConfig,
  SearchParams,
  
  // 业务相关类型
  AlarmLevel,
  WorkOrderStatus,
  ResourceStatus,
  Alarm,
  WorkOrder,
  Resource,
  
  // 工具类型
  PartialBy,
  RequiredBy,
  Without,
  XOR,
  
  // 类型别名
  Identifier,
  UnixTimestamp,
  AsyncStatus,
  AppThemeMode,
  SupportedLanguage,
} from './common';

// ===== API类型导出 =====
export type {
  // 认证相关API类型
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  
  // 用户相关API类型
  UpdateUserProfileRequest,
  GetUsersRequest,
  
  // 告警相关API类型
  GetAlarmsRequest,
  AcknowledgeAlarmRequest,
  CreateAlarmRequest,
  
  // 工单相关API类型
  GetWorkOrdersRequest,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
  
  // 资源相关API类型
  GetResourcesRequest,
  CreateResourceRequest,
  UpdateResourceRequest,
  
  // 统计相关API类型
  DashboardStats,
  TimeSeriesDataPoint,
  TimeSeriesData,
  
  // 文件上传相关API类型
  FileUploadResponse,
  
  // API响应类型别名
  AuthApiResponse,
  UserApiResponse,
  AlarmApiResponse,
  WorkOrderApiResponse,
  ResourceApiResponse,
  PaginatedUsersResponse,
  PaginatedAlarmsResponse,
  PaginatedWorkOrdersResponse,
  PaginatedResourcesResponse,
  
  // API错误类型
  ApiError,
  ValidationError,
  
  // WebSocket相关类型
  WebSocketMessage,
  RealtimeAlarmMessage,
  RealtimeWorkOrderMessage,
  RealtimeResourceMessage,
  
  // 类型别名
  AuthLoginRequest,
  AuthRegisterRequest,
  UserListRequest,
  AlarmListRequest,
  WorkOrderListRequest,
  ResourceListRequest,
  AuthLoginResponse,
  DashboardData,
  UploadedFile,
  WSMessage,
  WSAlarmMessage,
  WSWorkOrderMessage,
  WSResourceMessage,
} from './api';

// ===== 导航类型导出 =====
export type {
  // 导航参数类型
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  HomeStackParamList,
  ResourceManagementStackParamList,
  FaultAlarmStackParamList,
  WorkOrderStackParamList,
  ProfileStackParamList,
  
  // 屏幕组件Props类型
  RootScreenProps,
  AuthScreenProps,
  MainTabScreenProps,
  HomeScreenProps,
  ResourceManagementScreenProps,
  FaultAlarmScreenProps,
  WorkOrderScreenProps,
  ProfileScreenProps,
  
  // 工具类型
  NavigationParams,
  
  // 路由名称类型
  RootRouteName,
  AuthRouteName,
  MainTabRouteName,
  HomeRouteName,
  ResourceManagementRouteName,
  FaultAlarmRouteName,
  WorkOrderRouteName,
  ProfileRouteName,
  AllRouteName,
  
  // 导航配置类型
  NavigationOptions,
  TabBarOptions,
  DeepLinkConfig,
  DeepLinkScreenConfig,
  NavigationState,
  NavigationRoute,
  
  // 类型别名
  RootProps,
  AuthProps,
  TabProps,
  HomeProps,
  ResourceProps,
  AlarmProps,
  WorkOrderProps,
  ProfileProps,
  RootParams,
  AuthParams,
  TabParams,
  RouteName,
  NavOptions,
  TabOptions,
} from './navigation';

// ===== 常量导出 =====
export {
  HTTP_STATUS,
  STORAGE_KEYS,
  ANIMATION_DURATION,
} from './common';

// ===== 类型守卫函数 =====

/**
 * 检查是否为有效的API响应
 * @param response - 待检查的响应对象
 * @returns 是否为有效的API响应
 */
export function isApiResponse<T = any>(response: any): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.success === 'boolean'
  );
}

/**
 * 检查是否为API错误响应
 * @param error - 待检查的错误对象
 * @returns 是否为API错误响应
 */
export function isApiError(error: any): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof error.message === 'string' &&
    typeof error.code === 'string' &&
    typeof error.status === 'number'
  );
}

/**
 * 检查是否为验证错误
 * @param error - 待检查的错误对象
 * @returns 是否为验证错误
 */
export function isValidationError(error: any): error is ValidationError {
  return (
    isApiError(error) &&
    typeof error.field === 'string' &&
    typeof error.rule === 'string'
  );
}

/**
 * 检查是否为分页响应
 * @param response - 待检查的响应对象
 * @returns 是否为分页响应
 */
export function isPaginatedResponse<T = any>(response: any): response is PaginatedResponse<T> {
  return (
    isApiResponse(response) &&
    typeof response.pagination === 'object' &&
    response.pagination !== null &&
    typeof response.pagination.page === 'number' &&
    typeof response.pagination.pageSize === 'number' &&
    typeof response.pagination.total === 'number'
  );
}

/**
 * 检查是否为WebSocket消息
 * @param message - 待检查的消息对象
 * @returns 是否为WebSocket消息
 */
export function isWebSocketMessage<T = any>(message: any): message is WebSocketMessage<T> {
  return (
    typeof message === 'object' &&
    message !== null &&
    typeof message.type === 'string' &&
    typeof message.timestamp === 'number'
  );
}

/**
 * 检查是否为用户对象
 * @param user - 待检查的用户对象
 * @returns 是否为用户对象
 */
export function isUser(user: any): user is User {
  return (
    typeof user === 'object' &&
    user !== null &&
    (typeof user.id === 'string' || typeof user.id === 'number') &&
    typeof user.email === 'string' &&
    typeof user.name === 'string' &&
    typeof user.createdAt === 'number' &&
    typeof user.updatedAt === 'number'
  );
}

/**
 * 检查是否为通知对象
 * @param notification - 待检查的通知对象
 * @returns 是否为通知对象
 */
export function isNotification(notification: any): notification is Notification {
  return (
    typeof notification === 'object' &&
    notification !== null &&
    typeof notification.id === 'string' &&
    typeof notification.title === 'string' &&
    typeof notification.message === 'string' &&
    ['info', 'success', 'warning', 'error'].includes(notification.type) &&
    typeof notification.createdAt === 'number'
  );
}

// ===== 类型转换工具函数 =====

/**
 * 将对象转换为用户对象（带类型检查）
 * @param data - 原始数据
 * @returns 用户对象或null
 */
export function toUser(data: any): User | null {
  if (!isUser(data)) {
    return null;
  }
  return data;
}

/**
 * 将对象转换为通知对象（带类型检查）
 * @param data - 原始数据
 * @returns 通知对象或null
 */
export function toNotification(data: any): Notification | null {
  if (!isNotification(data)) {
    return null;
  }
  return data;
}

/**
 * 安全地从API响应中提取数据
 * @param response - API响应
 * @returns 数据或null
 */
export function extractApiData<T>(response: any): T | null {
  if (!isApiResponse<T>(response) || !response.success) {
    return null;
  }
  return response.data || null;
}

/**
 * 安全地从分页响应中提取数据
 * @param response - 分页响应
 * @returns 数据和分页信息或null
 */
export function extractPaginatedData<T>(response: any): { data: T[]; pagination: Pagination } | null {
  if (!isPaginatedResponse<T>(response) || !response.success) {
    return null;
  }
  return {
    data: response.data || [],
    pagination: response.pagination,
  };
}

// ===== 默认值常量 =====

/** 默认分页配置 */
export const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

/** 默认搜索参数 */
export const DEFAULT_SEARCH_PARAMS: SearchParams = {
  query: '',
  pagination: {
    page: 1,
    pageSize: 20,
  },
};

/** 默认应用设置 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'auto',
  language: 'zh-CN',
  notifications: true,
  biometrics: false,
  analytics: true,
  autoUpdate: true,
  debugMode: false,
};

/** 默认用户偏好设置 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'zh-CN',
  notifications: {
    push: true,
    email: true,
    sms: false,
  },
  display: {
    density: 'comfortable',
    animations: true,
    reducedMotion: false,
  },
};
