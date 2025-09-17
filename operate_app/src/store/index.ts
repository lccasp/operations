/**
 * Zustand 状态管理入口
 * 整合所有状态切片
 */

import { create } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

import { appStorage } from '../utils/storage';
import { createAuthSlice, type AuthSlice } from './slices/authSlice';
import { createAppSlice, type AppSlice } from './slices/appSlice';
import { createUserSlice, type UserSlice } from './slices/userSlice';

// 组合所有状态切片
export type RootState = AuthSlice & AppSlice & UserSlice;

// MMKV 存储适配器
const mmkvStorage = {
  getItem: (name: string) => {
    const value = appStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    appStorage.set(name, value);
  },
  removeItem: (name: string) => {
    appStorage.delete(name);
  },
};

// 创建持久化的根状态
export const useStore = create<RootState>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get, api) => ({
          // 合并所有状态切片
          ...createAuthSlice(set, get, api),
          ...createAppSlice(set, get, api),
          ...createUserSlice(set, get, api),
        })),
        {
          name: 'operate-app-store',
          storage: createJSONStorage(() => mmkvStorage),
          
          // 部分持久化配置
          partialize: (state) => ({
            // 只持久化需要的状态
            auth: {
              // 不持久化认证状态，让启动时重新检查
            },
            app: {
              theme: state.app.theme,
              language: state.app.language,
              settings: state.app.settings,
              onboardingCompleted: state.app.onboardingCompleted,
            },
            user: {
              preferences: state.user.preferences,
            },
          }),
          
          // 版本控制和迁移
          version: 1,
          migrate: (persistedState: any, version: number) => {
            if (version === 0) {
              // 从版本 0 迁移到版本 1 的逻辑
              console.log('[Store] Migrating store from version 0 to 1');
            }
            return persistedState as RootState;
          },
          
          // 序列化/反序列化配置
          serialize: (state) => JSON.stringify(state),
          deserialize: (str) => JSON.parse(str),
        }
      )
    ),
    {
      name: 'operate-app-store',
      enabled: __DEV__, // 只在开发环境启用 Redux DevTools
    }
  )
);

// 选择器 Hooks（性能优化）
export const useAuth = () => useStore((state) => state.auth);
export const useApp = () => useStore((state) => state.app);
export const useUser = () => useStore((state) => state.user);

// 操作方法选择器（使用回调缓存避免无限重渲染）
const authActionsSelector = (state: RootState) => ({
  login: state.login,
  logout: state.logout,
  register: state.register,
  refreshToken: state.refreshToken,
  updateUser: state.updateUser,
  initializeAuth: state.initializeAuth,
  clearError: state.clearError,
  setLoading: state.setLoading,
  resetLoginAttempts: state.resetLoginAttempts,
});

const appActionsSelector = (state: RootState) => ({
  setTheme: state.setTheme,
  setLanguage: state.setLanguage,
  updateSettings: state.updateSettings,
  setOnboardingCompleted: state.setOnboardingCompleted,
  showNotification: state.showNotification,
  hideNotification: state.hideNotification,
  setOnlineStatus: state.setOnlineStatus,
  setAppState: state.setAppState,
});

const userActionsSelector = (state: RootState) => ({
  updateProfile: state.updateProfile,
  updatePreferences: state.updatePreferences,
  addToFavorites: state.addToFavorites,
  removeFromFavorites: state.removeFromFavorites,
});

export const useAuthActions = () => useStore(authActionsSelector);
export const useAppActions = () => useStore(appActionsSelector);
export const useUserActions = () => useStore(userActionsSelector);

// 状态重置（用于测试或清理）
export const resetStore = () => {
  useStore.getState().logout();
  useStore.persist.clearStorage();
};

// 订阅状态变化（用于副作用）
export const subscribeToAuth = (callback: (state: AuthSlice) => void) => {
  return useStore.subscribe(
    (state) => state.auth,
    callback,
    {
      equalityFn: (a, b) => a.isAuthenticated === b.isAuthenticated,
    }
  );
};

export const subscribeToTheme = (callback: (theme: string) => void) => {
  return useStore.subscribe(
    (state) => state.app.theme,
    callback
  );
};

// 状态调试工具（开发环境）
export const storeDebug = __DEV__ ? {
  getState: () => useStore.getState(),
  setState: (state: Partial<RootState>) => useStore.setState(state),
  reset: resetStore,
  logState: () => console.log('[Store] Current state:', useStore.getState()),
} : {};

export default useStore;