/**
 * 应用常量定义
 * 
 * 本文件定义了应用中使用的所有常量，包括设备信息、API配置、
 * 业务常量、UI常量等，确保常量的统一管理和类型安全
 */

import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// ===== 设备信息常量 =====

/** 设备尺寸信息 */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

/** 设备基础信息 */
export const DEVICE = {
  // 屏幕尺寸
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    scale: Dimensions.get('window').scale,
    fontScale: Dimensions.get('window').fontScale,
  },
  
  // 窗口尺寸
  window: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  
  // 平台信息
  platform: {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
    version: Platform.Version,
  },
  
  // 设备类型判断
  type: {
    /** 是否为小屏设备 (< 375px) */
    get isSmallDevice() {
      return SCREEN_WIDTH < 375;
    },
    
    /** 是否为中等屏幕设备 (375px - 414px) */
    get isMediumDevice() {
      return SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
    },
    
    /** 是否为大屏设备 (>= 414px) */
    get isLargeDevice() {
      return SCREEN_WIDTH >= 414;
    },
    
    /** 是否为平板设备 (>= 768px) */
    get isTablet() {
      return SCREEN_WIDTH >= 768;
    },
    
    /** 是否为超大屏设备 (>= 1024px) */
    get isDesktop() {
      return SCREEN_WIDTH >= 1024;
    },
  },
  
  // iPhone 特定型号检测
  iphone: {
    /** iPhone SE (320px width) */
    get isSE() {
      return Platform.OS === 'ios' && SCREEN_WIDTH === 320;
    },
    
    /** iPhone X/XS (375px width, 812px height) */
    get isX() {
      return Platform.OS === 'ios' && SCREEN_WIDTH === 375 && SCREEN_HEIGHT === 812;
    },
    
    /** iPhone XR/11 (414px width, 896px height) */
    get isXR() {
      return Platform.OS === 'ios' && SCREEN_WIDTH === 414 && SCREEN_HEIGHT === 896;
    },
    
    /** iPhone XS Max/11 Pro Max (414px width, 896px height) */
    get isXSMax() {
      return Platform.OS === 'ios' && SCREEN_WIDTH === 414 && SCREEN_HEIGHT === 896;
    },
    
    /** iPhone 12/13 mini (375px width, 812px height) */
    get isMini() {
      return Platform.OS === 'ios' && SCREEN_WIDTH === 375 && SCREEN_HEIGHT === 812;
    },
    
    /** iPhone 12/13/14 (390px width, 844px height) */
    get isRegular() {
      return Platform.OS === 'ios' && SCREEN_WIDTH === 390 && SCREEN_HEIGHT === 844;
    },
    
    /** iPhone 12/13/14 Pro Max (428px width, 926px height) */
    get isProMax() {
      return Platform.OS === 'ios' && SCREEN_WIDTH === 428 && SCREEN_HEIGHT === 926;
    },
    
    /** 是否有刘海屏 (Face ID 设备) */
    get hasNotch() {
      return Platform.OS === 'ios' && SCREEN_HEIGHT >= 812;
    },
    
    /** 是否有动态岛 (iPhone 14 Pro 系列) */
    get hasDynamicIsland() {
      return Platform.OS === 'ios' && 
        ((SCREEN_WIDTH === 393 && SCREEN_HEIGHT === 852) || // iPhone 14 Pro
         (SCREEN_WIDTH === 430 && SCREEN_HEIGHT === 932));   // iPhone 14 Pro Max
    },
  },
  
  // 安全区域
  safeArea: {
    /** 顶部安全区域高度 */
    get top() {
      if (Platform.OS === 'ios') {
        if (SCREEN_HEIGHT >= 812) return 44; // Face ID 设备
        return 20; // 传统设备
      }
      return 0;
    },
    
    /** 底部安全区域高度 */
    get bottom() {
      if (Platform.OS === 'ios' && SCREEN_HEIGHT >= 812) {
        return 34; // Face ID 设备
      }
      return 0;
    },
  },
} as const;

// ===== API配置常量 =====

