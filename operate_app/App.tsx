/**
 * OperateApp - 苹果风格高端 React Native 应用
 * 
 * 主应用入口文件 - 优化版
 * 集成了完整的技术栈：React Navigation、Zustand、TanStack Query、MMKV等
 * 
 * @format
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
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

// 创建 QueryClient 实例 - 使用更保守的配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5分钟
      gcTime: 10 * 60 * 1000,   // 10分钟
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// 稳定的Paper主题缓存
let paperThemeCache: any = null;

// 创建 React Native Paper 主题 - 错误安全版
const createPaperTheme = (theme: any) => {
  try {
    if (paperThemeCache && paperThemeCache.mode === theme?.mode) {
      return paperThemeCache.theme;
    }
    
    // 安全获取主题属性，带回退值
    const safeGet = (path: string[], fallback: any) => {
      try {
        let value = theme;
        for (const key of path) {
          value = value?.[key];
          if (value === undefined || value === null) return fallback;
        }
        return value !== undefined ? value : fallback;
      } catch {
        return fallback;
      }
    };
    
    const paperTheme = {
      colors: {
        primary: safeGet(['colors', 'primary'], '#007AFF'),
        onPrimary: safeGet(['colors', 'text', 'inverse'], '#FFFFFF'),
        primaryContainer: safeGet(['colors', 'background', 'secondary'], '#F2F2F7'),
        onPrimaryContainer: safeGet(['colors', 'text', 'primary'], '#000000'),
        secondary: safeGet(['apple', 'systemGray'], '#8E8E93'),
        onSecondary: safeGet(['colors', 'text', 'inverse'], '#FFFFFF'),
        secondaryContainer: safeGet(['colors', 'background', 'secondary'], '#F2F2F7'),
        onSecondaryContainer: safeGet(['colors', 'text', 'secondary'], '#3C3C43'),
        tertiary: safeGet(['apple', 'systemTeal'], '#5AC8FA'),
        onTertiary: safeGet(['colors', 'text', 'inverse'], '#FFFFFF'),
        tertiaryContainer: safeGet(['colors', 'background', 'tertiary'], '#E5E5EA'),
        onTertiaryContainer: safeGet(['colors', 'text', 'tertiary'], '#8E8E93'),
        error: safeGet(['colors', 'error'], '#FF3B30'),
        onError: safeGet(['colors', 'text', 'inverse'], '#FFFFFF'),
        errorContainer: safeGet(['colors', 'background', 'secondary'], '#F2F2F7'),
        onErrorContainer: safeGet(['colors', 'error'], '#FF3B30'),
        background: safeGet(['colors', 'background', 'primary'], '#FFFFFF'),
        onBackground: safeGet(['colors', 'text', 'primary'], '#000000'),
        surface: safeGet(['colors', 'background', 'card'], '#FFFFFF'),
        onSurface: safeGet(['colors', 'text', 'primary'], '#000000'),
        surfaceVariant: safeGet(['colors', 'background', 'secondary'], '#F2F2F7'),
        onSurfaceVariant: safeGet(['colors', 'text', 'secondary'], '#3C3C43'),
        outline: safeGet(['colors', 'border', 'primary'], '#C6C6C8'),
        outlineVariant: safeGet(['colors', 'border', 'secondary'], '#E5E5EA'),
        shadow: theme?.mode === 'dark' ? '#000000' : '#000000',
        scrim: safeGet(['colors', 'surface', 'overlay'], 'rgba(0, 0, 0, 0.4)'),
        inverseSurface: safeGet(['colors', 'text', 'primary'], '#000000'),
        inverseOnSurface: safeGet(['colors', 'background', 'primary'], '#FFFFFF'),
        inversePrimary: safeGet(['colors', 'primary'], '#007AFF'),
        elevation: {
          level0: 'transparent',
          level1: safeGet(['colors', 'background', 'card'], '#FFFFFF'),
          level2: safeGet(['colors', 'background', 'secondary'], '#F2F2F7'),
          level3: safeGet(['colors', 'background', 'tertiary'], '#E5E5EA'),
          level4: safeGet(['colors', 'background', 'secondary'], '#F2F2F7'),
          level5: safeGet(['colors', 'background', 'card'], '#FFFFFF'),
        },
        surfaceDisabled: safeGet(['colors', 'text', 'disabled'], '#C7C7CC'),
        onSurfaceDisabled: safeGet(['colors', 'text', 'disabled'], '#C7C7CC'),
        backdrop: safeGet(['colors', 'surface', 'overlay'], 'rgba(0, 0, 0, 0.4)'),
      },
      fonts: {
        regular: {
          fontFamily: 'System',
          fontWeight: 'normal',
        },
        medium: {
          fontFamily: 'System',
          fontWeight: '500',
        },
        light: {
          fontFamily: 'System',
          fontWeight: '300',
        },
        thin: {
          fontFamily: 'System',
          fontWeight: '100',
        },
        // 添加 Paper 需要的额外字体样式
        bodyLarge: {
          fontFamily: 'System',
          fontSize: 16,
          fontWeight: 'normal',
          lineHeight: 24,
          letterSpacing: 0.5,
        },
        bodyMedium: {
          fontFamily: 'System',
          fontSize: 14,
          fontWeight: 'normal',
          lineHeight: 20,
          letterSpacing: 0.25,
        },
        bodySmall: {
          fontFamily: 'System',
          fontSize: 12,
          fontWeight: 'normal',
          lineHeight: 16,
          letterSpacing: 0.4,
        },
        labelLarge: {
          fontFamily: 'System',
          fontSize: 14,
          fontWeight: '500',
          lineHeight: 20,
          letterSpacing: 0.1,
        },
        titleMedium: {
          fontFamily: 'System',
          fontSize: 16,
          fontWeight: '500',
          lineHeight: 24,
          letterSpacing: 0.15,
        },
        titleLarge: {
          fontFamily: 'System',
          fontSize: 22,
          fontWeight: 'normal',
          lineHeight: 28,
          letterSpacing: 0,
        },
        titleSmall: {
          fontFamily: 'System',
          fontSize: 14,
          fontWeight: '500',
          lineHeight: 20,
          letterSpacing: 0.1,
        },
        headlineLarge: {
          fontFamily: 'System',
          fontSize: 32,
          fontWeight: 'normal',
          lineHeight: 40,
          letterSpacing: 0,
        },
        headlineMedium: {
          fontFamily: 'System',
          fontSize: 28,
          fontWeight: 'normal',
          lineHeight: 36,
          letterSpacing: 0,
        },
        headlineSmall: {
          fontFamily: 'System',
          fontSize: 24,
          fontWeight: 'normal',
          lineHeight: 32,
          letterSpacing: 0,
        },
        labelMedium: {
          fontFamily: 'System',
          fontSize: 12,
          fontWeight: '500',
          lineHeight: 16,
          letterSpacing: 0.5,
        },
        labelSmall: {
          fontFamily: 'System',
          fontSize: 11,
          fontWeight: '500',
          lineHeight: 16,
          letterSpacing: 0.5,
        },
      },
    };
    
    paperThemeCache = {
      mode: theme?.mode || 'light',
      theme: paperTheme,
    };
    
    return paperTheme;
  } catch (error) {
    console.error('[App] Error creating Paper theme:', error);
    // 返回最基础的主题
    return {
      colors: {
        primary: '#007AFF',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#000000',
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: 'normal' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        light: { fontFamily: 'System', fontWeight: '300' },
        thin: { fontFamily: 'System', fontWeight: '100' },
        bodyLarge: { fontFamily: 'System', fontSize: 16, fontWeight: 'normal', lineHeight: 24, letterSpacing: 0.5 },
        bodyMedium: { fontFamily: 'System', fontSize: 14, fontWeight: 'normal', lineHeight: 20, letterSpacing: 0.25 },
        bodySmall: { fontFamily: 'System', fontSize: 12, fontWeight: 'normal', lineHeight: 16, letterSpacing: 0.4 },
        labelLarge: { fontFamily: 'System', fontSize: 14, fontWeight: '500', lineHeight: 20, letterSpacing: 0.1 },
        titleMedium: { fontFamily: 'System', fontSize: 16, fontWeight: '500', lineHeight: 24, letterSpacing: 0.15 },
      },
    };
  }
};

// 主应用组件 - 超级防护版
function App() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const initializationStarted = useRef(false);
  const mountedRef = useRef(false);

  // 正确使用主题Hook - 在组件顶层调用
  let theme: any;
  try {
    theme = useTheme();
  } catch (error) {
    console.error('[App] Theme hook failed:', error);
    // 使用完整的回退主题
    theme = {
      colors: {
        primary: '#007AFF',
        background: { 
          primary: '#FFFFFF',
          secondary: '#F2F2F7',
          tertiary: '#E5E5EA',
          card: '#FFFFFF'
        },
        text: { 
          inverse: '#FFFFFF', 
          primary: '#000000',
          secondary: '#3C3C43',
          tertiary: '#8E8E93',
          disabled: '#C7C7CC'
        },
        border: {
          primary: '#C6C6C8',
          secondary: '#E5E5EA'
        },
        surface: {
          overlay: 'rgba(0, 0, 0, 0.4)'
        },
        error: '#FF3B30',
        success: '#34C759',
        warning: '#FF9500',
        info: '#5AC8FA'
      },
      apple: {
        systemGray: '#8E8E93',
        systemTeal: '#5AC8FA',
        systemGray5: '#E5E5EA'
      },
      mode: 'light',
      typography: {
        headline: {
          fontSize: 24,
          fontWeight: 'bold',
        },
        body: {
          fontSize: 16,
          fontWeight: 'normal',
        },
        caption: {
          fontSize: 12,
          fontWeight: 'normal',
        },
      },
      borderWidth: {
        hairline: 0.5,
        regular: 1,
      },
      borderRadius: {
        button: 8,
      },
      componentShadows: {
        tabBar: {
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        button: {
          default: {
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
        },
      },
      componentSpacing: {
        button: {
          horizontal: 16,
          vertical: 12,
          small: {
            horizontal: 12,
            vertical: 8,
          },
          large: {
            horizontal: 20,
            vertical: 16,
          },
        },
      },
      fontCombinations: {
        button: {
          small: { fontSize: 14, fontWeight: '600' },
          medium: { fontSize: 16, fontWeight: '600' },
          large: { fontSize: 18, fontWeight: '600' },
        },
      },
    };
  }

  // 缓存Paper主题，使用useCallback确保稳定性
  const paperTheme = useCallback(() => {
    if (!theme) return { colors: { primary: '#007AFF' } };
    return createPaperTheme(theme);
  }, [theme?.mode]);

  // 应用初始化 - 超级防护版
  useEffect(() => {
    // 防止重复初始化
    if (initializationStarted.current) {
      return;
    }
    initializationStarted.current = true;
    mountedRef.current = true;

    const initializeApp = async () => {
      try {
        console.log('[App] Initializing application...');
        
        // 分步骤初始化，每步检查组件是否仍挂载
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!mountedRef.current) return;
        
        // 检查是否首次启动
        try {
          if (StorageUtils.isFirstLaunch()) {
            console.log('[App] First launch detected');
            StorageUtils.setFirstLaunch(false);
          }
        } catch (storageError) {
          console.warn('[App] Storage check failed:', storageError);
        }
        if (!mountedRef.current) return;

        // 延迟设置ready状态，确保所有初始化完成
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!mountedRef.current) return;
        
        setIsReady(true);
        console.log('[App] Application initialized successfully');
      } catch (error) {
        console.error('[App] Failed to initialize application:', error);
        if (mountedRef.current) {
          setInitError(error instanceof Error ? error.message : 'Unknown error');
          setIsReady(true); // 即使初始化失败也要显示应用
        }
      }
    };

    // 延迟执行初始化
    const timeoutId = setTimeout(initializeApp, 100);
    
    return () => {
      clearTimeout(timeoutId);
      mountedRef.current = false;
    };
  }, []); // 移除theme依赖

  // 状态栏配置 - 安全版
  useEffect(() => {
    try {
      const isDark = theme.mode === 'dark';
      StatusBar.setBarStyle(
        isDark ? 'light-content' : 'dark-content',
        true
      );
      
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(theme.colors.background.primary, true);
      }
    } catch (error) {
      console.error('[App] StatusBar configuration failed:', error);
    }
  }, [theme?.mode]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
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
        <PaperProvider theme={paperTheme()}>
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
