/**
 * 通用工具函数集合
 * 
 * 本文件包含了应用中使用的各种工具函数，包括格式化、验证、
 * 数据处理、时间处理、文件处理等功能
 */

import { Platform, Linking, Alert } from 'react-native';
import { REGEX, TIME, DATE_FORMATS, FILE_SIZE_LIMITS } from './constants';
import type { Timestamp, ID } from '../types';

// ===== 字符串处理工具函数 =====

/**
 * 首字母大写
 * @param str - 输入字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * 驼峰命名转换
 * @param str - 输入字符串 (kebab-case 或 snake_case)
 * @returns 驼峰命名字符串
 */
export function toCamelCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
}

/**
 * 短横线命名转换
 * @param str - 输入字符串 (camelCase)
 * @returns 短横线命名字符串
 */
export function toKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/**
 * 下划线命名转换
 * @param str - 输入字符串 (camelCase)
 * @returns 下划线命名字符串
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

/**
 * 截断字符串
 * @param str - 输入字符串
 * @param length - 最大长度
 * @param suffix - 后缀 (默认为 '...')
 * @returns 截断后的字符串
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * 移除字符串中的HTML标签
 * @param str - 包含HTML的字符串
 * @returns 纯文本字符串
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * 生成随机字符串
 * @param length - 字符串长度
 * @param charset - 字符集 (默认为字母数字)
 * @returns 随机字符串
 */
export function generateRandomString(
  length: number = 8,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 生成UUID (简化版)
 * @returns UUID字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ===== 数字处理工具函数 =====

/**
 * 格式化数字 (添加千分位分隔符)
 * @param num - 数字
 * @param locale - 地区设置 (默认为 'zh-CN')
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number, locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * 格式化货币
 * @param amount - 金额
 * @param currency - 货币代码 (默认为 'CNY')
 * @param locale - 地区设置 (默认为 'zh-CN')
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化百分比
 * @param value - 数值 (0-1)
 * @param decimals - 小数位数 (默认为 1)
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @param decimals - 小数位数 (默认为 2)
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * 限制数字在指定范围内
 * @param num - 数字
 * @param min - 最小值
 * @param max - 最大值
 * @returns 限制后的数字
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 生成指定范围内的随机数
 * @param min - 最小值
 * @param max - 最大值
 * @param isInteger - 是否为整数 (默认为 true)
 * @returns 随机数
 */
export function randomBetween(min: number, max: number, isInteger: boolean = true): number {
  const random = Math.random() * (max - min) + min;
  return isInteger ? Math.floor(random) : random;
}

// ===== 时间处理工具函数 =====

/**
 * 格式化时间戳
 * @param timestamp - 时间戳
 * @param format - 格式 (默认为 'YYYY-MM-DD HH:mm:ss')
 * @returns 格式化后的时间字符串
 */
export function formatTimestamp(timestamp: Timestamp, format: string = DATE_FORMATS.DATETIME): string {
  const date = new Date(timestamp);
  
  if (format === DATE_FORMATS.RELATIVE) {
    return formatRelativeTime(timestamp);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化相对时间 (如: 2分钟前)
 * @param timestamp - 时间戳
 * @returns 相对时间字符串
 */
export function formatRelativeTime(timestamp: Timestamp): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < TIME.MINUTE) {
    return '刚刚';
  } else if (diff < TIME.HOUR) {
    return `${Math.floor(diff / TIME.MINUTE)}分钟前`;
  } else if (diff < TIME.DAY) {
    return `${Math.floor(diff / TIME.HOUR)}小时前`;
  } else if (diff < TIME.WEEK) {
    return `${Math.floor(diff / TIME.DAY)}天前`;
  } else if (diff < TIME.MONTH) {
    return `${Math.floor(diff / TIME.WEEK)}周前`;
  } else if (diff < TIME.YEAR) {
    return `${Math.floor(diff / TIME.MONTH)}个月前`;
  } else {
    return `${Math.floor(diff / TIME.YEAR)}年前`;
  }
}

/**
 * 获取时间范围描述
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @returns 时间范围描述
 */
export function getTimeRangeDescription(startTime: Timestamp, endTime: Timestamp): string {
  const duration = endTime - startTime;
  
  if (duration < TIME.MINUTE) {
    return `${Math.floor(duration / TIME.SECOND)}秒`;
  } else if (duration < TIME.HOUR) {
    return `${Math.floor(duration / TIME.MINUTE)}分钟`;
  } else if (duration < TIME.DAY) {
    return `${Math.floor(duration / TIME.HOUR)}小时`;
  } else {
    return `${Math.floor(duration / TIME.DAY)}天`;
  }
}

/**
 * 检查是否为今天
 * @param timestamp - 时间戳
 * @returns 是否为今天
 */
export function isToday(timestamp: Timestamp): boolean {
  const today = new Date();
  const date = new Date(timestamp);
  
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

/**
 * 检查是否为本周
 * @param timestamp - 时间戳
 * @returns 是否为本周
 */
export function isThisWeek(timestamp: Timestamp): boolean {
  const now = Date.now();
  const weekStart = now - (now % TIME.WEEK);
  return timestamp >= weekStart && timestamp <= now;
}

// ===== 数据验证工具函数 =====

/**
 * 验证邮箱地址
 * @param email - 邮箱地址
 * @returns 是否为有效邮箱
 */
export function isValidEmail(email: string): boolean {
  return REGEX.EMAIL.test(email);
}

/**
 * 验证密码强度
 * @param password - 密码
 * @returns 是否为强密码
 */
export function isValidPassword(password: string): boolean {
  return REGEX.PASSWORD.test(password);
}

/**
 * 验证手机号 (中国大陆)
 * @param phone - 手机号
 * @returns 是否为有效手机号
 */
export function isValidPhone(phone: string): boolean {
  return REGEX.PHONE.test(phone);
}

/**
 * 验证IP地址
 * @param ip - IP地址
 * @returns 是否为有效IP地址
 */
export function isValidIP(ip: string): boolean {
  return REGEX.IP_ADDRESS.test(ip);
}

/**
 * 验证URL
 * @param url - URL地址
 * @returns 是否为有效URL
 */
export function isValidURL(url: string): boolean {
  return REGEX.URL.test(url);
}

/**
 * 验证文件类型
 * @param fileName - 文件名
 * @param allowedTypes - 允许的文件类型
 * @returns 是否为允许的文件类型
 */
export function isValidFileType(fileName: string, allowedTypes: string[]): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
}

/**
 * 验证文件大小
 * @param fileSize - 文件大小 (字节)
 * @param maxSize - 最大允许大小 (字节)
 * @returns 是否在允许的大小范围内
 */
export function isValidFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize;
}

