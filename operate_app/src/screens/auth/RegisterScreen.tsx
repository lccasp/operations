/**
 * 注册页面
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuthActions } from '../../store';
import Button from '../../components/ui/Button';
import type { AuthScreenProps } from '../../types/navigation';

const RegisterScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<AuthScreenProps<'Register'>['navigation']>();
  const { register } = useAuthActions();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await register({
        name: formData.name || '新用户',
        email: formData.email || 'newuser@example.com',
        password: formData.password || 'password123',
      });
      // 注册成功后导航会自动处理
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          注册
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          创建您的新账号
        </Text>
      </View>

      <View style={styles.form}>
        {/* 这里可以添加输入框组件 */}
        <Text style={[styles.fieldLabel, { color: theme.colors.text.primary }]}>
          姓名: {formData.name || '新用户'}
        </Text>
        <Text style={[styles.fieldLabel, { color: theme.colors.text.primary }]}>
          邮箱: {formData.email || 'newuser@example.com'}
        </Text>
        <Text style={[styles.fieldLabel, { color: theme.colors.text.primary }]}>
          密码: {formData.password || 'password123'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="注册"
          variant="primary"
          fullWidth
          loading={loading}
          onPress={handleRegister}
          style={styles.button}
        />

        <Button
          title="已有账号？立即登录"
          variant="ghost"
          onPress={handleLogin}
          style={styles.button}
        />
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
});

export default RegisterScreen;
