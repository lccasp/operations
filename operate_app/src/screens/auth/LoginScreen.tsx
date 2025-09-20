/**
 * 登录页面 - 苹果风格设计
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuthActions } from '../../store';
import Button from '../../components/ui/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { AuthScreenProps } from '../../types/navigation';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<AuthScreenProps<'Login'>['navigation']>();
  const { login } = useAuthActions();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    
    try {
      setLoading(true);
      Keyboard.dismiss();
      await login(email || 'demo@example.com', password || 'password');
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo区域 */}
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="cube-outline" size={60} color={theme.colors.text.inverse} />
            </View>
            <Text style={[styles.appName, { color: theme.colors.text.primary }]}>
              运维管理平台
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.text.secondary }]}>
              专网综合网管掌上运维
            </Text>
          </View>

          {/* 表单区域 */}
          <View style={styles.form}>
            {/* 邮箱输入 */}
            <View style={[
              styles.inputContainer, 
              { 
                backgroundColor: theme.colors.background.secondary,
                borderColor: emailFocused ? theme.colors.primary : 'transparent',
              }
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={emailFocused ? theme.colors.primary : theme.colors.text.tertiary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text.primary }]}
                placeholder="邮箱地址"
                placeholderTextColor={theme.colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* 密码输入 */}
            <View style={[
              styles.inputContainer, 
              { 
                backgroundColor: theme.colors.background.secondary,
                borderColor: passwordFocused ? theme.colors.primary : 'transparent',
              }
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={passwordFocused ? theme.colors.primary : theme.colors.text.tertiary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text.primary }]}
                placeholder="密码"
                placeholderTextColor={theme.colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={theme.colors.text.tertiary} 
                />
              </TouchableOpacity>
            </View>

            {/* 忘记密码 */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
              <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
                忘记密码？
              </Text>
            </TouchableOpacity>
          </View>

          {/* 登录按钮 */}
          <View style={styles.buttonContainer}>
            <Button
              title="登录"
              variant="primary"
              fullWidth
              loading={loading}
              onPress={handleLogin}
              disabled={!email || !password}
              style={styles.loginButton}
            />
          </View>

          {/* 分割线 */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.colors.border.secondary }]} />
            <Text style={[styles.dividerText, { color: theme.colors.text.tertiary }]}>
              或
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.border.secondary }]} />
          </View>

          {/* 快速登录 */}
          <View style={styles.quickLogin}>
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: theme.colors.background.secondary }]}
              onPress={() => {
                setEmail('demo@example.com');
                setPassword('password');
              }}
            >
              <Ionicons name="flash-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.socialButtonText, { color: theme.colors.text.primary }]}>
                使用演示账号
              </Text>
            </TouchableOpacity>
          </View>

          {/* 注册提示 */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: theme.colors.text.secondary }]}>
              还没有账号？
            </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                立即注册
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 32,
  },
  loginButton: {
    height: 56,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  quickLogin: {
    marginBottom: 48,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontWeight: '400',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default LoginScreen;