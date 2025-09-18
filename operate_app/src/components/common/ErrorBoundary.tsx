/**
 * 错误边界组件
 * 捕获和处理 React 组件树中的错误
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    
    // 检查是否是setState循环错误
    const isStateLoopError = error.message?.includes('Maximum update depth exceeded') ||
                           error.message?.includes('setState') ||
                           error.message?.includes('infinite loops');
    
    if (isStateLoopError) {
      console.error('[ErrorBoundary] Detected infinite setState loop, stopping retries');
      this.setState({ 
        errorInfo,
        retryCount: 999 // 阻止进一步重试
      });
      return;
    }
    
    // 过滤React Host上下文错误，这些通常是临时的
    const isContextError = error.message?.includes('context is not ready') ||
                          error.message?.includes('ReactNoCrashSoftException') ||
                          error.message?.includes('onWindowFocusChange');
    
    if (isContextError && this.state.retryCount < 3) {
      console.log('[ErrorBoundary] Context error detected, attempting retry...');
      setTimeout(() => {
        this.retry();
      }, 1000);
      return;
    }
    
    this.setState({ errorInfo });
  }

  retry = () => {
    // 阻止在setState循环错误时进行重试
    if (this.state.retryCount >= 5) {
      console.log('[ErrorBoundary] Maximum retry count reached, not retrying');
      return;
    }
    
    console.log('[ErrorBoundary] Attempting retry', this.state.retryCount + 1);
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: this.state.retryCount + 1 
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  reset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: 0 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>出现错误</Text>
          <Text style={styles.message}>
            应用遇到了一个错误。这可能是临时问题，请尝试重新加载。
          </Text>
          
          {__DEV__ && this.state.error && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorText}>
                错误详情: {this.state.error.message}
              </Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.retryButton} onPress={this.retry}>
            <Text style={styles.retryText}>重试 ({this.state.retryCount}/5)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetButton} onPress={this.reset}>
            <Text style={styles.resetText}>重置</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  errorDetails: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    maxHeight: 100,
  },
  errorText: {
    fontSize: 12,
    color: '#c62828',
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary;
