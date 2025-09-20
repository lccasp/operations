/**
 * API 相关类型定义
 * 
 * 本文件定义了所有与API交互相关的类型和接口
 * 包括请求参数、响应数据、错误处理等
 */

import type { 
  ID, 
  Timestamp, 
  ApiResponse, 
  PaginatedResponse,
  User,
  Alarm,
  WorkOrder,
  Resource,
  SearchParams
} from './common';

// ===== 认证相关API类型 =====

/** 
 * 登录请求参数
 * @interface LoginRequest
 */
export interface LoginRequest {
  /** 用户邮箱 */
  email: string;
  /** 用户密码 */
  password: string;
  /** 记住登录状态 */
  rememberMe?: boolean;
  /** 设备信息 */
  deviceInfo?: {
    deviceId: string;
    platform: string;
    appVersion: string;
  };
}

/** 
 * 登录响应数据
 * @interface LoginResponse
 */
export interface LoginResponse {
  /** 用户信息 */
  user: User;
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 令牌过期时间 */
  expiresAt: Timestamp;
  /** 权限列表 */
  permissions: string[];
}

/** 
 * 注册请求参数
 * @interface RegisterRequest
 */
export interface RegisterRequest {
  /** 用户邮箱 */
  email: string;
  /** 用户密码 */
  password: string;
  /** 确认密码 */
  confirmPassword: string;
  /** 用户姓名 */
  name: string;
  /** 邀请码（可选） */
  inviteCode?: string;
}

/** 
 * 刷新令牌请求参数
 * @interface RefreshTokenRequest
 */
export interface RefreshTokenRequest {
  /** 刷新令牌 */
  refreshToken: string;
}

/** 
 * 重置密码请求参数
 * @interface ResetPasswordRequest
 */
export interface ResetPasswordRequest {
  /** 用户邮箱 */
  email: string;
}

/** 
 * 修改密码请求参数
 * @interface ChangePasswordRequest
 */
export interface ChangePasswordRequest {
  /** 当前密码 */
  currentPassword: string;
  /** 新密码 */
  newPassword: string;
  /** 确认新密码 */
  confirmNewPassword: string;
}

// ===== 用户相关API类型 =====

/** 
 * 更新用户资料请求参数
 * @interface UpdateUserProfileRequest
 */
export interface UpdateUserProfileRequest {
  /** 用户姓名 */
  name?: string;
  /** 用户头像 */
  avatar?: string;
  /** 用户角色 */
  role?: string;
  /** 其他用户属性 */
  [key: string]: any;
}

/** 
 * 用户列表查询参数
 * @interface GetUsersRequest
 */
export interface GetUsersRequest extends SearchParams {
  /** 用户状态筛选 */
  status?: 'active' | 'inactive' | 'suspended';
  /** 用户角色筛选 */
  role?: string;
  /** 创建时间范围 */
  createdAtRange?: [Timestamp, Timestamp];
}

// ===== 告警相关API类型 =====

/** 
 * 告警列表查询参数
 * @interface GetAlarmsRequest
 */
export interface GetAlarmsRequest extends SearchParams {
  /** 告警级别筛选 */
  level?: string[];
  /** 告警状态筛选 */
  acknowledged?: boolean;
  /** 时间范围筛选 */
  timeRange?: [Timestamp, Timestamp];
  /** 告警来源筛选 */
  source?: string;
}

/** 
 * 告警确认请求参数
 * @interface AcknowledgeAlarmRequest
 */
export interface AcknowledgeAlarmRequest {
  /** 告警ID列表 */
  alarmIds: ID[];
  /** 确认备注 */
  note?: string;
}

/** 
 * 创建告警请求参数
 * @interface CreateAlarmRequest
 */
export interface CreateAlarmRequest {
  /** 告警标题 */
  title: string;
  /** 告警描述 */
  description: string;
  /** 告警级别 */
  level: string;
  /** 告警来源 */
  source: string;
  /** 告警对象 */
  target: string;
  /** 附加属性 */
  properties?: Record<string, any>;
}

