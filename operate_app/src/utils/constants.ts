/**
 * 应用常量定义
 */

import { Dimensions, Platform } from 'react-native';

// 设备信息
export const DEVICE = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  scale: Dimensions.get('window').scale,
  fontScale: Dimensions.get('window').fontScale,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  
  // 设备尺寸分类
  get isSmallDevice() {
    return this.width < 375;
  },
  
  get isMediumDevice() {
    return this.width >= 375 && this.width < 414;
  },
  
  get isLargeDevice() {
    return this.width >= 414;
  },
  
  get isTablet() {
    return this.width >= 768;
  },
  
  // iPhone 型号检测
  get isIPhoneSE() {
    return this.isIOS && this.width === 320;
  },
  
  get isIPhoneX() {
    return this.isIOS && this.width === 375 && this.height === 812;
  },
  
  get isIPhoneXR() {
    return this.isIOS && this.width === 414 && this.height === 896;
  },
  
  get isIPhoneXSMax() {
    return this.isIOS && this.width === 414 && this.height === 896;
  },
  
  get hasNotch() {
    return this.isIOS && this.height >= 812;
  },
};

// API 配置
export const API = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.operateapp.com',
  TIMEOUT: 10000,
  
  // 接口版本
  VERSION: 'v1',
  
  // 重试配置
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // 分页配置
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// 应用配置
export const APP = {
  NAME: 'OperateApp',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  
  // 支持的语言
  SUPPORTED_LANGUAGES: [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'en-US', name: 'English' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'ko-KR', name: '한국어' },
  ],
  
  // 默认设置
  DEFAULT_SETTINGS: {
    theme: 'auto' as const,
    language: 'zh-CN',
    notifications: true,
    biometrics: false,
    analytics: true,
  },
  
  // 应用链接
  LINKS: {
    APP_STORE: 'https://apps.apple.com/app/operateapp',
    GOOGLE_PLAY: 'https://play.google.com/store/apps/details?id=com.operateapp',
    WEBSITE: 'https://operateapp.com',
    PRIVACY_POLICY: 'https://operateapp.com/privacy',
    TERMS_OF_SERVICE: 'https://operateapp.com/terms',
    SUPPORT: 'https://operateapp.com/support',
  },
} as const;

// 缓存配置
export const CACHE = {
  // 缓存时长（毫秒）
  DURATIONS: {
    SHORT: 5 * 60 * 1000,      // 5分钟
    MEDIUM: 30 * 60 * 1000,    // 30分钟
    LONG: 2 * 60 * 60 * 1000,  // 2小时
    VERY_LONG: 24 * 60 * 60 * 1000, // 24小时
  },
  
  // 缓存键前缀
  KEYS: {
    USER_PROFILE: 'user_profile',
    APP_CONFIG: 'app_config',
    API_DATA: 'api_data',
    IMAGES: 'images',
  },
} as const;

// 动画配置
export const ANIMATION = {
  // 标准动画时长
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // 弹性动画配置
  SPRING: {
    damping: 20,
    stiffness: 300,
    mass: 1,
  },
  
  // 缓动函数
  EASING: {
    EASE_OUT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    EASE_IN: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    EASE_IN_OUT: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  },
} as const;

// 表单验证规则
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 20,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  
  // 错误消息
  MESSAGES: {
    REQUIRED: '此字段为必填项',
    EMAIL_INVALID: '请输入有效的邮箱地址',
    PHONE_INVALID: '请输入有效的手机号码',
    PASSWORD_WEAK: '密码至少包含6位字符，包括大小写字母和数字',
    PASSWORD_MISMATCH: '两次输入的密码不一致',
    USERNAME_INVALID: '用户名只能包含字母、数字、下划线和短横线',
  },
} as const;

// 网络状态
export const NETWORK = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // 错误代码
  ERROR_CODES: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',
    SERVER_ERROR: 'SERVER_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
  },
} as const;

// 存储配置
export const STORAGE = {
  // 存储限制
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  
  // 清理策略
  CLEANUP_THRESHOLD: 0.8, // 80% 使用率时开始清理
  CLEANUP_PERCENTAGE: 0.3, // 清理30%的旧数据
} as const;

// 安全配置
export const SECURITY = {
  // 生物识别
  BIOMETRICS: {
    REASON: '使用生物识别快速登录',
    FALLBACK_TITLE: '使用密码登录',
    CANCEL_TITLE: '取消',
  },
  
  // 会话管理
  SESSION: {
    TIMEOUT: 30 * 60 * 1000, // 30分钟
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5分钟前刷新
  },
  
  // 密码策略
  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
    MAX_AGE_DAYS: 90,
  },
} as const;

// 推送通知
export const NOTIFICATIONS = {
  // 类型
  TYPES: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
  },
  
  // 默认显示时长
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000,
  },
  
  // 权限请求
  PERMISSION_REQUEST: {
    title: '开启通知',
    message: '允许应用发送通知，及时获取重要信息',
    buttonPositive: '允许',
    buttonNegative: '拒绝',
  },
} as const;

// 调试配置
export const DEBUG = {
  ENABLED: __DEV__,
  
  // 日志级别
  LOG_LEVEL: __DEV__ ? 'debug' : 'error',
  
  // 性能监控
  PERFORMANCE: {
    ENABLED: __DEV__,
    SAMPLE_RATE: 0.1, // 10% 采样率
  },
  
  // 网络日志
  NETWORK_LOGGING: __DEV__,
  
  // Redux 调试
  REDUX_LOGGING: __DEV__,
} as const;

// 功能开关（Feature Flags）
export const FEATURES = {
  // 实验性功能
  EXPERIMENTAL_UI: __DEV__,
  BETA_FEATURES: false,
  
  // 第三方集成
  ANALYTICS: !__DEV__,
  CRASH_REPORTING: !__DEV__,
  PERFORMANCE_MONITORING: !__DEV__,
  
  // 业务功能
  SOCIAL_LOGIN: true,
  BIOMETRIC_LOGIN: true,
  DARK_MODE: true,
  OFFLINE_MODE: true,
} as const;

// 错误消息映射
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后再试',
  UNAUTHORIZED: '认证失败，请重新登录',
  FORBIDDEN: '权限不足',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据有误',
  UNKNOWN_ERROR: '未知错误，请稍后再试',
} as const;

// 正则表达式集合
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_CN: /^1[3-9]\d{9}$/,
  PHONE_INTL: /^\+?[1-9]\d{1,14}$/,
  URL: /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  IPV6: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  CREDIT_CARD: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
  CHINESE_ID: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
} as const;
