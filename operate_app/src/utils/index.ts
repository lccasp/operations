/**
 * 工具函数统一导出入口
 * 
 * 本文件作为所有工具函数的统一入口，提供清晰的导出结构
 * 方便其他模块导入使用，避免深层路径依赖
 */

// ===== 存储工具导出 =====
export {
  appStorage,
  secureStorage,
  StorageUtils,
  StorageKeys,
} from './storage';

export type { StorageInterface } from './storage';

// ===== 常量导出 =====
export {
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
  default as Constants,
} from './constants';

// ===== 工具函数导出 =====
export {
  // 字符串处理
  capitalize,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  truncate,
  stripHtml,
  generateRandomString,
  generateUUID,
  
  // 数字处理
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  clamp,
  randomBetween,
  
  // 时间处理
  formatTimestamp,
  formatRelativeTime,
  getTimeRangeDescription,
  isToday,
  isThisWeek,
  
  // 数据验证
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidIP,
  isValidURL,
  isValidFileType,
  isValidFileSize,
  
  // 数组处理
  uniqueArray,
  groupBy,
  chunkArray,
  sortArray,
  searchArray,
  
  // 对象处理
  deepClone,
  deepMerge,
  getNestedValue,
  setNestedValue,
  
  // 平台相关
  openURL,
  makePhoneCall,
  sendEmail,
  shareContent,
  copyToClipboard,
  getClipboardText,
  checkNetworkConnection,
  
  // 调试工具
  safeJsonParse,
  safeJsonStringify,
  devLog,
  devWarn,
  devError,
  createTimer,
  
  // 默认导出
  default as Helpers,
} from './helpers';

// ===== 错误处理导出 =====
export {
  ErrorHandler,
  ErrorClassifier,
  ErrorMessageGenerator,
  ErrorReporter,
  ErrorRecovery,
  createErrorBoundaryHandler,
  withErrorHandling,
  setupGlobalErrorHandler,
  handleApiError,
  handleValidationError,
  handleNetworkError,
  safeExecute,
  default as ErrorHandling,
} from './errorHandler';

export type {
  ErrorLevel,
  ErrorCategory,
  ErrorContext,
  ErrorHandlerOptions,
} from './errorHandler';

// ===== 便捷导入别名 =====

/** 存储相关工具 */
export const Storage = {
  app: appStorage,
  secure: secureStorage,
  utils: StorageUtils,
  keys: StorageKeys,
};

/** 验证相关工具 */
export const Validation = {
  email: isValidEmail,
  password: isValidPassword,
  phone: isValidPhone,
  ip: isValidIP,
  url: isValidURL,
  fileType: isValidFileType,
  fileSize: isValidFileSize,
};

/** 格式化相关工具 */
export const Format = {
  number: formatNumber,
  currency: formatCurrency,
  percentage: formatPercentage,
  fileSize: formatFileSize,
  timestamp: formatTimestamp,
  relativeTime: formatRelativeTime,
};

/** 数组处理工具 */
export const Array = {
  unique: uniqueArray,
  groupBy,
  chunk: chunkArray,
  sort: sortArray,
  search: searchArray,
};

/** 对象处理工具 */
export const Object = {
  deepClone,
  deepMerge,
  getNestedValue,
  setNestedValue,
};

/** 平台功能工具 */
export const Platform = {
  openURL,
  makePhoneCall,
  sendEmail,
  shareContent,
  copyToClipboard,
  getClipboardText,
  checkNetworkConnection,
};

/** 调试工具 */
export const Debug = {
  log: devLog,
  warn: devWarn,
  error: devError,
  timer: createTimer,
  safeJsonParse,
  safeJsonStringify,
};

/** 错误处理工具 */
export const Error = {
  handle: ErrorHandler.handle,
  handleApi: handleApiError,
  handleValidation: handleValidationError,
  handleNetwork: handleNetworkError,
  safeExecute,
  setupGlobal: setupGlobalErrorHandler,
};

// ===== 工具函数组合 =====

/**
 * 安全的异步操作执行器
 * 结合错误处理和重试机制
 * 
 * @param operation - 要执行的异步操作
 * @param options - 配置选项
 * @returns 操作结果
 */
