/**
 * 用户数据状态管理切片
 */

import type { StateCreator } from 'zustand';
import type { User } from '../../types/common';

// 用户偏好设置接口
export interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
    locationSharing: boolean;
  };
  display: {
    compactMode: boolean;
    showTips: boolean;
    autoPlay: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    sessionTimeout: number;
  };
}

// 用户状态接口
export interface UserState {
  profile: User | null;
  preferences: UserPreferences;
  favorites: string[];
  history: any[];
  stats: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    joinDate: number;
    lastActiveDate: number;
  };
  loading: {
    profile: boolean;
    preferences: boolean;
    favorites: boolean;
  };
  error: {
    profile: string | null;
    preferences: string | null;
    favorites: string | null;
  };
}

// 用户操作接口
export interface UserActions {
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addToFavorites: (itemId: string) => void;
  removeFromFavorites: (itemId: string) => void;
}

// 用户切片类型
export type UserSlice = {
  user: UserState;
} & UserActions;

// 默认偏好设置
const defaultPreferences: UserPreferences = {
  notifications: {
    push: true,
    email: true,
    sms: false,
    marketing: false,
  },
  privacy: {
    profileVisible: true,
    activityVisible: false,
    locationSharing: false,
  },
  display: {
    compactMode: false,
    showTips: true,
    autoPlay: true,
  },
  security: {
    twoFactorEnabled: false,
    biometricEnabled: false,
    sessionTimeout: 30,
  },
};

// 初始状态
const initialUserState: UserState = {
  profile: null,
  preferences: defaultPreferences,
  favorites: [],
  history: [],
  stats: {
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    joinDate: Date.now(),
    lastActiveDate: Date.now(),
  },
  loading: {
    profile: false,
    preferences: false,
    favorites: false,
  },
  error: {
    profile: null,
    preferences: null,
    favorites: null,
  },
};

// 创建用户切片
export const createUserSlice: StateCreator<
  UserSlice,
  [["zustand/immer", never]],
  [],
  UserSlice
> = (set, get) => ({
  user: initialUserState,

  // 更新个人资料
  updateProfile: async (profileData: Partial<User>) => {
    set((state) => {
      state.user.loading.profile = true;
      state.user.error.profile = null;
    });

    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set((state) => {
        if (state.user.profile) {
          state.user.profile = { ...state.user.profile, ...profileData };
        }
        state.user.loading.profile = false;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新个人资料失败';
      
      set((state) => {
        state.user.loading.profile = false;
        state.user.error.profile = errorMessage;
      });
      
      throw error;
    }
  },

  // 更新偏好设置
  updatePreferences: (preferences: Partial<UserPreferences>) => {
    set((state) => {
      state.user.preferences = { ...state.user.preferences, ...preferences };
    });
  },

  // 添加到收藏
  addToFavorites: (itemId: string) => {
    set((state) => {
      if (!state.user.favorites.includes(itemId)) {
        state.user.favorites.push(itemId);
      }
    });
  },

  // 从收藏中移除
  removeFromFavorites: (itemId: string) => {
    set((state) => {
      state.user.favorites = state.user.favorites.filter(id => id !== itemId);
    });
  },
});