/**
 * 忘记密码页面
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import Button from '../../components/ui/Button';
import type { AuthScreenProps } from '../../types/navigation';

const ForgotPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<AuthScreenProps<'ForgotPassword'>['navigation']>();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendReset = async () => {
    try {
      setLoading(true);
      // 模拟发送重置邮件
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSent(true);
    } catch (error) {
      console.error('Failed to send reset email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (sent) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            邮件已发送
          </Text>
          <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
            我们已向您的邮箱发送了重置密码的链接，请查收邮件并按照指示重置密码。
          </Text>
          
          <Button
            title="返回登录"
            variant="primary"
            fullWidth
            onPress={handleBackToLogin}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          重置密码
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          输入您的邮箱地址，我们将发送重置密码的链接
        </Text>
      </View>

      <View style={styles.form}>
        {/* 这里可以添加邮箱输入框组件 */}
        <Text style={[styles.fieldLabel, { color: theme.colors.text.primary }]}>
          邮箱地址: {email || 'user@example.com'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="发送重置链接"
          variant="primary"
          fullWidth
          loading={loading}
          onPress={handleSendReset}
          style={styles.button}
        />

        <Button
          title="返回登录"
          variant="ghost"
          onPress={handleBackToLogin}
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  form: {
    marginBottom: 40,
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

export default ForgotPasswordScreen;
