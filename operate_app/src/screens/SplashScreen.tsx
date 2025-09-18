/**
 * 启动页面
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme';
import { useAuth, useApp, useAppActions } from '../store';
import type { RootScreenProps } from '../types/navigation';

const SplashScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<RootScreenProps<'Splash'>['navigation']>();
  const { isAuthenticated } = useAuth();
  const { onboardingCompleted } = useApp();
  const { setOnboardingCompleted } = useAppActions();
  
  // 使用 ref 来防止重复执行
  const hasNavigated = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationStarted = useRef(false);

  useEffect(() => {
    // 防止重复初始化
    if (initializationStarted.current || hasNavigated.current) {
      return;
    }
    initializationStarted.current = true;

    const initializeApp = async () => {
      console.log('[SplashScreen] Starting app initialization...');
      
      // 等待一小段时间确保状态初始化完成
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsInitialized(true);
      console.log('[SplashScreen] App initialization completed');
    };

    initializeApp();
  }, []);

  // 在状态初始化完成后处理导航 - 使用缓存的依赖项
  useEffect(() => {
    if (!isInitialized || hasNavigated.current) {
      return;
    }

    const navigateToNextScreen = async () => {
      console.log('[SplashScreen] Auth state:', { isAuthenticated, onboardingCompleted });
      
      // 设置已导航标志，防止重复导航
      hasNavigated.current = true;
      
      // 额外等待时间确保用户看到启动页
      await new Promise(resolve => setTimeout(resolve, 1500));

      try {
        // 根据应用状态决定导航到哪里
        if (isAuthenticated && onboardingCompleted) {
          console.log('[SplashScreen] Navigating to Main');
          navigation.replace('Main');
        } else if (isAuthenticated && !onboardingCompleted) {
          console.log('[SplashScreen] Navigating to Onboarding');
          navigation.replace('Onboarding');
        } else {
          // 首次使用或未登录，设置引导完成状态并进入认证
          console.log('[SplashScreen] Setting onboarding completed and navigating to Auth');
          setOnboardingCompleted(true);
          navigation.replace('Auth');
        }
      } catch (error) {
        console.error('[SplashScreen] Navigation error:', error);
        // 出错时回退到认证页面
        navigation.replace('Auth');
      }
    };

    // 使用setTimeout避免直接在useEffect中进行状态更新
    const timeoutId = setTimeout(navigateToNextScreen, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isInitialized]); // 只依赖于isInitialized，其他状态通过闭包捕获

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.inverse }]}>
        专网综合网管
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.inverse }]}>
        掌上运维平台
      </Text>
      
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={theme.colors.text.inverse} 
        />
        <Text style={[styles.loadingText, { color: theme.colors.text.inverse }]}>
          {isInitialized ? '启动中...' : '正在初始化...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 60,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});

export default SplashScreen;