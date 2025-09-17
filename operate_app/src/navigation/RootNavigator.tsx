/**
 * 根导航器
 * 管理应用的整体导航流程
 */

import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
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
  
  console.log('[RootNavigator] Auth state:', { isAuthenticated, onboardingCompleted });

  // 初始化认证状态
  useEffect(() => {
    console.log('[RootNavigator] Initializing auth...');
    try {
      initializeAuth();
      console.log('[RootNavigator] Auth initialization completed');
    } catch (error) {
      console.error('[RootNavigator] Auth initialization failed:', error);
    }
  }, [initializeAuth]);

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