/** API相关配置 */
export const API = {
  /** 基础URL配置 */
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api'  // 开发环境
    : 'https://api.operateapp.com', // 生产环境
  
  /** 超时配置 (毫秒) */
  TIMEOUT: {
    DEFAULT: 10000,    // 默认超时 10秒
    UPLOAD: 30000,     // 文件上传超时 30秒
    DOWNLOAD: 60000,   // 文件下载超时 60秒
    WEBSOCKET: 5000,   // WebSocket连接超时 5秒
  },
  
  /** 重试配置 */
  RETRY: {
    MAX_ATTEMPTS: 3,   // 最大重试次数
    DELAY: 1000,       // 重试延迟 1秒
    BACKOFF: 2,        // 退避倍数
  },
  
  /** API版本 */
  VERSION: 'v1',
  
  /** 端点配置 */
  ENDPOINTS: {
    // 认证相关
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      RESET_PASSWORD: '/auth/reset-password',
      CHANGE_PASSWORD: '/auth/change-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    
    // 用户相关
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
      LIST: '/users',
      DELETE: '/user/delete',
      UPLOAD_AVATAR: '/user/avatar',
    },
    
    // 告警相关
    ALARM: {
      LIST: '/alarms',
      DETAIL: '/alarms/:id',
      CREATE: '/alarms',
      UPDATE: '/alarms/:id',
      DELETE: '/alarms/:id',
      ACKNOWLEDGE: '/alarms/acknowledge',
      RESOLVE: '/alarms/:id/resolve',
      STATISTICS: '/alarms/statistics',
      RULES: '/alarms/rules',
    },
    
    // 工单相关
    WORK_ORDER: {
      LIST: '/workorders',
      DETAIL: '/workorders/:id',
      CREATE: '/workorders',
      UPDATE: '/workorders/:id',
      DELETE: '/workorders/:id',
      ASSIGN: '/workorders/:id/assign',
      COMPLETE: '/workorders/:id/complete',
      STATISTICS: '/workorders/statistics',
    },
    
    // 资源相关
    RESOURCE: {
      LIST: '/resources',
      DETAIL: '/resources/:id',
      CREATE: '/resources',
      UPDATE: '/resources/:id',
      DELETE: '/resources/:id',
      TOPOLOGY: '/resources/:id/topology',
      PERFORMANCE: '/resources/:id/performance',
      STATISTICS: '/resources/statistics',
    },
    
    // 文件相关
    FILE: {
      UPLOAD: '/files/upload',
      DOWNLOAD: '/files/:id/download',
      DELETE: '/files/:id',
      INFO: '/files/:id/info',
    },
    
    // 通知相关
    NOTIFICATION: {
      LIST: '/notifications',
      READ: '/notifications/:id/read',
      DELETE: '/notifications/:id',
      SETTINGS: '/notifications/settings',
    },
    
    // 统计相关
    STATISTICS: {
      DASHBOARD: '/statistics/dashboard',
      TIME_SERIES: '/statistics/timeseries',
      HEALTH: '/statistics/health',
      PERFORMANCE: '/statistics/performance',
    },
  },
} as const;

// ===== 存储相关常量 =====

/** 存储键名常量 */
export const STORAGE_KEYS = {
  // 认证相关
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PROFILE: 'user_profile',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  
  // 应用设置
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  ANALYTICS_ENABLED: 'analytics_enabled',
  AUTO_UPDATE_ENABLED: 'auto_update_enabled',
  
  // 应用状态
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FIRST_LAUNCH: 'first_launch',
  APP_VERSION: 'app_version',
  LAST_UPDATE_CHECK: 'last_update_check',
  
  // 用户偏好
  USER_PREFERENCES: 'user_preferences',
  FAVORITE_RESOURCES: 'favorite_resources',
  RECENT_SEARCHES: 'recent_searches',
  
  // 缓存相关
  CACHE_PREFIX: 'cache_',
  API_CACHE_PREFIX: 'api_cache_',
  IMAGE_CACHE_PREFIX: 'image_cache_',
  
  // 临时数据
  TEMP_PREFIX: 'temp_',
  DRAFT_PREFIX: 'draft_',
} as const;

/** 缓存配置 */
export const CACHE = {
  /** 缓存过期时间 (毫秒) */
  EXPIRY: {
    SHORT: 5 * 60 * 1000,      // 5分钟
    MEDIUM: 30 * 60 * 1000,    // 30分钟
    LONG: 2 * 60 * 60 * 1000,  // 2小时
    DAY: 24 * 60 * 60 * 1000,  // 24小时
    WEEK: 7 * 24 * 60 * 60 * 1000, // 7天
  },
  
  /** 缓存大小限制 (字节) */
  SIZE_LIMIT: {
    SMALL: 1024 * 1024,        // 1MB
    MEDIUM: 5 * 1024 * 1024,   // 5MB
    LARGE: 10 * 1024 * 1024,   // 10MB
  },
} as const;

// ===== UI相关常量 =====

/** 动画持续时间 (毫秒) */
export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 800,
} as const;

/** 动画缓动函数 */
export const ANIMATION_EASING = {
  LINEAR: 'linear',
  EASE_IN: 'easeIn',
  EASE_OUT: 'easeOut',
  EASE_IN_OUT: 'easeInOut',
  SPRING: 'spring',
} as const;

/** 颜色常量 */
export const COLORS = {
  // 透明度
  TRANSPARENT: 'transparent',
  
  // 黑白色
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  
  // 灰色系
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // 系统色
  SYSTEM: {
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6',
  },
} as const;

/** 字体常量 */
export const FONTS = {
  // 字体族
  FAMILY: {
    SYSTEM: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    MONOSPACE: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  
  // 字体大小
  SIZE: {
    XS: 12,
    SM: 14,
    BASE: 16,
    LG: 18,
    XL: 20,
    '2XL': 24,
    '3XL': 30,
    '4XL': 36,
    '5XL': 48,
    '6XL': 60,
  },
  
  // 字体粗细
  WEIGHT: {
    THIN: '100',
    EXTRA_LIGHT: '200',
    LIGHT: '300',
    NORMAL: '400',
    MEDIUM: '500',
    SEMI_BOLD: '600',
    BOLD: '700',
    EXTRA_BOLD: '800',
    BLACK: '900',
  },
  
  // 行高
  LINE_HEIGHT: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75,
  },
} as const;

/** 间距常量 */
export const SPACING = {
  // 基础间距单位 (4px)
  BASE: 4,
  
  // 预定义间距
  XS: 4,   // 0.25rem
  SM: 8,   // 0.5rem
  MD: 16,  // 1rem
  LG: 24,  // 1.5rem
  XL: 32,  // 2rem
  '2XL': 48, // 3rem
  '3XL': 64, // 4rem
  '4XL': 80, // 5rem
  '5XL': 96, // 6rem
  
  // 组件特定间距
  COMPONENT: {
    BUTTON_PADDING_X: 16,
    BUTTON_PADDING_Y: 12,
    INPUT_PADDING_X: 12,
    INPUT_PADDING_Y: 16,
    CARD_PADDING: 16,
    SCREEN_PADDING: 20,
  },
} as const;

/** 边框半径常量 */
export const BORDER_RADIUS = {
  NONE: 0,
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  '2XL': 20,
  '3XL': 24,
  FULL: 9999,
  
  // 组件特定半径
  COMPONENT: {
    BUTTON: 8,
    INPUT: 8,
    CARD: 12,
    MODAL: 16,
    AVATAR: 9999,
  },
} as const;

/** 阴影常量 */
export const SHADOWS = {
  // 阴影级别
  NONE: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  SM: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  
  MD: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  LG: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  
  XL: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
} as const;

// ===== 业务相关常量 =====

/** 告警级别常量 */
export const ALARM_LEVELS = {
  CRITICAL: 'critical',
  MAJOR: 'major',
  MINOR: 'minor',
  WARNING: 'warning',
  INFO: 'info',
} as const;

/** 工单状态常量 */
export const WORK_ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue',
} as const;

/** 资源状态常量 */
export const RESOURCE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance',
  ERROR: 'error',
} as const;

/** 优先级常量 */
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// ===== 正则表达式常量 =====

/** 验证正则表达式 */
export const REGEX = {
  // 邮箱验证
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // 密码验证 (至少8位，包含大小写字母和数字)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  // 手机号验证 (中国大陆)
  PHONE: /^1[3-9]\d{9}$/,
  
  // IP地址验证
  IP_ADDRESS: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  
  // URL验证
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  
  // 中文字符验证
  CHINESE: /[\u4e00-\u9fa5]/,
  
  // 数字验证
  NUMBER: /^\d+$/,
  
  // 小数验证
  DECIMAL: /^\d+(\.\d+)?$/,
} as const;