// ===== 数组处理工具函数 =====

/**
 * 数组去重
 * @param array - 输入数组
 * @param key - 对象数组的去重键名 (可选)
 * @returns 去重后的数组
 */
export function uniqueArray<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * 数组分组
 * @param array - 输入数组
 * @param keyFn - 分组键函数
 * @returns 分组后的对象
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

/**
 * 数组分块
 * @param array - 输入数组
 * @param size - 块大小
 * @returns 分块后的二维数组
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 数组排序
 * @param array - 输入数组
 * @param key - 排序键
 * @param direction - 排序方向 ('asc' | 'desc')
 * @returns 排序后的数组
 */
export function sortArray<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * 数组搜索
 * @param array - 输入数组
 * @param query - 搜索关键词
 * @param keys - 搜索字段
 * @returns 搜索结果数组
 */
export function searchArray<T>(
  array: T[],
  query: string,
  keys: (keyof T)[]
): T[] {
  if (!query.trim()) return array;
  
  const lowerQuery = query.toLowerCase();
  return array.filter(item =>
    keys.some(key => {
      const value = String(item[key]).toLowerCase();
      return value.includes(lowerQuery);
    })
  );
}

// ===== 对象处理工具函数 =====

/**
 * 深度克隆对象
 * @param obj - 输入对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  
  const cloned = {} as T;
  Object.keys(obj).forEach(key => {
    cloned[key as keyof T] = deepClone((obj as any)[key]);
  });
  
  return cloned;
}

/**
 * 深度合并对象
 * @param target - 目标对象
 * @param sources - 源对象列表
 * @returns 合并后的对象
 */
export function deepMerge<T>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  
  const source = sources.shift();
  if (!source) return target;
  
  if (typeof target === 'object' && typeof source === 'object') {
    Object.keys(source).forEach(key => {
      const sourceValue = (source as any)[key];
      const targetValue = (target as any)[key];
      
      if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
        if (typeof targetValue === 'object' && targetValue !== null && !Array.isArray(targetValue)) {
          (target as any)[key] = deepMerge(targetValue, sourceValue);
        } else {
          (target as any)[key] = deepClone(sourceValue);
        }
      } else {
        (target as any)[key] = sourceValue;
      }
    });
  }
  
  return deepMerge(target, ...sources);
}

/**
 * 获取对象嵌套属性值
 * @param obj - 对象
 * @param path - 属性路径 (如: 'user.profile.name')
 * @param defaultValue - 默认值
 * @returns 属性值
 */
export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current;
}

/**
 * 设置对象嵌套属性值
 * @param obj - 对象
 * @param path - 属性路径
 * @param value - 属性值
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
}

// ===== 平台相关工具函数 =====

/**
 * 打开外部链接
 * @param url - 链接地址
 * @param fallback - 失败回调
 */
