/**
 * OperateApp - 苹果风格高端 React Native 应用
 * 
 * 主应用入口文件
 * 集成了完整的技术栈：React Navigation、Zustand、TanStack Query、MMKV等
 * 
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, AppState, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';

// 导入核心组件
import RootNavigator from './src/navigation/RootNavigator';
import { useTheme } from './src/theme';
import { StorageUtils } from './src/utils/storage';

// 导入错误边界
import ErrorBoundary from './src/components/common/ErrorBoundary';
import LoadingProvider from './src/components/common/LoadingProvider';
import NotificationProvider from './src/components/common/NotificationProvider';

// 开发环境配置
if (__DEV__) {
  // 忽略特定警告
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
    'Setting a timer for a long period of time',
    'Maximum update depth exceeded',
  ]);
}

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5分钟
      gcTime: 10 * 60 * 1000,   // 10分钟 (原 cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// 创建 React Native Paper 主题
const createPaperTheme = (theme: any) => ({
  colors: {
    primary: theme.colors.primary,
    onPrimary: theme.colors.text.inverse,
    primaryContainer: theme.colors.background.secondary,
    onPrimaryContainer: theme.colors.text.primary,
    secondary: theme.apple.systemGray,
    onSecondary: theme.colors.text.inverse,
    secondaryContainer: theme.colors.background.secondary,
    onSecondaryContainer: theme.colors.text.secondary,
    tertiary: theme.apple.systemTeal,
    onTertiary: theme.colors.text.inverse,
    tertiaryContainer: theme.colors.background.tertiary,
    onTertiaryContainer: theme.colors.text.tertiary,
    error: theme.colors.error,
    onError: theme.colors.text.inverse,
    errorContainer: theme.colors.background.secondary,
    onErrorContainer: theme.colors.error,
    background: theme.colors.background.primary,
    onBackground: theme.colors.text.primary,
    surface: theme.colors.background.card,
    onSurface: theme.colors.text.primary,
    surfaceVariant: theme.colors.background.secondary,
    onSurfaceVariant: theme.colors.text.secondary,
    outline: theme.colors.border.primary,
    outlineVariant: theme.colors.border.secondary,
    shadow: theme.mode === 'dark' ? '#000000' : '#000000',
    scrim: theme.colors.surface.overlay,
    inverseSurface: theme.colors.text.primary,
    inverseOnSurface: theme.colors.background.primary,
    inversePrimary: theme.colors.primary,
    elevation: {
      level0: 'transparent',
      level1: theme.colors.background.card,
      level2: theme.colors.background.secondary,
      level3: theme.colors.background.tertiary,
      level4: theme.colors.background.secondary,
      level5: theme.colors.background.card,
    },
    surfaceDisabled: theme.colors.text.disabled,
    onSurfaceDisabled: theme.colors.text.disabled,
    backdrop: theme.colors.surface.overlay,
  },
  fonts: {
    // 可以在这里配置字体
  },
});

// 主应用组件
function App() {
  const theme = useTheme();
  const [isReady, setIsReady] = useState(false);

  // 应用初始化
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[App] Initializing application...');
        
        // 检查是否首次启动
        if (StorageUtils.isFirstLaunch()) {
          console.log('[App] First launch detected');
          StorageUtils.setFirstLaunch(false);
        }

        // 其他初始化逻辑可以在这里添加
        // 例如：检查更新、初始化分析工具、设置推送通知等
        
        setIsReady(true);
        console.log('[App] Application initialized successfully');
      } catch (error) {
        console.error('[App] Failed to initialize application:', error);
        setIsReady(true); // 即使初始化失败也要显示应用
      }
    };

    initializeApp();
  }, []);

  // 状态栏配置
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(false);
    }
  }, []);

  // 如果应用尚未就绪，可以显示加载屏幕
  if (!isReady) {
    // 这里可以返回一个简单的加载组件
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={createPaperTheme(theme)}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <LoadingProvider>
              <NotificationProvider>
                <StatusBar
                  barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
                  backgroundColor={theme.colors.background.primary}
                  translucent={Platform.OS === 'android'}
                />
                <RootNavigator />
              </NotificationProvider>
            </LoadingProvider>
          </GestureHandlerRootView>
        </PaperProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;