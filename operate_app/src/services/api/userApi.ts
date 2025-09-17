/**
 * 用户相关API服务
 */

import { http } from '../client';
import type { User } from '../../types/common';
import type { UserPreferences } from '../../store/slices/userSlice';

// 获取用户资料
export const getUserProfileAPI = async (userId: string) => {
  return http.get<User>(`/users/${userId}`);
};

// 更新用户资料
export const updateUserProfileAPI = async (profileData: Partial<User>) => {
  return http.put<User>('/users/profile', profileData);
};

// 上传头像
export const uploadAvatarAPI = async (imageFile: FormData) => {
  return http.upload<{ avatarUrl: string }>('/users/avatar', imageFile);
};

// 获取用户偏好设置
export const getUserPreferencesAPI = async () => {
  return http.get<UserPreferences>('/users/preferences');
};

// 更新用户偏好设置
export const updateUserPreferencesAPI = async (preferences: Partial<UserPreferences>) => {
  return http.put<UserPreferences>('/users/preferences', preferences);
};

// 获取用户收藏列表
export const getUserFavoritesAPI = async () => {
  return http.get<string[]>('/users/favorites');
};

// 添加收藏
export const addToFavoritesAPI = async (itemId: string) => {
  return http.post('/users/favorites', { itemId });
};

// 移除收藏
export const removeFromFavoritesAPI = async (itemId: string) => {
  return http.delete(`/users/favorites/${itemId}`);
};

// 获取用户历史记录
export const getUserHistoryAPI = async (page: number = 1, limit: number = 20) => {
  return http.get(`/users/history?page=${page}&limit=${limit}`);
};

// 清空历史记录
export const clearUserHistoryAPI = async () => {
  return http.delete('/users/history');
};

// 获取用户统计信息
export const getUserStatsAPI = async () => {
  return http.get('/users/stats');
};

// 同步用户数据
export const syncUserDataAPI = async () => {
  return http.post('/users/sync');
};

// 删除用户账号
export const deleteUserAccountAPI = async (password: string) => {
  return http.delete('/users/account', {
    data: { password },
  });
};

// 导出用户数据
export const exportUserDataAPI = async () => {
  return http.get('/users/export');
};
