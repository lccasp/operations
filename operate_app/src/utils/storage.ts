/**
 * MMKV 存储工具
 * 提供高性能的键值存储功能
 */

import { MMKV } from 'react-native-mmkv';

// 存储实例配置
const storage = new MMKV({
  id: 'operate-app-storage',
  encryptionKey: 'operate-app-encryption-key-2024', // 生产环境中应使用更安全的密钥
});

// 用户数据存储实例（独立加密）
const userStorage = new MMKV({
  id: 'operate-app-user-storage',
  encryptionKey: 'operate-app-user-encryption-key-2024',
});

// 存储键名常量
export const StorageKeys = {
  // 应用设置
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  BIOMETRICS_ENABLED: 'biometrics_enabled',
  ANALYTICS_ENABLED: 'analytics_enabled',
  
  // 用户相关
  USER_TOKEN: 'user_token',
  USER_REFRESH_TOKEN: 'user_refresh_token',
  USER_PROFILE: 'user_profile',
  USER_PREFERENCES: 'user_preferences',
  
  // 应用状态
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FIRST_LAUNCH: 'first_launch',
  APP_VERSION: 'app_version',
  LAST_UPDATE_CHECK: 'last_update_check',
  
  // 缓存数据
  CACHE_PREFIX: 'cache_',
  API_CACHE_PREFIX: 'api_cache_',
  
  // 临时数据
  TEMP_PREFIX: 'temp_',
} as const;

// 基础存储接口
interface StorageInterface {
  set(key: string, value: any): void;
  get<T = any>(key: string): T | undefined;
  getString(key: string): string | undefined;
  getNumber(key: string): number | undefined;
  getBoolean(key: string): boolean | undefined;
  delete(key: string): void;
  has(key: string): boolean;
  clear(): void;
  getAllKeys(): string[];
}

// 存储工具类
class StorageUtil implements StorageInterface {
  private storage: MMKV;

  constructor(storageInstance: MMKV) {
    this.storage = storageInstance;
  }

  // 设置值
  set(key: string, value: any): void {
    try {
      if (value === undefined || value === null) {
        this.delete(key);
        return;
      }

      if (typeof value === 'string') {
        this.storage.set(key, value);
      } else if (typeof value === 'number') {
        this.storage.set(key, value);
      } else if (typeof value === 'boolean') {
        this.storage.set(key, value);
      } else {
        // 对象或数组，序列化为 JSON
        this.storage.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`[Storage] Failed to set key "${key}":`, error);
    }
  }

  // 获取值（自动推断类型）
  get<T = any>(key: string): T | undefined {
    try {
      const value = this.storage.getString(key);
      if (value === undefined) {
        return undefined;
      }

      try {
        // 尝试解析为 JSON
        return JSON.parse(value) as T;
      } catch {
        // 如果解析失败，返回字符串
        return value as T;
      }
    } catch (error) {
      console.error(`[Storage] Failed to get key "${key}":`, error);
      return undefined;
    }
  }

  // 获取字符串
  getString(key: string): string | undefined {
    try {
      return this.storage.getString(key);
    } catch (error) {
      console.error(`[Storage] Failed to get string "${key}":`, error);
      return undefined;
    }
  }

  // 获取数字
  getNumber(key: string): number | undefined {
    try {
      return this.storage.getNumber(key);
    } catch (error) {
      console.error(`[Storage] Failed to get number "${key}":`, error);
      return undefined;
    }
  }

  // 获取布尔值
  getBoolean(key: string): boolean | undefined {
    try {
      return this.storage.getBoolean(key);
    } catch (error) {
      console.error(`[Storage] Failed to get boolean "${key}":`, error);
      return undefined;
    }
  }

  // 删除键
  delete(key: string): void {
    try {
      this.storage.delete(key);
    } catch (error) {
      console.error(`[Storage] Failed to delete key "${key}":`, error);
    }
  }

  // 检查键是否存在
  has(key: string): boolean {
    try {
      return this.storage.contains(key);
    } catch (error) {
      console.error(`[Storage] Failed to check key "${key}":`, error);
      return false;
    }
  }

  // 清空所有数据
  clear(): void {
    try {
      this.storage.clearAll();
    } catch (error) {
      console.error('[Storage] Failed to clear storage:', error);
    }
  }

