/**
 * 增强版错误边界组件
 * 
 * 捕获和处理React组件树中的错误，提供完善的错误恢复机制
 * 集成统一错误处理系统，支持错误分类、报告和恢复
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { createErrorBoundaryHandler } from '../../utils/errorHandler';
import { devError, formatTimestamp } from '../../utils/helpers';
import type { AppError } from '../../types';

// ===== 接口定义 =====

/** 错误边界组件Props */
interface ErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode;
  /** 自定义错误UI */
  fallback?: ReactNode;
  /** 组件名称（用于错误追踪） */
  name?: string;
  /** 重试回调 */
  onRetry?: () => void;
  /** 错误回调 */
  onError?: (error: Error, errorInfo: any) => void;
  /** 是否启用自动重试 */
  enableAutoRetry?: boolean;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 是否显示错误详情 */
  showErrorDetails?: boolean;
}

/** 错误边界组件State */
interface ErrorBoundaryState {
  /** 是否有错误 */
  hasError: boolean;
  /** 错误对象 */
  error?: Error;
  /** 错误信息 */
  errorInfo?: any;
  /** 重试次数 */
  retryCount: number;
  /** 错误发生时间 */
  errorTimestamp?: number;
  /** 错误ID */
  errorId?: string;
}

// ===== 错误边界组件 =====

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorHandler: (error: Error, errorInfo: any) => void;
  private autoRetryTimer?: NodeJS.Timeout;
  
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      retryCount: 0,
    };
    
    // 创建错误处理函数
    this.errorHandler = createErrorBoundaryHandler(props.name || 'ErrorBoundary');
  }
  
  /**
   * 从错误中派生状态
   * @param error - 错误对象
   * @returns 新状态
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorTimestamp: Date.now(),
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }
  
  /**
   * 组件捕获错误时的回调
   * @param error - 错误对象
   * @param errorInfo - 错误信息
   */
  componentDidCatch(error: Error, errorInfo: any): void {
    // 记录错误详情
    devError('[ErrorBoundary] Caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      name: this.props.name,
      retryCount: this.state.retryCount,
    });
    
    // 更新状态
    this.setState({ errorInfo });
    
    // 调用统一错误处理器
    this.errorHandler(error, errorInfo);
    
    // 调用自定义错误回调
    this.props.onError?.(error, errorInfo);
    
    // 检查是否需要自动重试
    this.checkAutoRetry(error);
  }
  
  /**
   * 组件卸载时清理定时器
   */
  componentWillUnmount(): void {
    if (this.autoRetryTimer) {
      clearTimeout(this.autoRetryTimer);
    }
  }
  
  /**
   * 检查是否需要自动重试
   * @param error - 错误对象
   */
  private checkAutoRetry(error: Error): void {
    const { enableAutoRetry = false, maxRetries = 3 } = this.props;
    
    if (!enableAutoRetry || this.state.retryCount >= maxRetries) {
      return;
    }
    
    // 检查是否为可重试的错误
    const isRetryableError = this.isRetryableError(error);
    
    if (isRetryableError) {
      const retryDelay = Math.min(1000 * Math.pow(2, this.state.retryCount), 10000); // 指数退避，最大10秒
      
      devError(`[ErrorBoundary] Auto-retrying in ${retryDelay}ms (attempt ${this.state.retryCount + 1}/${maxRetries})`);
      
      this.autoRetryTimer = setTimeout(() => {
        this.retry();
      }, retryDelay);
    }
  }
  
  /**
   * 判断错误是否可重试
   * @param error - 错误对象
   * @returns 是否可重试
   */
  private isRetryableError(error: Error): boolean {
    const retryablePatterns = [
      'context is not ready',
      'ReactNoCrashSoftException',
      'onWindowFocusChange',
      'network',
      'timeout',
      'connection',
    ];
    
    const nonRetryablePatterns = [
      'Maximum update depth exceeded',
      'setState',
      'infinite loop',
      'ReferenceError',
      'TypeError',
    ];
    
    const errorMessage = error.message?.toLowerCase() || '';
    
    // 检查不可重试的错误
    if (nonRetryablePatterns.some(pattern => errorMessage.includes(pattern.toLowerCase()))) {
      return false;
    }
    
    // 检查可重试的错误
    return retryablePatterns.some(pattern => errorMessage.includes(pattern.toLowerCase()));
  }
  
  /**
   * 重试操作
   */
  private retry = (): void => {
    const { maxRetries = 5 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      devError('[ErrorBoundary] Maximum retry count reached, not retrying');
      return;
    }
    
    devError(`[ErrorBoundary] Attempting retry ${this.state.retryCount + 1}/${maxRetries}`);
    
    // 清除自动重试定时器
    if (this.autoRetryTimer) {
      clearTimeout(this.autoRetryTimer);
      this.autoRetryTimer = undefined;
    }
    
    // 重置状态
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1,
      errorTimestamp: undefined,
      errorId: undefined,
    }));
    
    // 调用重试回调
    this.props.onRetry?.();
  };
  
  /**
   * 重置组件状态
   */
  private reset = (): void => {
    devError('[ErrorBoundary] Resetting error boundary');
    
    // 清除自动重试定时器
    if (this.autoRetryTimer) {
      clearTimeout(this.autoRetryTimer);
      this.autoRetryTimer = undefined;
    }
    
    // 完全重置状态
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
      errorTimestamp: undefined,
      errorId: undefined,
    });
  };
  
  /**
   * 获取错误详情信息
   * @returns 错误详情对象
   */
  private getErrorDetails(): AppError | null {
    const { error, errorInfo, errorTimestamp, errorId } = this.state;
    
    if (!error) return null;
    
    return {
      message: error.message,
      code: error.name,
      details: {
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        errorId,
        componentName: this.props.name,
      },
      timestamp: errorTimestamp || Date.now(),
    };
  }
  
  render(): ReactNode {
    if (this.state.hasError) {
      // 使用自定义错误UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // 渲染默认错误UI
      return <ErrorFallback {...this.getErrorFallbackProps()} />;
    }
    
    return this.props.children;
  }
  
  /**
   * 获取错误回退组件的Props
   * @returns 错误回退组件Props
   */
  private getErrorFallbackProps() {
    const { maxRetries = 5, showErrorDetails = __DEV__ } = this.props;
    const errorDetails = this.getErrorDetails();
    
    return {
      error: this.state.error,
      errorDetails,
      retryCount: this.state.retryCount,
      maxRetries,
      showErrorDetails,
      onRetry: this.retry,
      onReset: this.reset,
      isAutoRetrying: !!this.autoRetryTimer,
    };
  }
}

