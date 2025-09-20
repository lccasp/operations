/**
 * 告警相关API服务
 * 
 * 提供告警管理的所有API接口，包括告警查询、处理、统计等功能
 */

import { http } from '../client';
import type {
  GetAlarmsRequest,
  AcknowledgeAlarmRequest,
  CreateAlarmRequest,
  Alarm,
  PaginatedAlarmsResponse,
  ApiResponse,
} from '../../types';

// ===== 告警查询API =====

/**
 * 获取告警列表
 * @param params - 查询参数
 * @returns 告警列表响应
 */
export async function getAlarmsAPI(params?: GetAlarmsRequest): Promise<PaginatedAlarmsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    // 添加基础查询参数
    if (params.query) queryParams.append('query', params.query);
    if (params.pagination?.page) queryParams.append('page', String(params.pagination.page));
    if (params.pagination?.pageSize) queryParams.append('pageSize', String(params.pagination.pageSize));
    
    // 添加筛选参数
    if (params.level?.length) {
      params.level.forEach(level => queryParams.append('level', level));
    }
    if (typeof params.acknowledged === 'boolean') {
      queryParams.append('acknowledged', String(params.acknowledged));
    }
    if (params.timeRange) {
      queryParams.append('startTime', new Date(params.timeRange[0]).toISOString());
      queryParams.append('endTime', new Date(params.timeRange[1]).toISOString());
    }
    if (params.source) {
      queryParams.append('source', params.source);
    }
    
    // 添加排序参数
    if (params.sort) {
      queryParams.append('sortBy', params.sort.field);
      queryParams.append('sortOrder', params.sort.direction);
    }
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/alarms?${queryString}` : '/alarms';
  
  return http.get<PaginatedAlarmsResponse>(url);
}

/**
 * 根据ID获取告警详情
 * @param alarmId - 告警ID
 * @returns 告警详情响应
 */
export async function getAlarmByIdAPI(alarmId: string | number): Promise<ApiResponse<Alarm>> {
  return http.get<ApiResponse<Alarm>>(`/alarms/${alarmId}`);
}

// ===== 告警处理API =====

/**
 * 确认告警
 * @param params - 确认参数
 * @returns 确认结果响应
 */
export async function acknowledgeAlarmAPI(params: AcknowledgeAlarmRequest): Promise<ApiResponse> {
  return http.post<ApiResponse>('/alarms/acknowledge', params);
}

/**
 * 解决告警
 * @param alarmId - 告警ID
 * @param note - 解决备注
 * @returns 解决结果响应
 */
export async function resolveAlarmAPI(
  alarmId: string | number,
  note?: string
): Promise<ApiResponse> {
  return http.post<ApiResponse>(`/alarms/${alarmId}/resolve`, { note });
}

/**
 * 升级告警
 * @param alarmId - 告警ID
 * @param escalateLevel - 升级级别
 * @param note - 升级备注
 * @returns 升级结果响应
 */
export async function escalateAlarmAPI(
  alarmId: string | number,
  escalateLevel: string,
  note?: string
): Promise<ApiResponse> {
  return http.post<ApiResponse>(`/alarms/${alarmId}/escalate`, {
    escalateLevel,
    note,
  });
}

// ===== 告警管理API =====

/**
 * 创建告警
 * @param params - 创建参数
 * @returns 创建结果响应
 */
export async function createAlarmAPI(params: CreateAlarmRequest): Promise<ApiResponse<Alarm>> {
  return http.post<ApiResponse<Alarm>>('/alarms', params);
}

/**
 * 更新告警
 * @param alarmId - 告警ID
 * @param params - 更新参数
 * @returns 更新结果响应
 */
export async function updateAlarmAPI(
  alarmId: string | number,
  params: Partial<CreateAlarmRequest>
): Promise<ApiResponse<Alarm>> {
  return http.put<ApiResponse<Alarm>>(`/alarms/${alarmId}`, params);
}

/**
 * 删除告警
 * @param alarmId - 告警ID
 * @returns 删除结果响应
 */
export async function deleteAlarmAPI(alarmId: string | number): Promise<ApiResponse> {
  return http.delete<ApiResponse>(`/alarms/${alarmId}`);
}

// ===== 告警统计API =====

/**
 * 告警统计数据类型
 */
export interface AlarmStatistics {
  total: number;
  critical: number;
  major: number;
  minor: number;
  warning: number;
}

/**
 * 获取告警统计数据
 * @param timeRange - 时间范围
 * @returns 统计数据响应
 */
export async function getAlarmStatisticsAPI(
  timeRange?: [number, number]
): Promise<ApiResponse<AlarmStatistics>> {
  const params = new URLSearchParams();
  
  if (timeRange) {
    params.append('startTime', new Date(timeRange[0]).toISOString());
    params.append('endTime', new Date(timeRange[1]).toISOString());
  }
  
  const queryString = params.toString();
  const url = queryString ? `/alarms/statistics?${queryString}` : '/alarms/statistics';
  
  return http.get<ApiResponse<AlarmStatistics>>(url);
}

/**
 * 告警趋势数据点类型
 */
export interface AlarmTrendPoint {
  time: string;
  count: number;
  level: string;
}

/**
 * 获取告警趋势数据
 * @param period - 时间周期 ('day' | 'week' | 'month')
 * @param timeRange - 时间范围
 * @returns 趋势数据响应
 */
export async function getAlarmTrendsAPI(
  period: 'day' | 'week' | 'month' = 'day',
  timeRange?: [number, number]
): Promise<ApiResponse<AlarmTrendPoint[]>> {
  const params = new URLSearchParams();
  params.append('period', period);
  
  if (timeRange) {
    params.append('startTime', new Date(timeRange[0]).toISOString());
    params.append('endTime', new Date(timeRange[1]).toISOString());
  }
  
  return http.get<ApiResponse<AlarmTrendPoint[]>>(
    `/alarms/trends?${params.toString()}`
  );
}

// ===== 告警规则API =====

/**
 * 告警规则接口
 */
export interface AlarmRule {
  id: string | number;
  name: string;
  description: string;
  condition: string;
  level: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * 获取告警规则列表
 * @returns 告警规则列表响应
 */
export async function getAlarmRulesAPI(): Promise<ApiResponse<AlarmRule[]>> {
  return http.get<ApiResponse<AlarmRule[]>>('/alarms/rules');
}

/**
 * 创建告警规则
 * @param params - 规则参数
 * @returns 创建结果响应
 */
export async function createAlarmRuleAPI(params: {
  name: string;
  description: string;
  condition: string;
  level: string;
  enabled?: boolean;
}): Promise<ApiResponse<AlarmRule>> {
  return http.post<ApiResponse<AlarmRule>>('/alarms/rules', params);
}

/**
 * 更新告警规则
 * @param ruleId - 规则ID
 * @param params - 更新参数
 * @returns 更新结果响应
 */
export async function updateAlarmRuleAPI(
  ruleId: string | number,
  params: Partial<{
    name: string;
    description: string;
    condition: string;
    level: string;
    enabled: boolean;
  }>
): Promise<ApiResponse<AlarmRule>> {
  return http.put<ApiResponse<AlarmRule>>(`/alarms/rules/${ruleId}`, params);
}

/**
 * 删除告警规则
 * @param ruleId - 规则ID
 * @returns 删除结果响应
 */
export async function deleteAlarmRuleAPI(ruleId: string | number): Promise<ApiResponse> {
  return http.delete<ApiResponse>(`/alarms/rules/${ruleId}`);
}

/**
 * 启用/禁用告警规则
 * @param ruleId - 规则ID
 * @param enabled - 是否启用
 * @returns 操作结果响应
 */
export async function toggleAlarmRuleAPI(
  ruleId: string | number,
  enabled: boolean
): Promise<ApiResponse> {
  return http.put<ApiResponse>(`/alarms/rules/${ruleId}/toggle`, { enabled });
}

// ===== 批量操作API =====

/**
 * 批量操作结果类型
 */
export interface BatchOperationResult {
  successCount: number;
  failureCount: number;
  failures: Array<{
    id: string | number;
    error: string;
  }>;
}

/**
 * 批量确认告警
 * @param alarmIds - 告警ID列表
 * @param note - 确认备注
 * @returns 批量操作结果响应
 */
export async function batchAcknowledgeAlarmsAPI(
  alarmIds: (string | number)[],
  note?: string
): Promise<ApiResponse<BatchOperationResult>> {
  return http.post<ApiResponse<BatchOperationResult>>(
    '/alarms/batch/acknowledge',
    { alarmIds, note }
  );
}

/**
 * 批量解决告警
 * @param alarmIds - 告警ID列表
 * @param note - 解决备注
 * @returns 批量操作结果响应
 */
export async function batchResolveAlarmsAPI(
  alarmIds: (string | number)[],
  note?: string
): Promise<ApiResponse<BatchOperationResult>> {
  return http.post<ApiResponse<BatchOperationResult>>(
    '/alarms/batch/resolve',
    { alarmIds, note }
  );
}

/**
 * 批量删除告警
 * @param alarmIds - 告警ID列表
 * @returns 批量删除结果响应
 */
export async function batchDeleteAlarmsAPI(
  alarmIds: (string | number)[]
): Promise<ApiResponse<BatchOperationResult>> {
  return http.post<ApiResponse<BatchOperationResult>>(
    '/alarms/batch/delete',
    { alarmIds }
  );
}