export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    fallback?: T;
    onError?: (error: any) => void;
  } = {}
): Promise<T | null> {
  const { retries = 3, delay = 1000, fallback, onError } = options;
  
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      onError?.(error);
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  // 记录最终失败的错误
  devError('[safeAsyncOperation] Operation failed after all retries:', lastError);
  
  return fallback ?? null;
}

/**
 * 防抖函数
 * 
 * @param func - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * 节流函数
 * 
 * @param func - 要节流的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * 创建可取消的Promise
 * 
 * @param promise - 原始Promise
 * @returns 可取消的Promise和取消函数
 */
export function createCancellablePromise<T>(
  promise: Promise<T>
): { promise: Promise<T>; cancel: () => void } {
  let cancelled = false;
  
  const cancellablePromise = new Promise<T>((resolve, reject) => {
    promise
      .then(value => {
        if (!cancelled) {
          resolve(value);
        }
      })
      .catch(error => {
        if (!cancelled) {
          reject(error);
        }
      });
  });
  
  return {
    promise: cancellablePromise,
    cancel: () => {
      cancelled = true;
    },
  };
}

/**
 * 批量处理数据
 * 
 * @param items - 要处理的数据项
 * @param processor - 处理函数
 * @param batchSize - 批次大小
 * @param delay - 批次间延迟（毫秒）
 * @returns 处理结果
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10,
  delay: number = 100
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(processor);
    
    try {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    } catch (error) {
      devError(`[batchProcess] Batch ${Math.floor(i / batchSize) + 1} failed:`, error);
      throw error;
    }
    
    // 批次间延迟
    if (i + batchSize < items.length && delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
}

/**
 * 创建简单的状态机
 * 
 * @param initialState - 初始状态
 * @param transitions - 状态转换配置
 * @returns 状态机实例
 */
export function createStateMachine<T extends string>(
  initialState: T,
  transitions: Record<T, T[]>
) {
  let currentState = initialState;
  const listeners: Array<(state: T) => void> = [];
  
  return {
    /** 获取当前状态 */
    getState: () => currentState,
    
    /** 转换到新状态 */
    transition: (newState: T) => {
      const allowedTransitions = transitions[currentState] || [];
      
      if (allowedTransitions.includes(newState)) {
        currentState = newState;
        listeners.forEach(listener => listener(currentState));
        return true;
      }
      
      devWarn(`[StateMachine] Invalid transition from ${currentState} to ${newState}`);
      return false;
    },
    
    /** 添加状态变化监听器 */
    onStateChange: (listener: (state: T) => void) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    
    /** 检查是否可以转换到指定状态 */
    canTransition: (newState: T) => {
      const allowedTransitions = transitions[currentState] || [];
      return allowedTransitions.includes(newState);
    },
  };
}

/**
 * 创建事件发射器
 * 
 * @returns 事件发射器实例
 */
export function createEventEmitter<T extends Record<string, any>>() {
  const listeners: { [K in keyof T]?: Array<(data: T[K]) => void> } = {};
  
  return {
    /** 监听事件 */
    on<K extends keyof T>(event: K, listener: (data: T[K]) => void) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event]!.push(listener);
      
      // 返回取消监听的函数
      return () => {
        const eventListeners = listeners[event];
        if (eventListeners) {
          const index = eventListeners.indexOf(listener);
          if (index > -1) {
            eventListeners.splice(index, 1);
          }
        }
      };
    },
    
    /** 发射事件 */
    emit<K extends keyof T>(event: K, data: T[K]) {
      const eventListeners = listeners[event];
      if (eventListeners) {
        eventListeners.forEach(listener => {
          try {
            listener(data);
          } catch (error) {
            devError(`[EventEmitter] Error in listener for event ${String(event)}:`, error);
          }
        });
      }
    },
    
    /** 移除所有监听器 */
    removeAllListeners<K extends keyof T>(event?: K) {
      if (event) {
        delete listeners[event];
      } else {
        Object.keys(listeners).forEach(key => {
          delete listeners[key as keyof T];
        });
      }
    },
  };
}

// ===== 默认导出 =====
export default {
  // 分类工具
  Storage,
  Validation,
  Format,
  Array,
  Object,
  Platform,
  Debug,
  Error,
  
  // 组合工具
  safeAsyncOperation,
  debounce,
  throttle,
  createCancellablePromise,
  batchProcess,
  createStateMachine,
  createEventEmitter,
  
  // 常量
  Constants,
  
  // 核心工具
  Helpers,
  ErrorHandling,
};