// ===== 文件相关常量 =====

/** 文件类型常量 */
export const FILE_TYPES = {
  // 图片类型
  IMAGE: {
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    GIF: 'image/gif',
    WEBP: 'image/webp',
    SVG: 'image/svg+xml',
  },
  
  // 文档类型
  DOCUMENT: {
    PDF: 'application/pdf',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PPT: 'application/vnd.ms-powerpoint',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  },
  
  // 压缩文件
  ARCHIVE: {
    ZIP: 'application/zip',
    RAR: 'application/x-rar-compressed',
    TAR: 'application/x-tar',
    GZ: 'application/gzip',
  },
  
  // 文本类型
  TEXT: {
    PLAIN: 'text/plain',
    CSV: 'text/csv',
    JSON: 'application/json',
    XML: 'application/xml',
  },
} as const;

/** 文件大小限制 (字节) */
export const FILE_SIZE_LIMITS = {
  AVATAR: 2 * 1024 * 1024,      // 2MB
  DOCUMENT: 10 * 1024 * 1024,   // 10MB
  IMAGE: 5 * 1024 * 1024,       // 5MB
  VIDEO: 50 * 1024 * 1024,      // 50MB
  GENERAL: 20 * 1024 * 1024,    // 20MB
} as const;

// ===== 时间相关常量 =====

/** 时间常量 (毫秒) */
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

/** 日期格式常量 */
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY_DATE: 'MM月DD日',
  DISPLAY_DATETIME: 'MM月DD日 HH:mm',
  RELATIVE: 'relative', // 相对时间显示
} as const;

// ===== 网络相关常量 =====

/** HTTP状态码常量 */
export const HTTP_STATUS = {
  // 成功状态码
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // 客户端错误
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // 服务器错误
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/** WebSocket事件常量 */
export const WEBSOCKET_EVENTS = {
  // 连接事件
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  RECONNECT: 'reconnect',
  
  // 业务事件
  ALARM_CREATED: 'alarm_created',
  ALARM_UPDATED: 'alarm_updated',
  ALARM_ACKNOWLEDGED: 'alarm_acknowledged',
  WORK_ORDER_CREATED: 'workorder_created',
  WORK_ORDER_UPDATED: 'workorder_updated',
  WORK_ORDER_ASSIGNED: 'workorder_assigned',
  RESOURCE_STATUS_CHANGED: 'resource_status_changed',
  RESOURCE_UPDATED: 'resource_updated',
} as const;

// ===== 应用配置常量 =====

/** 应用信息常量 */
export const APP_INFO = {
  NAME: 'OperateApp',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  BUNDLE_ID: 'com.operateapp.mobile',
  
  // 应用商店信息
  APP_STORE_ID: '123456789',
  PLAY_STORE_ID: 'com.operateapp.mobile',
  
  // 支持信息
  SUPPORT_EMAIL: 'support@operateapp.com',
  PRIVACY_POLICY_URL: 'https://operateapp.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://operateapp.com/terms',
  
  // 社交媒体
  WEBSITE_URL: 'https://operateapp.com',
  GITHUB_URL: 'https://github.com/operateapp',
} as const;

/** 功能开关常量 */
export const FEATURE_FLAGS = {
  // 开发功能
  ENABLE_DEBUG_MODE: __DEV__,
  ENABLE_PERFORMANCE_MONITOR: __DEV__,
  ENABLE_NETWORK_LOGGER: __DEV__,
  
  // 实验性功能
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: !__DEV__,
  ENABLE_CRASH_REPORTING: !__DEV__,
  
  // 业务功能
  ENABLE_DARK_MODE: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_AUTO_UPDATE: true,
  ENABLE_FEEDBACK: true,
} as const;

// ===== 导出所有常量 =====
export default {
  DEVICE,
  API,
  STORAGE_KEYS,
  CACHE,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ALARM_LEVELS,
  WORK_ORDER_STATUS,
  RESOURCE_STATUS,
  PRIORITY,
  REGEX,
  FILE_TYPES,
  FILE_SIZE_LIMITS,
  TIME,
  DATE_FORMATS,
  HTTP_STATUS,
  WEBSOCKET_EVENTS,
  APP_INFO,
  FEATURE_FLAGS,
} as const;