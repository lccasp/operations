/**
 * 认证相关API服务
 */

import { http } from '../client';
import type { User } from '../../types/common';
import type { RegisterData } from '../../store/slices/authSlice';

// 登录响应接口
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// 登录接口
export const loginAPI = async (email: string, password: string) => {
  return http.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
};

// 注册接口
export const registerAPI = async (userData: RegisterData) => {
  return http.post<LoginResponse>('/auth/register', userData);
};

// 刷新令牌接口
export const refreshTokenAPI = async (refreshToken: string) => {
  return http.post<{ token: string; refreshToken: string }>('/auth/refresh', {
    refreshToken,
  });
};

// 登出接口
export const logoutAPI = async () => {
  return http.post('/auth/logout');
};

// 验证令牌接口
export const verifyTokenAPI = async () => {
  return http.get<{ valid: boolean; user: User }>('/auth/verify');
};

// 发送重置密码邮件
export const sendResetPasswordEmailAPI = async (email: string) => {
  return http.post('/auth/forgot-password', { email });
};

// 重置密码
export const resetPasswordAPI = async (token: string, newPassword: string) => {
  return http.post('/auth/reset-password', {
    token,
    newPassword,
  });
};

// 修改密码
export const changePasswordAPI = async (currentPassword: string, newPassword: string) => {
  return http.put('/auth/change-password', {
    currentPassword,
    newPassword,
  });
};

// 验证邮箱
export const verifyEmailAPI = async (token: string) => {
  return http.post('/auth/verify-email', { token });
};

// 重新发送验证邮件
export const resendVerificationEmailAPI = async () => {
  return http.post('/auth/resend-verification');
};
