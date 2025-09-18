/**
 * 应用全局状态管理切片
 */

import type { StateCreator } from 'zustand';
import { StorageUtils } from '../../utils/storage';
import type { Notification, AppSettings } from '../../types/common';

// 应用状态接口
export interface AppState {
  // 主题设置
  theme: 'light' | 'dark' | 'auto';
  
  // 语言设置
  language: string;
  
  // 应用设置
  settings: AppSettings;
  
  // 引导页状态
  onboardingCompleted: boolean;
  
  // 网络状态
  isOnline: boolean;
  
  // 应用状态
  appState: 'active' | 'background' | 'inactive';
  
  // 通知
  notifications: Notification[];
  
  // 加载状态
  globalLoading: boolean;
  
  // 错误状态
  globalError: string | null;
  
  // 应用版本信息
  version: string;
  buildNumber: string;
  
  // 更新信息
  hasUpdate: boolean;
  updateInfo: {
    version: string;
    description: string;
    required: boolean;
  } | null;
}

// 应用操作接口
export interface AppActions {
  // 主题相关
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  
  // 语言相关
  setLanguage: (language: string) => void;
  
  // 设置相关
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // 引导页
  setOnboardingCompleted: (completed: boolean) => void;
  
  // 网络状态
  setOnlineStatus: (isOnline: boolean) => void;
  
  // 应用状态
  setAppState: (appState: 'active' | 'background' | 'inactive') => void;
  
  // 通知管理
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // 全局加载状态
  setGlobalLoading: (loading: boolean) => void;
  
  // 全局错误
  setGlobalError: (error: string | null) => void;
  
  // 应用更新
  setUpdateInfo: (updateInfo: AppState['updateInfo']) => void;
  
  // 重置应用状态
  resetApp: () => void;
}

// 应用切片类型
export type AppSlice = {
  app: AppState;
} & AppActions;

// 初始状态
const initialAppState: AppState = {
  theme: StorageUtils.getThemeMode(),
  language: StorageUtils.getLanguage(),
  settings: {
    theme: StorageUtils.getThemeMode(),
    language: StorageUtils.getLanguage(),
    notifications: true,
    biometrics: false,
    analytics: true,
  },
  onboardingCompleted: StorageUtils.isOnboardingCompleted(),
  isOnline: true,
  appState: 'active',
  notifications: [],
  globalLoading: false,
  globalError: null,
  version: '1.0.0',
  buildNumber: '1',
  hasUpdate: false,
  updateInfo: null,
};

// 创建应用切片
export const createAppSlice: StateCreator<
  AppSlice,
  [["zustand/immer", never]],
  [],
  AppSlice
> = (set, get) => ({
  app: initialAppState,

  // 设置主题
  setTheme: (theme: 'light' | 'dark' | 'auto') => {
    StorageUtils.setThemeMode(theme);
    
    set((state) => {
      state.app.theme = theme;
      state.app.settings.theme = theme;
    });
  },

  // 设置语言
  setLanguage: (language: string) => {
    StorageUtils.setLanguage(language);
    
    set((state) => {
      state.app.language = language;
      state.app.settings.language = language;
    });
  },

  // 更新设置
  updateSettings: (settings: Partial<AppSettings>) => {
    set((state) => {
      state.app.settings = { ...state.app.settings, ...settings };
      
      // 同步某些设置到存储
      if (settings.theme) {
        StorageUtils.setThemeMode(settings.theme);
        state.app.theme = settings.theme;
      }
      
      if (settings.language) {
        StorageUtils.setLanguage(settings.language);
        state.app.language = settings.language;
      }
    });
  },

  // 设置引导页完成状态
  setOnboardingCompleted: (completed: boolean = true) => {
    StorageUtils.setOnboardingCompleted(completed);
    
    set((state) => {
      state.app.onboardingCompleted = completed;
    });
  },

  // 设置网络状态
  setOnlineStatus: (isOnline: boolean) => {
    set((state) => {
      state.app.isOnline = isOnline;
    });
  },

  // 设置应用状态
  setAppState: (appState: 'active' | 'background' | 'inactive') => {
    set((state) => {
      state.app.appState = appState;
    });
  },

  // 显示通知
  showNotification: (notification: Omit<Notification, 'id'>) => {
    // 生成更安全的唯一ID
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const newNotification: Notification = {
      id,
      ...notification,
    };
    
    set((state) => {
      state.app.notifications.push(newNotification);
    });

    // 使用requestAnimationFrame延迟设置定时器，避免在render期间执行
    requestAnimationFrame(() => {
      const duration = notification.duration !== undefined && notification.duration > 0 
        ? notification.duration 
        : 5000;
      
      setTimeout(() => {
        // 检查通知是否仍然存在再隐藏
        const currentNotifications = get().app.notifications;
        if (currentNotifications.some(n => n.id === id)) {
          get().hideNotification(id);
        }
      }, duration);
    });
  },

  // 隐藏通知
  hideNotification: (id: string) => {
    set((state) => {
      state.app.notifications = state.app.notifications.filter(
        (notification) => notification.id !== id
      );
    });
  },

  // 清除所有通知
  clearAllNotifications: () => {
    set((state) => {
      state.app.notifications = [];
    });
  },

  // 设置全局加载状态
  setGlobalLoading: (loading: boolean) => {
    set((state) => {
      state.app.globalLoading = loading;
    });
  },

  // 设置全局错误
  setGlobalError: (error: string | null) => {
    set((state) => {
      state.app.globalError = error;
    });
  },

  // 设置更新信息
  setUpdateInfo: (updateInfo: AppState['updateInfo']) => {
    set((state) => {
      state.app.updateInfo = updateInfo;
      state.app.hasUpdate = !!updateInfo;
    });
  },

  // 重置应用状态
  resetApp: () => {
    // 清除存储的设置
    StorageUtils.setOnboardingCompleted(false);
    
    set((state) => {
      // 保留一些关键设置，重置其他状态
      const { theme, language, settings } = state.app;
      
      state.app = {
        ...initialAppState,
        theme,
        language,
        settings,
        onboardingCompleted: false,
      };
    });
  },
});

// 通知工具函数
export const createSuccessNotification = (
  title: string,
  message: string
): Omit<Notification, 'id'> => ({
  title,
  message,
  type: 'success',
  duration: 3000,
});

export const createErrorNotification = (
  title: string,
  message: string
): Omit<Notification, 'id'> => ({
  title,
  message,
  type: 'error',
  duration: 5000,
});

export const createWarningNotification = (
  title: string,
  message: string
): Omit<Notification, 'id'> => ({
  title,
  message,
  type: 'warning',
  duration: 4000,
});

export const createInfoNotification = (
  title: string,
  message: string
): Omit<Notification, 'id'> => ({
  title,
  message,
  type: 'info',
  duration: 3000,
});
