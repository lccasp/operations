/**
 * 简化版导航器 - 用于测试
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

// 简化的启动页
const SimpleSplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>专网综合网管</Text>
      <Text style={styles.subtitle}>掌上运维平台</Text>
      <Text style={styles.loading}>应用启动中...</Text>
    </View>
  );
};

// 简化的主页
const SimpleHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>主页</Text>
      <Text style={styles.subtitle}>应用已成功启动</Text>
    </View>
  );
};

const SimpleNavigator: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SimpleSplashScreen} />
          <Stack.Screen name="Home" component={SimpleHomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 32,
  },
  loading: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default SimpleNavigator;
