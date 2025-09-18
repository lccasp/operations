/**
 * 苹果风格按钮组件
 * 支持多种样式和交互状态
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  View,
} from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   runOnJS,
// } from 'react-native-reanimated';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'react-native-haptic-feedback';

import { useTheme } from '../../theme';

// 按钮变体类型
export type ButtonVariant = 
  | 'primary'      // 主要按钮（蓝色填充）
  | 'secondary'    // 次要按钮（灰色填充）
  | 'destructive'  // 危险按钮（红色填充）
  | 'outline'      // 描边按钮
  | 'ghost'        // 透明按钮
  | 'link';        // 链接样式按钮

// 按钮尺寸类型
export type ButtonSize = 'small' | 'medium' | 'large';

// 图标位置类型
export type IconPosition = 'left' | 'right';

// 触觉反馈类型
export type HapticType = 'light' | 'medium' | 'heavy';

// 按钮属性接口
export interface ButtonProps {
  // 基础属性
  title?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  
  // 样式属性
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  
  // 图标属性
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  
  // 交互属性
  hapticFeedback?: HapticType | false;
  
  // 自定义样式
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // 测试属性
  testID?: string;
  
  // 子组件
  children?: React.ReactNode;
}

// 简化版本按钮组件（临时移除动画）
// const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  onLongPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  hapticFeedback = 'light',
  style,
  textStyle,
  testID,
  children,
}) => {
  const theme = useTheme();
  
  // 触觉反馈
  const triggerHapticFeedback = useCallback(() => {
    if (hapticFeedback && !disabled) {
      const hapticOptions = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
      
      switch (hapticFeedback) {
        case 'light':
          Haptics.trigger('impactLight', hapticOptions);
          break;
        case 'medium':
          Haptics.trigger('impactMedium', hapticOptions);
          break;
        case 'heavy':
          Haptics.trigger('impactHeavy', hapticOptions);
          break;
      }
    }
  }, [hapticFeedback, disabled]);

  // 简化的按钮按下处理
  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      triggerHapticFeedback();
      onPress?.();
    }
  }, [disabled, loading, triggerHapticFeedback, onPress]);

  const handleLongPress = useCallback(() => {
    if (!disabled && !loading && onLongPress) {
      triggerHapticFeedback();
      onLongPress();
    }
  }, [disabled, loading, onLongPress, triggerHapticFeedback]);

  // 获取按钮样式
  const buttonStyles = getButtonStyles(theme, variant, size, fullWidth, disabled);
  const textStyles = getTextStyles(theme, variant, size, disabled);

  // 渲染图标
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <View style={[
        styles.iconContainer,
        iconPosition === 'left' && title ? styles.iconLeft : undefined,
        iconPosition === 'right' && title ? styles.iconRight : undefined,
      ]}>
        {icon}
      </View>
    );
  };

  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'large'}
          color={getLoadingColor(theme, variant)}
          testID={`${testID}-loading`}
        />
      );
    }

    if (children) {
      return children;
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        {title && (
          <Text
            style={[textStyles, textStyle]}
            numberOfLines={1}
            allowFontScaling={false}
          >
            {title}
          </Text>
        )}
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[
        buttonStyles,
        style,
      ]}
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={handlePress}
      onLongPress={handleLongPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={title}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// 获取按钮样式
const getButtonStyles = (
  theme: any,
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  disabled: boolean
): ViewStyle => {
  const baseStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius?.button || 8,
    ...(theme.componentShadows?.button?.default || {}),
  };

  // 尺寸样式
  const sizeStyles: ViewStyle = {
    small: {
      paddingHorizontal: theme.componentSpacing?.button?.small?.horizontal || 12,
      paddingVertical: theme.componentSpacing?.button?.small?.vertical || 8,
      minHeight: 32,
    },
    medium: {
      paddingHorizontal: theme.componentSpacing?.button?.horizontal || 16,
      paddingVertical: theme.componentSpacing?.button?.vertical || 12,
      minHeight: 44,
    },
    large: {
      paddingHorizontal: theme.componentSpacing?.button?.large?.horizontal || 20,
      paddingVertical: theme.componentSpacing?.button?.large?.vertical || 16,
      minHeight: 56,
    },
  }[size];

  // 变体样式
  const variantStyles: ViewStyle = {
    primary: {
      backgroundColor: disabled ? theme.colors.text.disabled : theme.colors.primary,
    },
    secondary: {
      backgroundColor: disabled ? theme.colors.background.secondary : theme.apple.systemGray5,
    },
    destructive: {
      backgroundColor: disabled ? theme.colors.text.disabled : theme.colors.error,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: theme.borderWidth?.regular || 1,
      borderColor: disabled ? theme.colors.text.disabled : theme.colors.border.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    link: {
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
      minHeight: 'auto' as any,
    },
  }[variant];

  // 全宽样式
  const widthStyles: ViewStyle = fullWidth ? { alignSelf: 'stretch' } : {};

  // 禁用时移除阴影
  const shadowStyles = disabled ? { shadowOpacity: 0, elevation: 0 } : {};

  return {
    ...baseStyles,
    ...sizeStyles,
    ...variantStyles,
    ...widthStyles,
    ...shadowStyles,
  };
};

// 获取文本样式
const getTextStyles = (
  theme: any,
  variant: ButtonVariant,
  size: ButtonSize,
  disabled: boolean
): TextStyle => {
  // 基础文本样式
  const baseStyles: TextStyle = {
    fontWeight: '600',
    textAlign: 'center',
  };

  // 尺寸文本样式 - 添加安全检查
  const sizeStyles: TextStyle = {
    small: theme.fontCombinations?.button?.small || { fontSize: 14, fontWeight: '600' },
    medium: theme.fontCombinations?.button?.medium || { fontSize: 16, fontWeight: '600' },
    large: theme.fontCombinations?.button?.large || { fontSize: 18, fontWeight: '600' },
  }[size];

  // 变体文本样式
  const variantStyles: TextStyle = {
    primary: {
      color: disabled ? theme.colors.text.disabled : theme.colors.text.inverse,
    },
    secondary: {
      color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
    },
    destructive: {
      color: disabled ? theme.colors.text.disabled : theme.colors.text.inverse,
    },
    outline: {
      color: disabled ? theme.colors.text.disabled : theme.colors.primary,
    },
    ghost: {
      color: disabled ? theme.colors.text.disabled : theme.colors.primary,
    },
    link: {
      color: disabled ? theme.colors.text.disabled : theme.colors.primary,
      textDecorationLine: 'underline',
    },
  }[variant];

  return {
    ...baseStyles,
    ...sizeStyles,
    ...variantStyles,
  };
};

// 获取加载指示器颜色
const getLoadingColor = (theme: any, variant: ButtonVariant): string => {
  const colorMap = {
    primary: theme.colors.text.inverse,
    secondary: theme.colors.text.primary,
    destructive: theme.colors.text.inverse,
    outline: theme.colors.primary,
    ghost: theme.colors.primary,
    link: theme.colors.primary,
  };

  return colorMap[variant];
};

// 样式定义
const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
