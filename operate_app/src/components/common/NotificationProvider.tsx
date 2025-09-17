/**
 * 通知提供组件
 */

import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface Props {
  children: ReactNode;
}

const NotificationProvider: React.FC<Props> = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

export default NotificationProvider;