export async function openURL(url: string, fallback?: () => void): Promise<void> {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      fallback?.();
    }
  } catch (error) {
    console.error('Failed to open URL:', error);
    fallback?.();
  }
}

/**
 * 拨打电话
 * @param phoneNumber - 电话号码
 */
export async function makePhoneCall(phoneNumber: string): Promise<void> {
  const url = `tel:${phoneNumber}`;
  await openURL(url, () => {
    Alert.alert('错误', '无法拨打电话');
  });
}

/**
 * 发送邮件
 * @param email - 邮箱地址
 * @param subject - 邮件主题
 * @param body - 邮件内容
 */
export async function sendEmail(email: string, subject?: string, body?: string): Promise<void> {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  
  const url = `mailto:${email}${params.toString() ? `?${params.toString()}` : ''}`;
  await openURL(url, () => {
    Alert.alert('错误', '无法发送邮件');
  });
}

/**
 * 分享内容
 * @param content - 分享内容
 * @param title - 分享标题
 */
export async function shareContent(content: string, title?: string): Promise<void> {
  try {
    const Share = require('react-native').Share;
    await Share.share({
      message: content,
      title,
    });
  } catch (error) {
    console.error('Failed to share content:', error);
  }
}

/**
 * 复制到剪贴板
 * @param text - 要复制的文本
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    const Clipboard = require('@react-native-clipboard/clipboard');
    await Clipboard.setString(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
  }
}

/**
 * 从剪贴板获取文本
 * @returns 剪贴板文本
 */
export async function getClipboardText(): Promise<string> {
  try {
    const Clipboard = require('@react-native-clipboard/clipboard');
    return await Clipboard.getString();
  } catch (error) {
    console.error('Failed to get clipboard text:', error);
    return '';
  }
}

/**
 * 检查网络连接状态
 * @returns 是否已连接网络
 */
export async function checkNetworkConnection(): Promise<boolean> {
  try {
    const NetInfo = require('@react-native-community/netinfo');
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  } catch (error) {
    console.error('Failed to check network connection:', error);
    return false;
  }
}

// ===== 调试工具函数 =====

/**
 * 安全的JSON解析
 * @param str - JSON字符串
 * @param defaultValue - 默认值
 * @returns 解析后的对象
 */
export function safeJsonParse<T = any>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * 安全的JSON序列化
 * @param obj - 要序列化的对象
 * @param defaultValue - 默认值
 * @returns JSON字符串
 */
export function safeJsonStringify(obj: any, defaultValue: string = '{}'): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return defaultValue;
  }
}

/**
 * 控制台日志 (仅在开发环境)
 * @param args - 日志参数
 */
export function devLog(...args: any[]): void {
  if (__DEV__) {
    console.log('[DevLog]', ...args);
  }
}

/**
 * 控制台警告 (仅在开发环境)
 * @param args - 警告参数
 */
export function devWarn(...args: any[]): void {
  if (__DEV__) {
    console.warn('[DevWarn]', ...args);
  }
}

/**
 * 控制台错误 (仅在开发环境)
 * @param args - 错误参数
 */
export function devError(...args: any[]): void {
  if (__DEV__) {
    console.error('[DevError]', ...args);
  }
}

/**
 * 性能计时器
 * @param label - 计时器标签
 * @returns 结束计时函数
 */
export function createTimer(label: string): () => void {
  if (!__DEV__) return () => {};
  
  const startTime = Date.now();
  console.time(label);
  
  return () => {
    console.timeEnd(label);
    const duration = Date.now() - startTime;
    console.log(`[Timer] ${label} took ${duration}ms`);
  };
}

// ===== 导出默认对象 =====
export default {
  // 字符串处理
  capitalize,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  truncate,
  stripHtml,
  generateRandomString,
  generateUUID,
  
  // 数字处理
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  clamp,
  randomBetween,
  
  // 时间处理
  formatTimestamp,
  formatRelativeTime,
  getTimeRangeDescription,
  isToday,
  isThisWeek,
  
  // 数据验证
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidIP,
  isValidURL,
  isValidFileType,
  isValidFileSize,
  
  // 数组处理
  uniqueArray,
  groupBy,
  chunkArray,
  sortArray,
  searchArray,
  
  // 对象处理
  deepClone,
  deepMerge,
  getNestedValue,
  setNestedValue,
  
  // 平台相关
  openURL,
  makePhoneCall,
  sendEmail,
  shareContent,
  copyToClipboard,
  getClipboardText,
  checkNetworkConnection,
  
  // 调试工具
  safeJsonParse,
  safeJsonStringify,
  devLog,
  devWarn,
  devError,
  createTimer,
};