// ===== 工单相关API类型 =====

/** 
 * 工单列表查询参数
 * @interface GetWorkOrdersRequest
 */
export interface GetWorkOrdersRequest extends SearchParams {
  /** 工单状态筛选 */
  status?: string[];
  /** 工单类型筛选 */
  type?: string[];
  /** 优先级筛选 */
  priority?: string[];
  /** 分配人筛选 */
  assignedTo?: string;
  /** 创建人筛选 */
  createdBy?: string;
  /** 创建时间范围 */
  createdAtRange?: [Timestamp, Timestamp];
  /** 截止时间范围 */
  dueAtRange?: [Timestamp, Timestamp];
}

/** 
 * 创建工单请求参数
 * @interface CreateWorkOrderRequest
 */
export interface CreateWorkOrderRequest {
  /** 工单标题 */
  title: string;
  /** 工单描述 */
  description: string;
  /** 工单类型 */
  type: string;
  /** 优先级 */
  priority: string;
  /** 分配给 */
  assignedTo?: string;
  /** 截止时间 */
  dueAt?: Timestamp;
  /** 附件 */
  attachments?: string[];
}

/** 
 * 更新工单请求参数
 * @interface UpdateWorkOrderRequest
 */
export interface UpdateWorkOrderRequest {
  /** 工单标题 */
  title?: string;
  /** 工单描述 */
  description?: string;
  /** 工单状态 */
  status?: string;
  /** 优先级 */
  priority?: string;
  /** 分配给 */
  assignedTo?: string;
  /** 截止时间 */
  dueAt?: Timestamp;
  /** 处理备注 */
  note?: string;
}

// ===== 资源相关API类型 =====

/** 
 * 资源列表查询参数
 * @interface GetResourcesRequest
 */
export interface GetResourcesRequest extends SearchParams {
  /** 资源类型筛选 */
  type?: string[];
  /** 资源状态筛选 */
  status?: string[];
  /** 位置筛选 */
  location?: string;
  /** IP地址筛选 */
  ipAddress?: string;
}

/** 
 * 创建资源请求参数
 * @interface CreateResourceRequest
 */
export interface CreateResourceRequest {
  /** 资源名称 */
  name: string;
  /** 资源类型 */
  type: string;
  /** 资源位置 */
  location: string;
  /** IP地址 */
  ipAddress?: string;
  /** 资源属性 */
  properties: Record<string, any>;
}

/** 
 * 更新资源请求参数
 * @interface UpdateResourceRequest
 */
export interface UpdateResourceRequest {
  /** 资源名称 */
  name?: string;
  /** 资源状态 */
  status?: string;
  /** 资源位置 */
  location?: string;
  /** IP地址 */
  ipAddress?: string;
  /** 资源属性 */
  properties?: Record<string, any>;
}

// ===== 统计相关API类型 =====

/** 
 * 仪表板统计数据
 * @interface DashboardStats
 */
export interface DashboardStats {
  /** 告警统计 */
  alarms: {
    total: number;
    critical: number;
    major: number;
    minor: number;
    warning: number;
  };
  /** 工单统计 */
  workOrders: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  /** 资源统计 */
  resources: {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
    error: number;
  };
  /** 性能指标 */
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    networkLatency: number;
    uptime: number;
  };
}

/** 
 * 时间序列数据点
 * @interface TimeSeriesDataPoint
 */
export interface TimeSeriesDataPoint {
  /** 时间戳 */
  timestamp: Timestamp;
  /** 数值 */
  value: number;
  /** 标签 */
  label?: string;
}

/** 
 * 时间序列数据
 * @interface TimeSeriesData
 */
export interface TimeSeriesData {
  /** 数据名称 */
  name: string;
  /** 数据单位 */
  unit?: string;
  /** 数据点列表 */
  dataPoints: TimeSeriesDataPoint[];
}

// ===== 文件上传相关API类型 =====

/** 
 * 文件上传响应数据
 * @interface FileUploadResponse
 */
