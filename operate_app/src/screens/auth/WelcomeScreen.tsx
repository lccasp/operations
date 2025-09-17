/**
 * 欢迎页面
 * 认证流程的入口页面
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import Button from '../../components/ui/Button';
import type { AuthScreenProps } from '../../types/navigation';

const WelcomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<AuthScreenProps<'Welcome'>['navigation']>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          欢迎使用 Operate App
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          开始您的数字化操作之旅
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="登录"
          variant="primary"
          fullWidth
          onPress={handleLogin}
          style={styles.button}
        />
        
        <Button
          title="注册账号"
          variant="outline"
          fullWidth
          onPress={handleRegister}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
});

export default WelcomeScreen;
