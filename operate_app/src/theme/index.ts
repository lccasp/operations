/**
 * 苹果风格主题系统入口
 * 整合所有主题配置，提供统一的主题接口
 */

import React from 'react';
import { useColorScheme } from 'react-native';

// 简化的颜色定义（避免循环依赖）
const lightColors = {
  primary: '#007AFF',
  primaryLight: 'rgba(0, 122, 255, 0.1)',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA',
    card: '#FFFFFF',
  },
  border: {
    primary: '#C6C6C8',
    secondary: '#E5E5EA',
  },
  surface: {
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
};

const darkColors = {
  primary: '#0A84FF',
  primaryLight: 'rgba(10, 132, 255, 0.1)',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#8E8E93',
    disabled: '#48484A',
    inverse: '#000000',
  },
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
    card: '#1C1C1E',
  },
  border: {
    primary: '#38383A',
    secondary: '#48484A',
  },
  surface: {
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
};

// 简化的主题类型
export interface Theme {
  colors: typeof lightColors;
  mode: 'light' | 'dark';
  typography: {
    headline: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
  borderWidth: {
    hairline: number;
    regular: number;
  };
  borderRadius: {
    button: number;
  };
  componentShadows: {
    tabBar: any;
    button: {
      default: any;
    };
  };
  componentSpacing: {
    button: {
      horizontal: number;
      vertical: number;
      small: {
        horizontal: number;
        vertical: number;
      };
      large: {
        horizontal: number;
        vertical: number;
      };
    };
  };
  fontCombinations: {
    button: {
      small: any;
      medium: any;
      large: any;
    };
  };
  apple: {
    systemGray: string;
    systemTeal: string;
    systemGray5: string;
  };
}

// 简化的字体定义
const typography = {
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
  },
};

// 创建主题函数
export const createTheme = (colorScheme: 'light' | 'dark'): Theme => {
  const colors = colorScheme === 'light' ? lightColors : darkColors;
  
  return {
    colors,
    mode: colorScheme,
    typography,
    borderWidth: {
      hairline: 0.5,
      regular: 1,
    },
    borderRadius: {
      button: 8,
    },
    componentShadows: {
      tabBar: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      },
      button: {
        default: {
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
      },
    },
    componentSpacing: {
      button: {
        horizontal: 16,
        vertical: 12,
        small: {
          horizontal: 12,
          vertical: 8,
        },
        large: {
          horizontal: 20,
          vertical: 16,
        },
      },
    },
    fontCombinations: {
      button: {
        small: { fontSize: 14, fontWeight: '600' },
        medium: { fontSize: 16, fontWeight: '600' },
        large: { fontSize: 18, fontWeight: '600' },
      },
    },
    apple: {
      systemGray: '#8E8E93',
      systemTeal: '#5AC8FA',
      systemGray5: '#E5E5EA',
    },
  };
};

// 缓存主题对象以避免重复创建
const themeCache = new Map<string, Theme>();

// 获取当前主题的 Hook
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme() ?? 'light';
  
  // 使用useMemo和缓存机制，避免每次渲染都创建新对象
  return React.useMemo(() => {
    const cacheKey = colorScheme;
    
    if (themeCache.has(cacheKey)) {
      return themeCache.get(cacheKey)!;
    }
    
    const theme = createTheme(colorScheme);
    themeCache.set(cacheKey, theme);
    return theme;
  }, [colorScheme]);
};

// 默认主题
export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

// 主题工具函数
export const themeUtils = {
  isDarkMode: (theme: Theme): boolean => {
    return theme.mode === 'dark';
  },
};

export type ColorScheme = 'light' | 'dark';

// 导出默认主题 Hook
export default useTheme;