// ===== 错误回退组件 =====

interface ErrorFallbackProps {
  error?: Error;
  errorDetails?: AppError | null;
  retryCount: number;
  maxRetries: number;
  showErrorDetails: boolean;
  onRetry: () => void;
  onReset: () => void;
  isAutoRetrying: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorDetails,
  retryCount,
  maxRetries,
  showErrorDetails,
  onRetry,
  onReset,
  isAutoRetrying,
}) => {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.colors.background.primary,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.error + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 8,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    errorCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      maxHeight: 200,
      width: '100%',
    },
    errorTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      fontFamily: 'monospace',
      lineHeight: 16,
    },
    errorMeta: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
      marginTop: 8,
      fontStyle: 'italic',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      opacity: isAutoRetrying ? 0.6 : 1,
    },
    resetButton: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    retryText: {
      color: theme.colors.text.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
    resetText: {
      color: theme.colors.text.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    retryInfo: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
      marginTop: 8,
      textAlign: 'center',
    },
  });
  
  return (
    <View style={styles.container}>
      {/* 错误图标 */}
      <View style={styles.iconContainer}>
        <Ionicons name="warning-outline" size={40} color={theme.colors.error} />
      </View>
      
      {/* 错误标题和描述 */}
      <Text style={styles.title}>出现错误</Text>
      <Text style={styles.subtitle}>
        应用遇到了一个意外错误。{'\n'}
        这可能是临时问题，请尝试重新加载。
      </Text>
      
      {/* 错误详情（开发环境） */}
      {showErrorDetails && errorDetails && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>错误详情</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.errorText}>
              {error?.message || '未知错误'}
            </Text>
            {errorDetails.details?.errorId && (
              <Text style={styles.errorMeta}>
                错误ID: {errorDetails.details.errorId}
              </Text>
            )}
            {errorDetails.timestamp && (
              <Text style={styles.errorMeta}>
                发生时间: {formatTimestamp(errorDetails.timestamp)}
              </Text>
            )}
          </ScrollView>
        </View>
      )}
      
      {/* 操作按钮 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          disabled={isAutoRetrying || retryCount >= maxRetries}
        >
          <Ionicons 
            name={isAutoRetrying ? "hourglass-outline" : "refresh-outline"} 
            size={16} 
            color={theme.colors.text.inverse} 
          />
          <Text style={styles.retryText}>
            {isAutoRetrying ? '重试中...' : '重试'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Ionicons name="refresh-circle-outline" size={16} color={theme.colors.text.primary} />
          <Text style={styles.resetText}>重置</Text>
        </TouchableOpacity>
      </View>
      
      {/* 重试信息 */}
      {retryCount > 0 && (
        <Text style={styles.retryInfo}>
          已重试 {retryCount}/{maxRetries} 次
          {isAutoRetrying && ' • 正在自动重试...'}
        </Text>
      )}
    </View>
  );
};

// ===== 高阶组件包装器 =====

/**
 * 错误边界高阶组件
 * @param WrappedComponent - 要包装的组件
 * @param options - 错误边界选项
 * @returns 包装后的组件
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Partial<ErrorBoundaryProps> = {}
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary
      name={WrappedComponent.displayName || WrappedComponent.name}
      {...options}
    >
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  
  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithErrorBoundaryComponent;
}

export default ErrorBoundary;