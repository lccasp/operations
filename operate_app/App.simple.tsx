/**
 * 简化版 App.tsx - 用于测试无限循环修复
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, Platform, LogBox, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';

// 导入核心组件
import SimpleNavigator from './src/navigation/SimpleNavigator';

// 导入错误边界
import ErrorBoundary from './src/components/common/ErrorBoundary';

// 开发环境配置
if (__DEV__) {
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
    'Setting a timer for a long period of time',
    'Maximum update depth exceeded',
    'Tried to access onWindowFocusChange while context is not ready',
    'Tried to remove non-existent frame callback',
    'ReactNoCrashSoftException',
  ]);
}

// 创建简化的 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60000,
      gcTime: 120000,
    },
    mutations: {
      retry: 0,
    },
  },
});

// 简化的Paper主题
const simplePaperTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
  },
};

// 简化的主应用组件
function App() {
  const [isReady, setIsReady] = useState(false);

  // 简化的初始化逻辑
  useEffect(() => {
    const initApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsReady(true);
    };
    
    initApp();
  }, []);

  // 加载页面
  if (!isReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#007AFF' 
      }}>
        <Text style={{ 
          color: '#FFFFFF', 
          fontSize: 24, 
          fontWeight: 'bold',
          marginBottom: 16 
        }}>
          专网综合网管
        </Text>
        <Text style={{ 
          color: '#FFFFFF', 
          fontSize: 16,
          marginBottom: 32 
        }}>
          掌上运维平台
        </Text>
        <Text style={{ 
          color: '#FFFFFF', 
          fontSize: 14 
        }}>
          正在初始化应用...
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={simplePaperTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="#FFFFFF"
              translucent={Platform.OS === 'android'}
            />
            <SimpleNavigator />
          </GestureHandlerRootView>
        </PaperProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
