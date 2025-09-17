/**
 * 认证导航器
 * 管理登录、注册等认证相关页面的导航
 */

import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useTheme } from '../theme';
import type { AuthStackParamList } from '../types/navigation';

// 导入页面组件
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
      
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          headerTitle: '重置密码',
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
      
      <Stack.Screen
        name="ResetPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          headerTitle: '设置新密码',
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
      
      <Stack.Screen
        name="VerifyEmail"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          headerTitle: '验证邮箱',
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
    </Stack.Navigator>
  );
};

export default AuthNavigator;
