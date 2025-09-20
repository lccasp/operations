/**
 * 统一错误处理系统
 * 
 * 本文件提供了应用的统一错误处理机制，包括错误分类、错误报告、
 * 错误恢复、用户友好的错误提示等功能
 */

import { Alert } from 'react-native';
import type { AppError, ApiError, ValidationError } from '../types';
import { HTTP_STATUS } from './constants';
import { devError, safeJsonStringify } from './helpers';

// ===== 错误类型定义 =====

/** 错误级别 */
export type ErrorLevel = 'low' | 'medium' | 'high' | 'critical';

/** 错误类别 */
export type ErrorCategory = 
  | 'network'      // 网络错误
  | 'validation'   // 验证错误
  | 'authentication' // 认证错误
  | 'authorization'  // 授权错误
  | 'business'     // 业务逻辑错误
  | 'system'       // 系统错误
  | 'unknown';     // 未知错误

/** 错误上下文信息 */
export interface ErrorContext {
  /** 用户ID */
  userId?: string;
  /** 操作名称 */
  action?: string;
  /** 页面路由 */
  route?: string;
  /** 额外数据 */
  extra?: Record<string, any>;
  /** 时间戳 */
  timestamp: number;
}

/** 错误处理选项 */
export interface ErrorHandlerOptions {
  /** 是否显示用户提示 */
  showAlert?: boolean;
  /** 是否记录错误日志 */
  logError?: boolean;
  /** 是否上报错误 */
  reportError?: boolean;
  /** 自定义错误消息 */
  customMessage?: string;
  /** 错误级别 */
  level?: ErrorLevel;
  /** 错误类别 */
  category?: ErrorCategory;
  /** 错误上下文 */
  context?: Partial<ErrorContext>;
}

// ===== 错误分类器 =====

/**
 * 错误分类器类
 */
export class ErrorClassifier {
  /**
   * 分类API错误
   * @param error - 错误对象
   * @returns 错误类别和级别
   */
  static classifyApiError(error: any): { category: ErrorCategory; level: ErrorLevel } {
    const status = error?.response?.status || error?.status;
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return { category: 'authentication', level: 'medium' };
      
      case HTTP_STATUS.FORBIDDEN:
        return { category: 'authorization', level: 'medium' };
      
      case HTTP_STATUS.BAD_REQUEST:
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return { category: 'validation', level: 'low' };
      
      case HTTP_STATUS.NOT_FOUND:
        return { category: 'business', level: 'low' };
      
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return { category: 'network', level: 'medium' };
      
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        return { category: 'system', level: 'high' };
      
      default:
        if (status >= 400 && status < 500) {
          return { category: 'business', level: 'medium' };
        } else if (status >= 500) {
          return { category: 'system', level: 'high' };
        } else {
          return { category: 'network', level: 'medium' };
        }
    }
  }
  
  /**
   * 分类网络错误
   * @param error - 错误对象
   * @returns 错误类别和级别
   */
  static classifyNetworkError(error: any): { category: ErrorCategory; level: ErrorLevel } {
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('timeout')) {
      return { category: 'network', level: 'medium' };
    } else if (message.includes('abort')) {
      return { category: 'business', level: 'low' };
    } else {
      return { category: 'unknown', level: 'medium' };
    }
  }
  
  /**
   * 分类JavaScript错误
   * @param error - 错误对象
   * @returns 错误类别和级别
   */
  static classifyJavaScriptError(error: Error): { category: ErrorCategory; level: ErrorLevel } {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('permission') || message.includes('unauthorized')) {
      return { category: 'authorization', level: 'medium' };
    } else if (message.includes('validation') || message.includes('invalid')) {
      return { category: 'validation', level: 'low' };
    } else if (message.includes('memory') || message.includes('stack')) {
      return { category: 'system', level: 'high' };
    } else {
      return { category: 'unknown', level: 'medium' };
    }
  }
}

