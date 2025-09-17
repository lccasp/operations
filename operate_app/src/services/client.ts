/**
 * 简化的 HTTP 客户端配置
 */

import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig, 
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

// 响应数据类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  timestamp?: number;
}

// 创建 Axios 实例
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: 'http://localhost:3000/api', // 默认 API 地址
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // 请求拦截器
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // 开发环境日志
      if (__DEV__) {
        console.log('[API] Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
        });
      }
      return config;
    },
    (error) => {
      console.error('[API] Request error:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      if (__DEV__) {
        console.log('[API] Response:', {
          status: response.status,
          url: response.config.url,
        });
      }
      return response;
    },
    async (error) => {
      console.error('[API] Response error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
      });
      return Promise.reject(error);
    }
  );

  return client;
};

// 创建 API 客户端实例
export const apiClient = createApiClient();

// HTTP 方法封装
export const http = {
  // GET 请求
  get: async <T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  // POST 请求
  post: async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  // PUT 请求
  put: async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  // DELETE 请求
  delete: async <T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },

  // 文件上传
  upload: async <T = any>(
    url: string,
    file: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.post(url, file, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  },
};

// 默认导出
export default apiClient;