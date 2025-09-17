/**
 * 加载状态提供组件
 */

import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface Props {
  children: ReactNode;
}

const LoadingProvider: React.FC<Props> = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

export default LoadingProvider;
