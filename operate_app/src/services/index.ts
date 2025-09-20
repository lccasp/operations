/**
 * API服务统一导出入口
 * 
 * 本文件作为所有API服务的统一入口，提供清晰的服务导出结构
 * 包括HTTP客户端、各业务模块API、以及通用的服务工具
 */

// ===== HTTP客户端导出 =====
export { 
  apiClient,
  http,
  default as client 
} from './client';

export type { 
  ApiResponse as ServiceResponse 
} from './client';

// ===== 认证服务导出 =====
export {
  loginAPI,
  registerAPI,
  refreshTokenAPI,
  logoutAPI,
  resetPasswordAPI,
  changePasswordAPI,
  verifyEmailAPI,
} from './api/authApi';

// ===== 用户服务导出 =====
export {
  getUserProfileAPI,
  updateUserProfileAPI,
  uploadAvatarAPI,
} from './api/userApi';

// ===== 告警服务导出 =====
// 暂时注释掉，等待实现
// export {
//   getAlarmsAPI,
//   getAlarmByIdAPI,
//   acknowledgeAlarmAPI,
//   resolveAlarmAPI,
//   createAlarmAPI,
//   updateAlarmAPI,
//   deleteAlarmAPI,
//   getAlarmStatisticsAPI,
//   getAlarmRulesAPI,
//   createAlarmRuleAPI,
//   updateAlarmRuleAPI,
//   deleteAlarmRuleAPI,
// } from './api/alarmApi';

// ===== 服务工具函数 =====

/**
 * 创建带有认证头的请求配置
 * @param token - 认证令牌
 * @returns 请求配置对象
 */
export function createAuthHeaders(token: string) {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
}

/**
 * 处理API错误响应
 * @param error - 错误对象
 * @returns 格式化的错误信息
 */
export function handleApiError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return '网络请求失败，请稍后重试';
}

/**
 * 构建查询参数字符串
 * @param params - 查询参数对象
 * @returns 查询参数字符串
 */
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

/**
 * 验证API响应格式
 * @param response - API响应
 * @returns 是否为有效响应
 */
export function validateApiResponse(response: any): boolean {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.success === 'boolean'
  );
}

/**
 * 提取API响应数据
 * @param response - API响应
 * @returns 响应数据
 */
export function extractResponseData<T>(response: any): T | null {
  if (!validateApiResponse(response)) {
    return null;
  }
  
  return response.success ? response.data : null;
}

/**
 * 格式化时间范围参数
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @returns 格式化的时间范围对象
 */
export function formatTimeRange(startTime: number, endTime: number) {
  return {
    startTime: new Date(startTime).toISOString(),
    endTime: new Date(endTime).toISOString(),
  };
}

/**
 * 重试机制包装器
 * @param fn - 要重试的函数
 * @param maxRetries - 最大重试次数
 * @param delay - 重试延迟时间（毫秒）
 * @returns 包装后的函数
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxRetries: number = 3,
  delay: number = 1000
): T {
  return (async (...args: Parameters<T>) => {
    let lastError: any;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  }) as T;
}

/**
 * 请求超时包装器
 * @param fn - 要包装的函数
 * @param timeout - 超时时间（毫秒）
 * @returns 包装后的函数
 */
export function withTimeout<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  timeout: number = 10000
): T {
  return (async (...args: Parameters<T>) => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), timeout);
    });
    
    return Promise.race([fn(...args), timeoutPromise]);
  }) as T;
}

// ===== 服务状态管理 =====

/**
 * 服务状态接口
 */
export interface ServiceStatus {
  /** 是否在线 */
  online: boolean;
  /** 最后检查时间 */
  lastCheck: number;
  /** 响应时间（毫秒） */
  responseTime?: number;
  /** 错误信息 */
  error?: string;
}

/**
 * 服务健康检查
 * @returns 服务状态
 */
export async function checkServiceHealth(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    const response = await http.get('/health');
    const responseTime = Date.now() - startTime;
    
    return {
      online: response.success,
      lastCheck: Date.now(),
      responseTime,
    };
  } catch (error) {
    return {
      online: false,
      lastCheck: Date.now(),
      error: handleApiError(error),
    };
  }
}

// ===== 批量操作工具 =====

/**
 * 批量处理数据
 * @param items - 要处理的数据项
 * @param batchSize - 批次大小
 * @param processor - 处理函数
 * @returns 处理结果
 */
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * 并发控制器
 * @param tasks - 任务列表
 * @param concurrency - 并发数
 * @returns 执行结果
 */
export async function limitConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });
    
    executing.push(promise);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  await Promise.all(executing);
  return results;
}

// ===== 数据转换工具 =====

/**
 * 将查询参数转换为API格式
 * @param params - 查询参数
 * @returns API格式的参数
 */
export function transformSearchParams(params: any) {
  const transformed: any = { ...params };
  
  // 转换分页参数
  if (params.pagination) {
    transformed.page = params.pagination.page;
    transformed.pageSize = params.pagination.pageSize;
    delete transformed.pagination;
  }
  
  // 转换排序参数
  if (params.sort) {
    transformed.sortBy = params.sort.field;
    transformed.sortOrder = params.sort.direction;
    delete transformed.sort;
  }
  
  // 转换时间范围参数
  if (params.timeRange) {
    const [startTime, endTime] = params.timeRange;
    Object.assign(transformed, formatTimeRange(startTime, endTime));
    delete transformed.timeRange;
  }
  
  return transformed;
}

/**
 * 标准化API响应
 * @param response - 原始响应
 * @returns 标准化响应
 */
export function normalizeApiResponse(response: any) {
  // 确保响应有标准的success字段
  if (response && typeof response.success !== 'boolean') {
    response.success = !response.error;
  }
  
  // 添加时间戳
  if (response && !response.timestamp) {
    response.timestamp = Date.now();
  }
  
  return response;
}
