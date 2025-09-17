/**
 * 登录页面
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuthActions } from '../../store';
import Button from '../../components/ui/Button';
import type { AuthScreenProps } from '../../types/navigation';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<AuthScreenProps<'Login'>['navigation']>();
  const { login } = useAuthActions();
  
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
      // 登录成功后导航会自动处理
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleDevSkip = () => {
    if (__DEV__) {
      Alert.alert(
        '开发环境登录',
        '是否跳过登录验证直接进入应用？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '确定',
            onPress: async () => {
              try {
                setLoading(true);
                // 使用演示账号直接登录
                await login('demo@example.com', 'password');
              } catch (error) {
                console.error('Dev login failed:', error);
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          登录
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          登录您的账号
        </Text>
      </View>

      <View style={styles.form}>
        {/* 这里可以添加输入框组件 */}
        <Text style={[styles.fieldLabel, { color: theme.colors.text.primary }]}>
          邮箱: {email}
        </Text>
        <Text style={[styles.fieldLabel, { color: theme.colors.text.primary }]}>
          密码: {password}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="登录"
          variant="primary"
          fullWidth
          loading={loading}
          onPress={handleLogin}
          style={styles.button}
        />

        <Button
          title="忘记密码？"
          variant="link"
          onPress={handleForgotPassword}
          style={styles.linkButton}
        />

        <Button
          title="还没有账号？立即注册"
          variant="ghost"
          onPress={handleRegister}
          style={styles.button}
        />
        
        {__DEV__ && (
          <Button
            title="🚀 开发环境快速登录"
            variant="secondary"
            onPress={handleDevSkip}
            style={[styles.button, styles.devButton]}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 16,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  linkButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  devButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
});

export default LoginScreen;