// ===== 错误消息生成器 =====

/**
 * 错误消息生成器类
 */
export class ErrorMessageGenerator {
  /**
   * 生成用户友好的错误消息
   * @param error - 错误对象
   * @param category - 错误类别
   * @returns 用户友好的错误消息
   */
  static generateUserMessage(error: any, category: ErrorCategory): string {
    // 如果有自定义消息，优先使用
    if (error?.userMessage) {
      return error.userMessage;
    }
    
    // 根据错误类别生成消息
    switch (category) {
      case 'network':
        return '网络连接异常，请检查网络设置后重试';
      
      case 'authentication':
        return '登录已过期，请重新登录';
      
      case 'authorization':
        return '您没有权限执行此操作';
      
      case 'validation':
        return this.generateValidationMessage(error);
      
      case 'business':
        return error?.message || '操作失败，请稍后重试';
      
      case 'system':
        return '系统繁忙，请稍后重试';
      
      default:
        return '操作失败，请稍后重试';
    }
  }
  
  /**
   * 生成验证错误消息
   * @param error - 验证错误对象
   * @returns 验证错误消息
   */
  static generateValidationMessage(error: any): string {
    if (error?.fieldErrors) {
      const firstField = Object.keys(error.fieldErrors)[0];
      const firstError = error.fieldErrors[firstField]?.[0];
      return firstError || '输入数据格式不正确';
    }
    
    if (error?.field && error?.rule) {
      return this.getValidationRuleMessage(error.field, error.rule);
    }
    
    return error?.message || '输入数据格式不正确';
  }
  
  /**
   * 获取验证规则对应的消息
   * @param field - 字段名
   * @param rule - 验证规则
   * @returns 验证消息
   */
  static getValidationRuleMessage(field: string, rule: string): string {
    const fieldMap: Record<string, string> = {
      email: '邮箱',
      password: '密码',
      name: '姓名',
      phone: '手机号',
    };
    
    const ruleMap: Record<string, string> = {
      required: '不能为空',
      email: '格式不正确',
      min: '长度不足',
      max: '长度超限',
      pattern: '格式不正确',
    };
    
    const fieldName = fieldMap[field] || field;
    const ruleName = ruleMap[rule] || '格式不正确';
    
    return `${fieldName}${ruleName}`;
  }
}

// ===== 错误报告器 =====

/**
 * 错误报告器类
 */
export class ErrorReporter {
  private static errorQueue: AppError[] = [];
  private static isReporting = false;
  
  /**
   * 记录错误到本地
   * @param error - 错误对象
   * @param context - 错误上下文
   */
  static logError(error: any, context?: ErrorContext): void {
    const appError: AppError = {
      message: error?.message || 'Unknown error',
      code: error?.code || error?.status?.toString(),
      details: {
        stack: error?.stack,
        response: error?.response?.data,
        request: error?.config,
        originalError: safeJsonStringify(error),
      },
      timestamp: Date.now(),
      context: context || {},
    };
    
    // 开发环境直接输出到控制台
    if (__DEV__) {
      devError('Error logged:', appError);
    }
    
    // 存储到本地队列
    this.errorQueue.push(appError);
    
    // 限制队列大小
    if (this.errorQueue.length > 100) {
      this.errorQueue = this.errorQueue.slice(-50);
    }
  }
  
  /**
   * 上报错误到服务器
   * @param error - 错误对象
   * @param context - 错误上下文
   */
  static async reportError(error: any, context?: ErrorContext): Promise<void> {
    if (!__DEV__ && !this.isReporting) {
      try {
        this.isReporting = true;
        
        const appError: AppError = {
          message: error?.message || 'Unknown error',
          code: error?.code || error?.status?.toString(),
          details: {
            userAgent: 'React Native',
            platform: require('react-native').Platform.OS,
            version: require('react-native').Platform.Version,
          },
          timestamp: Date.now(),
          context: context || {},
        };
        
        // 这里应该调用错误上报API
        // await reportErrorAPI(appError);
        
        console.log('[ErrorReporter] Error reported:', appError.message);
      } catch (reportError) {
        devError('Failed to report error:', reportError);
      } finally {
        this.isReporting = false;
      }
    }
  }
  
