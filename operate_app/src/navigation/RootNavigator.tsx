/**
 * 根导航器
 * 管理应用的整体导航流程
 */

import React, { useEffect } from 'react';
import { StatusBar, Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '../theme';
import { useAuth, useApp, useAuthActions } from '../store';
import type { RootStackParamList } from '../types/navigation';

// 直接导入页面组件（避免懒加载问题）
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ModalScreen from '../screens/ModalScreen';
import ErrorScreen from '../screens/ErrorScreen';

const Stack = createStackNavigator<RootStackParamList>();

// 导航主题配置
const getNavigationTheme = (theme: any) => ({
  dark: theme.mode === 'dark',
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background.primary,
    card: theme.colors.background.card,
    text: theme.colors.text.primary,
    border: theme.colors.border.secondary,
    notification: theme.colors.error,
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
  },
});

// 屏幕过渡动画配置
const getScreenOptions = (theme: any) => ({
  headerShown: false,
  gestureEnabled: Platform.OS === 'ios',
  cardOverlayEnabled: true,
  cardStyle: {
    backgroundColor: theme.colors.background.primary,
  },
  ...TransitionPresets.SlideFromRightIOS,
});

// 模态屏幕过渡动画
const getModalScreenOptions = (theme: any) => ({
  headerShown: false,
  gestureEnabled: true,
  cardOverlayEnabled: true,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  ...TransitionPresets.ModalPresentationIOS,
});

export const RootNavigator: React.FC = () => {
  console.log('[RootNavigator] Starting to render...');
  
  const theme = useTheme();
  console.log('[RootNavigator] Theme loaded:', theme.mode);
  
  const { isAuthenticated } = useAuth();
  const { onboardingCompleted, appState } = useApp();
  const { initializeAuth } = useAuthActions();
  
  const [isInitialized, setIsInitialized] = React.useState(false);
  const initTimeoutRef = React.useRef<NodeJS.Timeout>();
  const initializationStarted = React.useRef(false);
  
  console.log('[RootNavigator] Auth state:', { isAuthenticated, onboardingCompleted, isInitialized });

  // 初始化认证状态 - 只执行一次
  useEffect(() => {
    // 防止重复初始化
    if (initializationStarted.current) {
      return;
    }
    initializationStarted.current = true;
    
    console.log('[RootNavigator] Initializing auth...');
    
    const initializeWithTimeout = async () => {
      try {
        // 等待一小段时间确保React Native完全准备好
        await new Promise(resolve => setTimeout(resolve, 300));
        
        initializeAuth();
        console.log('[RootNavigator] Auth initialization completed');
        
        // 设置超时以防止无限等待
        initTimeoutRef.current = setTimeout(() => {
          console.log('[RootNavigator] Initialization timeout, proceeding anyway...');
          if (!isInitialized) {
            setIsInitialized(true);
          }
        }, 3000);
        
        // 延迟设置初始化完成状态
        setTimeout(() => {
          setIsInitialized(true);
        }, 500);
      } catch (error) {
        console.error('[RootNavigator] Auth initialization failed:', error);
        setIsInitialized(true); // 即使失败也要继续
      }
    };
    
    initializeWithTimeout();
    
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []); // 确保只在组件挂载时运行一次

  // 状态栏配置
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
      console.error('[RootNavigator] StatusBar configuration failed:', error);
    }
  }, [theme]);

  // 应用状态变化处理
  useEffect(() => {
    // 当应用进入后台时，可以执行一些清理操作
    if (appState === 'background') {
      console.log('[Navigation] App entered background');
    }
  }, [appState]);

  // 获取初始路由
  const getInitialRouteName = (): keyof RootStackParamList => {
    // 默认显示启动页，让启动页处理导航逻辑
    return 'Splash';
  };

  // 如果还未初始化，显示简单的加载界面
  if (!isInitialized) {
    return (
      <SafeAreaProvider>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: theme.colors.background.primary 
        }}>
          <Text style={{ 
            color: theme.colors.text.primary, 
            fontSize: 16,
            marginBottom: 20
          }}>
            正在初始化...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  console.log('[RootNavigator] About to render NavigationContainer...');

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={getNavigationTheme(theme)}>
        <Stack.Navigator
          initialRouteName={getInitialRouteName()}
          screenOptions={getScreenOptions(theme)}
        >
          {/* 启动页 */}
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
          
          {/* 引导页 */}
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          
          {/* 认证流程 */}
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              headerShown: false,
            }}
          />
          
          {/* 主应用 */}
          <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{
              headerShown: false,
            }}
          />
          
          {/* 模态页面 */}
          <Stack.Group screenOptions={getModalScreenOptions(theme)}>
            <Stack.Screen
              name="Modal"
              component={ModalScreen}
            />
          </Stack.Group>
          
          {/* 全屏页面 */}
          <Stack.Group screenOptions={{
            ...getScreenOptions(theme),
            presentation: 'modal',
          }}>
            <Stack.Screen
              name="FullScreen"
              component={ModalScreen} // 复用模态组件
            />
          </Stack.Group>
          
          {/* 错误页面 */}
          <Stack.Screen
            name="Error"
            component={ErrorScreen}
            options={{
              gestureEnabled: false,
              headerShown: true,
              headerTitle: '出现错误',
              headerStyle: {
                backgroundColor: theme.colors.background.card,
              },
              headerTitleStyle: {
                color: theme.colors.text.primary,
                ...theme.typography.headline,
              },
              headerTintColor: theme.colors.primary,
            }}
          />
          
          {/* 维护页面 */}
          <Stack.Screen
            name="Maintenance"
            component={ErrorScreen}
            options={{
              gestureEnabled: false,
              headerShown: true,
              headerTitle: '系统维护',
              headerStyle: {
                backgroundColor: theme.colors.background.card,
              },
              headerTitleStyle: {
                color: theme.colors.text.primary,
                ...theme.typography.headline,
              },
            }}
          />
          
          {/* 网络错误页面 */}
          <Stack.Screen
            name="NetworkError"
            component={ErrorScreen}
            options={{
              gestureEnabled: false,
              headerShown: true,
              headerTitle: '网络连接失败',
              headerStyle: {
                backgroundColor: theme.colors.background.card,
              },
              headerTitleStyle: {
                color: theme.colors.text.primary,
                ...theme.typography.headline,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootNavigator;