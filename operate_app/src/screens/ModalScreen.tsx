/**
 * 模态页面
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ModalScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>模态页面</Text>
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
  },
});

export default ModalScreen;
