/**
 * 认证状态管理切片
 */

import type { StateCreator } from 'zustand';
import { StorageUtils } from '../../utils/storage';
import { loginAPI, registerAPI, refreshTokenAPI } from '../../services/api';
import type { User } from '../../types/common';

// 认证状态接口
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginTime: number | null;
}

// 认证操作接口
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  resetLoginAttempts: () => void;
  initializeAuth: () => void;
}

// 注册数据接口
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

// 认证切片类型
export type AuthSlice = {
  auth: AuthState;
} & AuthActions;

// 初始状态（不包含存储读取）
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  loginAttempts: 0,
  lastLoginTime: null,
};

// 创建认证切片
export const createAuthSlice: StateCreator<
  AuthSlice,
  [["zustand/immer", never]],
  [],
  AuthSlice
> = (set, get) => ({
  auth: initialAuthState,

  // 初始化认证状态（从存储恢复）
  initializeAuth: () => {
    try {
      const token = StorageUtils.getUserToken();
      const user = StorageUtils.getUserProfile<User>();
      
      set((state) => {
        state.auth.isAuthenticated = !!token;
        state.auth.user = user || null;
        state.auth.token = token || null;
      });
      
      console.log('[Auth] Authentication state initialized:', { 
        isAuthenticated: !!token, 
        hasUser: !!user 
      });
    } catch (error) {
      console.error('[Auth] Failed to initialize auth state:', error);
    }
  },

  // 登录
  login: async (email: string, password: string) => {
    set((state) => {
      state.auth.loading = true;
      state.auth.error = null;
    });

    try {
      // 使用真实的 API 调用（在开发环境下会回退到模拟数据）
      const response = __DEV__ 
        ? await mockLoginAPI(email, password)
        : await loginAPI(email, password);
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        // 存储到安全存储
        StorageUtils.setUserToken(token);
        StorageUtils.setUserProfile(user);
        
        set((state) => {
          state.auth.isAuthenticated = true;
          state.auth.user = user;
          state.auth.token = token;
          state.auth.refreshToken = refreshToken;
          state.auth.loading = false;
          state.auth.error = null;
          state.auth.loginAttempts = 0;
          state.auth.lastLoginTime = Date.now();
        });
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      
      set((state) => {
        state.auth.loading = false;
        state.auth.error = errorMessage;
        state.auth.loginAttempts += 1;
      });
      
      throw error;
    }
  },

  // 登出
  logout: () => {
    // 清除存储的认证信息
    StorageUtils.clearUserToken();
    
    set((state) => {
      state.auth.isAuthenticated = false;
      state.auth.user = null;
      state.auth.token = null;
      state.auth.refreshToken = null;
      state.auth.error = null;
      state.auth.loginAttempts = 0;
      state.auth.lastLoginTime = null;
    });
  },

  // 注册
  register: async (userData: RegisterData) => {
    set((state) => {
      state.auth.loading = true;
      state.auth.error = null;
    });

    try {
      // 使用真实的 API 调用（在开发环境下会回退到模拟数据）
      const response = __DEV__ 
        ? await mockRegisterAPI(userData)
        : await registerAPI(userData);
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        // 存储到安全存储
        StorageUtils.setUserToken(token);
        StorageUtils.setUserProfile(user);
        
        set((state) => {
          state.auth.isAuthenticated = true;
          state.auth.user = user;
          state.auth.token = token;
          state.auth.refreshToken = refreshToken;
          state.auth.loading = false;
          state.auth.error = null;
          state.auth.lastLoginTime = Date.now();
        });
      } else {
        throw new Error(response.message || '注册失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '注册失败';
      
      set((state) => {
        state.auth.loading = false;
        state.auth.error = errorMessage;
      });
      
      throw error;
    }
  },

  // 刷新令牌
  refreshToken: async () => {
    const { auth } = get();
    
    if (!auth.refreshToken) {
      throw new Error('没有刷新令牌');
    }

    try {
      // 使用真实的 API 调用（在开发环境下会回退到模拟数据）
      const response = __DEV__ 
        ? await mockRefreshTokenAPI(auth.refreshToken)
        : await refreshTokenAPI(auth.refreshToken);
      
      if (response.success && response.data) {
        const { token, refreshToken } = response.data;
        
        // 更新存储
        StorageUtils.setUserToken(token);
        
        set((state) => {
          state.auth.token = token;
          state.auth.refreshToken = refreshToken;
        });
      } else {
        // 刷新失败，退出登录
        get().logout();
        throw new Error('会话已过期，请重新登录');
      }
    } catch (error) {
      get().logout();
      throw error;
    }
  },

  // 更新用户信息
  updateUser: (userData: Partial<User>) => {
    set((state) => {
      if (state.auth.user) {
        state.auth.user = { ...state.auth.user, ...userData };
        // 更新存储
        StorageUtils.setUserProfile(state.auth.user);
      }
    });
  },

  // 清除错误
  clearError: () => {
    set((state) => {
      state.auth.error = null;
    });
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set((state) => {
      state.auth.loading = loading;
    });
  },

  // 重置登录尝试次数
  resetLoginAttempts: () => {
    set((state) => {
      state.auth.loginAttempts = 0;
    });
  },
});

// 模拟 API 函数（实际项目中应该在 services 层实现）
const mockLoginAPI = async (email: string, password: string) => {
  // 模拟网络延迟
  await new Promise<void>(resolve => setTimeout(resolve, 1000));
  
  // 模拟登录验证
  if (email === 'demo@example.com' && password === 'password') {
    return {
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: '1',
          email: 'demo@example.com',
          name: '演示用户',
          avatar: 'https://i.pravatar.cc/150?u=demo@example.com',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as User,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      },
    };
  } else {
    return {
      success: false,
      message: '邮箱或密码错误',
    };
  }
};

const mockRegisterAPI = async (userData: RegisterData) => {
  // 模拟网络延迟
  await new Promise<void>(resolve => setTimeout(resolve, 1200));
  
  // 模拟注册
  return {
    success: true,
    message: '注册成功',
    data: {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as User,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    },
  };
};

const mockRefreshTokenAPI = async (refreshToken: string) => {
  // 模拟网络延迟
  await new Promise<void>(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: '令牌刷新成功',
    data: {
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token',
    },
  };
};