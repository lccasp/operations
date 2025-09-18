/**
 * OperateApp - 苹果风格高端 React Native 应用
 * 
 * 主应用入口文件
 * 集成了完整的技术栈：React Navigation、Zustand、TanStack Query、MMKV等
 * 
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, Platform, AppState, LogBox, View, Text } from 'react-native';
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
    'Tried to access onWindowFocusChange while context is not ready',
    'Tried to remove non-existent frame callback',
    'ReactNoCrashSoftException',
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

// 缓存Paper主题对象
const paperThemeCache = new Map<string, any>();

// 创建 React Native Paper 主题
const createPaperTheme = (theme: any) => {
  const cacheKey = theme.mode;
  
  if (paperThemeCache.has(cacheKey)) {
    return paperThemeCache.get(cacheKey);
  }
  
  const paperTheme = {
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
  };
  
  paperThemeCache.set(cacheKey, paperTheme);
  return paperTheme;
};

// 主应用组件
function App() {
  const theme = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const initializationStarted = useRef(false);

  // 缓存Paper主题，避免重复创建
  const paperTheme = React.useMemo(() => createPaperTheme(theme), [theme.mode]);

  // 应用初始化 - 只执行一次
  useEffect(() => {
    // 防止重复初始化
    if (initializationStarted.current) {
      return;
    }
    initializationStarted.current = true;

    const initializeApp = async () => {
      try {
        console.log('[App] Initializing application...');
        
        // 等待一小段时间确保React Native完全初始化
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 检查是否首次启动
        if (StorageUtils.isFirstLaunch()) {
          console.log('[App] First launch detected');
          StorageUtils.setFirstLaunch(false);
        }

        // 其他初始化逻辑可以在这里添加
        // 例如：检查更新、初始化分析工具、设置推送通知等
        
        // 延迟设置ready状态，确保所有初始化完成
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setIsReady(true);
        console.log('[App] Application initialized successfully');
      } catch (error) {
        console.error('[App] Failed to initialize application:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
        setIsReady(true); // 即使初始化失败也要显示应用
      }
    };

    initializeApp();
  }, []); // 确保只在组件挂载时运行一次

  // 状态栏配置
  useEffect(() => {
    try {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(false);
      }
    } catch (error) {
      console.error('[App] StatusBar configuration error:', error);
    }
  }, []);

  // 如果应用尚未就绪，显示加载屏幕
  if (!isReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.colors.primary 
      }}>
        <Text style={{ 
          color: theme.colors.text.inverse, 
          fontSize: 24, 
          fontWeight: 'bold',
          marginBottom: 16 
        }}>
          专网综合网管
        </Text>
        <Text style={{ 
          color: theme.colors.text.inverse, 
          fontSize: 16,
          marginBottom: 32 
        }}>
          掌上运维平台
        </Text>
        <Text style={{ 
          color: theme.colors.text.inverse, 
          fontSize: 14 
        }}>
          正在初始化应用...
        </Text>
        {initError && (
          <Text style={{ 
            color: '#FF3B30', 
            fontSize: 12, 
            marginTop: 16,
            textAlign: 'center',
            paddingHorizontal: 20
          }}>
            初始化错误: {initError}
          </Text>
        )}
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={paperTheme}>
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