export interface FileUploadResponse {
  /** 文件ID */
  fileId: string;
  /** 文件名 */
  fileName: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** 文件类型 */
  mimeType: string;
  /** 文件URL */
  fileUrl: string;
  /** 上传时间 */
  uploadedAt: Timestamp;
}

// ===== 通用API响应类型别名 =====

/** 认证API响应类型 */
export type AuthApiResponse<T = any> = ApiResponse<T>;

/** 用户API响应类型 */
export type UserApiResponse<T = any> = ApiResponse<T>;

/** 告警API响应类型 */
export type AlarmApiResponse<T = any> = ApiResponse<T>;

/** 工单API响应类型 */
export type WorkOrderApiResponse<T = any> = ApiResponse<T>;

/** 资源API响应类型 */
export type ResourceApiResponse<T = any> = ApiResponse<T>;

/** 分页用户列表响应 */
export type PaginatedUsersResponse = PaginatedResponse<User>;

/** 分页告警列表响应 */
export type PaginatedAlarmsResponse = PaginatedResponse<Alarm>;

/** 分页工单列表响应 */
export type PaginatedWorkOrdersResponse = PaginatedResponse<WorkOrder>;

/** 分页资源列表响应 */
export type PaginatedResourcesResponse = PaginatedResponse<Resource>;

// ===== API错误类型 =====

/** 
 * API错误响应
 * @interface ApiError
 */
export interface ApiError {
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code: string;
  /** HTTP状态码 */
  status: number;
  /** 错误详情 */
  details?: Record<string, any>;
  /** 字段验证错误 */
  fieldErrors?: Record<string, string[]>;
  /** 请求追踪ID */
  traceId?: string;
  /** 错误时间戳 */
  timestamp: Timestamp;
}

/** 
 * 验证错误
 * @interface ValidationError
 */
export interface ValidationError extends ApiError {
  /** 验证失败的字段 */
  field: string;
  /** 验证规则 */
  rule: string;
  /** 传入的值 */
  value: any;
}

// ===== WebSocket 相关类型 =====

/** 
 * WebSocket消息基础接口
 * @interface WebSocketMessage
 */
export interface WebSocketMessage<T = any> {
  /** 消息类型 */
  type: string;
  /** 消息数据 */
  data: T;
  /** 消息ID */
  id?: string;
  /** 时间戳 */
  timestamp: Timestamp;
}

/** 
 * 实时告警消息
 * @interface RealtimeAlarmMessage
 */
export interface RealtimeAlarmMessage extends WebSocketMessage<Alarm> {
  type: 'alarm_created' | 'alarm_updated' | 'alarm_acknowledged';
}

/** 
 * 实时工单消息
 * @interface RealtimeWorkOrderMessage
 */
export interface RealtimeWorkOrderMessage extends WebSocketMessage<WorkOrder> {
  type: 'workorder_created' | 'workorder_updated' | 'workorder_assigned';
}

/** 
 * 实时资源状态消息
 * @interface RealtimeResourceMessage
 */
export interface RealtimeResourceMessage extends WebSocketMessage<Resource> {
  type: 'resource_status_changed' | 'resource_updated';
}

// ===== 导出类型别名 =====
export type {
  // API请求类型
  LoginRequest as AuthLoginRequest,
  RegisterRequest as AuthRegisterRequest,
  GetUsersRequest as UserListRequest,
  GetAlarmsRequest as AlarmListRequest,
  GetWorkOrdersRequest as WorkOrderListRequest,
  GetResourcesRequest as ResourceListRequest,
  
  // API响应类型
  LoginResponse as AuthLoginResponse,
  DashboardStats as DashboardData,
  FileUploadResponse as UploadedFile,
  
  // WebSocket类型
  WebSocketMessage as WSMessage,
  RealtimeAlarmMessage as WSAlarmMessage,
  RealtimeWorkOrderMessage as WSWorkOrderMessage,
  RealtimeResourceMessage as WSResourceMessage,
};