  // 获取所有键
  getAllKeys(): string[] {
    try {
      return this.storage.getAllKeys();
    } catch (error) {
      console.error('[Storage] Failed to get all keys:', error);
      return [];
    }
  }
}

// 导出存储实例
export const appStorage = new StorageUtil(storage);
export const secureStorage = new StorageUtil(userStorage);

// 便捷方法
export const StorageUtils = {
  // 应用设置相关
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => {
    appStorage.set(StorageKeys.THEME_MODE, mode);
  },
  
  getThemeMode: (): 'light' | 'dark' | 'auto' => {
    return appStorage.get(StorageKeys.THEME_MODE) ?? 'auto';
  },
  
  setLanguage: (language: string) => {
    appStorage.set(StorageKeys.LANGUAGE, language);
  },
  
  getLanguage: (): string => {
    return appStorage.get(StorageKeys.LANGUAGE) ?? 'zh-CN';
  },

  // 用户认证相关
  setUserToken: (token: string) => {
    secureStorage.set(StorageKeys.USER_TOKEN, token);
  },
  
  getUserToken: (): string | undefined => {
    return secureStorage.getString(StorageKeys.USER_TOKEN);
  },
  
  clearUserToken: () => {
    secureStorage.delete(StorageKeys.USER_TOKEN);
    secureStorage.delete(StorageKeys.USER_REFRESH_TOKEN);
  },
  
  setUserProfile: (profile: any) => {
    secureStorage.set(StorageKeys.USER_PROFILE, profile);
  },
  
  getUserProfile: <T = any>(): T | undefined => {
    return secureStorage.get<T>(StorageKeys.USER_PROFILE);
  },

  // 应用状态相关
  setOnboardingCompleted: (completed: boolean = true) => {
    appStorage.set(StorageKeys.ONBOARDING_COMPLETED, completed);
  },
  
  isOnboardingCompleted: (): boolean => {
    return appStorage.getBoolean(StorageKeys.ONBOARDING_COMPLETED) ?? false;
  },
  
  setFirstLaunch: (isFirst: boolean = false) => {
    appStorage.set(StorageKeys.FIRST_LAUNCH, isFirst);
  },
  
  isFirstLaunch: (): boolean => {
    return appStorage.getBoolean(StorageKeys.FIRST_LAUNCH) ?? true;
  },

  // 缓存相关
  setCache: (key: string, data: any, ttl?: number) => {
    const cacheKey = `${StorageKeys.CACHE_PREFIX}${key}`;
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: ttl ? Date.now() + ttl : undefined,
    };
    appStorage.set(cacheKey, cacheData);
  },
  
  getCache: <T = any>(key: string): T | undefined => {
    const cacheKey = `${StorageKeys.CACHE_PREFIX}${key}`;
    const cacheData = appStorage.get<{
      data: T;
      timestamp: number;
      ttl?: number;
    }>(cacheKey);
    
    if (!cacheData) {
      return undefined;
    }
    
    // 检查是否过期
    if (cacheData.ttl && Date.now() > cacheData.ttl) {
      appStorage.delete(cacheKey);
      return undefined;
    }
    
    return cacheData.data;
  },
  
  clearCache: () => {
    const keys = appStorage.getAllKeys();
    keys.forEach(key => {
      if (key.startsWith(StorageKeys.CACHE_PREFIX)) {
        appStorage.delete(key);
      }
    });
  },

  // 数据迁移工具
  migrate: (fromVersion: string, toVersion: string) => {
    // 实现数据迁移逻辑
    console.log(`[Storage] Migrating data from ${fromVersion} to ${toVersion}`);
    // 这里可以添加具体的迁移逻辑
  },

  // 调试工具
  debug: {
    logAllKeys: () => {
      console.log('[Storage] All app storage keys:', appStorage.getAllKeys());
      console.log('[Storage] All secure storage keys:', secureStorage.getAllKeys());
    },
    
    logStorage: () => {
      const keys = appStorage.getAllKeys();
      keys.forEach(key => {
        console.log(`[Storage] ${key}:`, appStorage.get(key));
      });
    },
    
    exportStorage: () => {
      const keys = appStorage.getAllKeys();
      const data: Record<string, any> = {};
      keys.forEach(key => {
        data[key] = appStorage.get(key);
      });
      return data;
    },
  },
};

// 导出类型
export type { StorageInterface };

// 默认导出主存储实例
export default appStorage;