  /**
   * 获取本地错误日志
   * @returns 错误日志列表
   */
  static getErrorLogs(): AppError[] {
    return [...this.errorQueue];
  }
  
  /**
   * 清空本地错误日志
   */
  static clearErrorLogs(): void {
    this.errorQueue = [];
  }
}

// ===== 错误恢复器 =====

/**
 * 错误恢复器类
 */
export class ErrorRecovery {
  /**
   * 尝试从网络错误中恢复
   * @param error - 网络错误
   * @param retryFn - 重试函数
   * @param maxRetries - 最大重试次数
   * @returns 恢复结果
   */
  static async recoverFromNetworkError(
    error: any,
    retryFn: () => Promise<any>,
    maxRetries: number = 3
  ): Promise<any> {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        await this.delay(Math.pow(2, attempts) * 1000); // 指数退避
        return await retryFn();
      } catch (retryError) {
        attempts++;
        if (attempts >= maxRetries) {
          throw retryError;
        }
      }
    }
  }
  
  /**
   * 尝试从认证错误中恢复
   * @param error - 认证错误
   * @param refreshTokenFn - 刷新令牌函数
   * @param retryFn - 重试函数
   * @returns 恢复结果
   */
  static async recoverFromAuthError(
    error: any,
    refreshTokenFn: () => Promise<void>,
    retryFn: () => Promise<any>
  ): Promise<any> {
    try {
      await refreshTokenFn();
      return await retryFn();
    } catch (refreshError) {
      // 刷新失败，需要重新登录
      throw new Error('AUTHENTICATION_REQUIRED');
    }
  }
  
  /**
   * 延迟函数
   * @param ms - 延迟毫秒数
   * @returns Promise
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===== 主错误处理器 =====

/**
 * 主错误处理器类
 */
export class ErrorHandler {
  /**
   * 处理错误
   * @param error - 错误对象
   * @param options - 处理选项
   */
  static handle(error: any, options: ErrorHandlerOptions = {}): void {
    const {
      showAlert = true,
      logError = true,
      reportError = !__DEV__,
      customMessage,
      level,
      category,
      context = {},
    } = options;
    
    // 确定错误类别和级别
    const { category: errorCategory, level: errorLevel } = 
      category && level 
        ? { category, level }
        : this.classifyError(error);
    
    // 生成用户消息
    const userMessage = customMessage || 
      ErrorMessageGenerator.generateUserMessage(error, errorCategory);
    
    // 创建错误上下文
    const errorContext: ErrorContext = {
      ...context,
      timestamp: Date.now(),
    };
    
    // 记录错误日志
    if (logError) {
      ErrorReporter.logError(error, errorContext);
    }
    
    // 上报错误
    if (reportError && errorLevel !== 'low') {
      ErrorReporter.reportError(error, errorContext);
    }
    
    // 显示用户提示
    if (showAlert && errorLevel !== 'low') {
      this.showErrorAlert(userMessage, errorCategory);
    }
  }
  
