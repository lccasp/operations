/**
 * 错误页面
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>出现错误</Text>
      <Text style={styles.message}>请重试或联系客服</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
});

export default ErrorScreen;