  /**
   * 分类错误
   * @param error - 错误对象
   * @returns 错误类别和级别
   */
  private static classifyError(error: any): { category: ErrorCategory; level: ErrorLevel } {
    if (error?.response || error?.status) {
      return ErrorClassifier.classifyApiError(error);
    } else if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
      return ErrorClassifier.classifyNetworkError(error);
    } else if (error instanceof Error) {
      return ErrorClassifier.classifyJavaScriptError(error);
    } else {
      return { category: 'unknown', level: 'medium' };
    }
  }
  
  /**
   * 显示错误提示
   * @param message - 错误消息
   * @param category - 错误类别
   */
  private static showErrorAlert(message: string, category: ErrorCategory): void {
    const title = this.getAlertTitle(category);
    
    Alert.alert(
      title,
      message,
      [
        { text: '确定', style: 'default' },
      ],
      { cancelable: true }
    );
  }
  
  /**
   * 获取提示框标题
   * @param category - 错误类别
   * @returns 提示框标题
   */
  private static getAlertTitle(category: ErrorCategory): string {
    switch (category) {
      case 'network':
        return '网络错误';
      case 'authentication':
        return '登录过期';
      case 'authorization':
        return '权限不足';
      case 'validation':
        return '输入错误';
      case 'business':
        return '操作失败';
      case 'system':
        return '系统错误';
      default:
        return '错误';
    }
  }
}

// ===== 错误边界组件辅助函数 =====

/**
 * 创建错误边界处理函数
 * @param componentName - 组件名称
 * @returns 错误处理函数
 */
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, errorInfo: any) => {
    ErrorHandler.handle(error, {
      showAlert: false,
      logError: true,
      reportError: true,
      level: 'high',
      category: 'system',
      context: {
        action: 'component_error',
        route: componentName,
        extra: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  };
}

// ===== 异步操作错误处理装饰器 =====

/**
 * 异步操作错误处理装饰器
 * @param options - 处理选项
 * @returns 装饰器函数
 */
export function withErrorHandling(options: ErrorHandlerOptions = {}) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!;
    
    descriptor.value = (async function (this: any, ...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        ErrorHandler.handle(error, {
          ...options,
          context: {
            ...options.context,
            action: `${target.constructor.name}.${propertyName}`,
          },
        });
        throw error;
      }
    }) as T;
    
    return descriptor;
  };
}

// ===== 全局错误处理器 =====

/**
 * 设置全局错误处理器
 */
export function setupGlobalErrorHandler(): void {
  // 设置全局未捕获的Promise拒绝处理器
  if (typeof global !== 'undefined') {
    const originalHandler = global.onunhandledrejection;
    
    global.onunhandledrejection = (event: any) => {
      ErrorHandler.handle(event.reason, {
        level: 'high',
        category: 'system',
        context: {
          action: 'unhandled_promise_rejection',
        },
      });
      
      // 调用原始处理器（如果存在）
      if (originalHandler) {
        originalHandler(event);
      }
    };
  }
  
  // 设置React Native的错误处理器
  if (typeof ErrorUtils !== 'undefined') {
    const originalHandler = ErrorUtils.getGlobalHandler();
    
    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      ErrorHandler.handle(error, {
        level: isFatal ? 'critical' : 'high',
        category: 'system',
        context: {
          action: 'global_error',
          extra: { isFatal },
        },
      });
      
      // 调用原始处理器
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }
}

// ===== 便捷函数导出 =====

/**
 * 处理API错误
 * @param error - API错误
 * @param customMessage - 自定义消息
 */
export function handleApiError(error: any, customMessage?: string): void {
  ErrorHandler.handle(error, {
    customMessage,
    category: 'network',
  });
}

/**
 * 处理验证错误
 * @param error - 验证错误
 * @param customMessage - 自定义消息
 */
export function handleValidationError(error: any, customMessage?: string): void {
  ErrorHandler.handle(error, {
    customMessage,
    category: 'validation',
    level: 'low',
  });
}

/**
 * 处理网络错误
 * @param error - 网络错误
 * @param customMessage - 自定义消息
 */
export function handleNetworkError(error: any, customMessage?: string): void {
  ErrorHandler.handle(error, {
    customMessage,
    category: 'network',
  });
}

/**
 * 安全执行异步操作
 * @param operation - 异步操作
 * @param options - 错误处理选项
 * @returns 操作结果
 */
export async function safeExecute<T>(
  operation: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    ErrorHandler.handle(error, options);
    return null;
  }
}

// ===== 默认导出 =====
export default ErrorHandler;
