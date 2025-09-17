/**
 * 苹果风格颜色系统
 * 支持浅色/深色模式的动态颜色
 */

export const AppleColors = {
  // 系统颜色 - 浅色模式
  light: {
    // 主要颜色
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D92',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',

    // 灰色系统
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',

    // 标签颜色
    label: '#000000',
    secondaryLabel: '#3C3C43',
    tertiaryLabel: '#3C3C43',
    quaternaryLabel: '#2C2C2E',

    // 背景颜色
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    tertiarySystemBackground: '#FFFFFF',

    // 分组背景
    systemGroupedBackground: '#F2F2F7',
    secondarySystemGroupedBackground: '#FFFFFF',
    tertiarySystemGroupedBackground: '#F2F2F7',

    // 分隔符
    separator: '#3C3C43',
    opaqueSeparator: '#C6C6C8',

    // 链接
    link: '#007AFF',

    // 填充颜色
    systemFill: '#78788033',
    secondarySystemFill: '#78788028',
    tertiarySystemFill: '#7676801E',
    quaternarySystemFill: '#74748014',
  },

  // 系统颜色 - 深色模式
  dark: {
    // 主要颜色
    systemBlue: '#0A84FF',
    systemGreen: '#30D158',
    systemIndigo: '#5E5CE6',
    systemOrange: '#FF9F0A',
    systemPink: '#FF375F',
    systemPurple: '#BF5AF2',
    systemRed: '#FF453A',
    systemTeal: '#64D2FF',
    systemYellow: '#FFD60A',

    // 灰色系统
    systemGray: '#8E8E93',
    systemGray2: '#636366',
    systemGray3: '#48484A',
    systemGray4: '#3A3A3C',
    systemGray5: '#2C2C2E',
    systemGray6: '#1C1C1E',

    // 标签颜色
    label: '#FFFFFF',
    secondaryLabel: '#EBEBF5',
    tertiaryLabel: '#EBEBF5',
    quaternaryLabel: '#EBEBF5',

    // 背景颜色
    systemBackground: '#000000',
    secondarySystemBackground: '#1C1C1E',
    tertiarySystemBackground: '#2C2C2E',

    // 分组背景
    systemGroupedBackground: '#000000',
    secondarySystemGroupedBackground: '#1C1C1E',
    tertiarySystemGroupedBackground: '#2C2C2E',

    // 分隔符
    separator: '#545458',
    opaqueSeparator: '#38383A',

    // 链接
    link: '#0A84FF',

    // 填充颜色
    systemFill: '#78788033',
    secondarySystemFill: '#78788028',
    tertiarySystemFill: '#7676801E',
    quaternarySystemFill: '#74748014',
  },
} as const;

// 语义化颜色别名
export const SemanticColors = {
  light: {
    primary: AppleColors.light.systemBlue,
    primaryLight: 'rgba(0, 122, 255, 0.1)',
    success: AppleColors.light.systemGreen,
    warning: AppleColors.light.systemOrange,
    error: AppleColors.light.systemRed,
    info: AppleColors.light.systemTeal,
    
    // 文本颜色
    text: {
      primary: AppleColors.light.label,
      secondary: AppleColors.light.secondaryLabel,
      tertiary: AppleColors.light.tertiaryLabel,
      disabled: AppleColors.light.quaternaryLabel,
      inverse: AppleColors.dark.label,
    },
    
    // 背景颜色
    background: {
      primary: AppleColors.light.systemBackground,
      secondary: AppleColors.light.secondarySystemBackground,
      tertiary: AppleColors.light.tertiarySystemBackground,
      card: AppleColors.light.secondarySystemGroupedBackground,
      modal: AppleColors.light.systemBackground,
    },
    
    // 边框颜色
    border: {
      primary: AppleColors.light.separator,
      secondary: AppleColors.light.opaqueSeparator,
    },
    
    // 表面颜色
    surface: {
      elevated: AppleColors.light.secondarySystemGroupedBackground,
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
  },
  
  dark: {
    primary: AppleColors.dark.systemBlue,
    primaryLight: 'rgba(10, 132, 255, 0.15)',
    success: AppleColors.dark.systemGreen,
    warning: AppleColors.dark.systemOrange,
    error: AppleColors.dark.systemRed,
    info: AppleColors.dark.systemTeal,
    
    // 文本颜色
    text: {
      primary: AppleColors.dark.label,
      secondary: AppleColors.dark.secondaryLabel,
      tertiary: AppleColors.dark.tertiaryLabel,
      disabled: AppleColors.dark.quaternaryLabel,
      inverse: AppleColors.light.label,
    },
    
    // 背景颜色
    background: {
      primary: AppleColors.dark.systemBackground,
      secondary: AppleColors.dark.secondarySystemBackground,
      tertiary: AppleColors.dark.tertiarySystemBackground,
      card: AppleColors.dark.secondarySystemGroupedBackground,
      modal: AppleColors.dark.systemBackground,
    },
    
    // 边框颜色
    border: {
      primary: AppleColors.dark.separator,
      secondary: AppleColors.dark.opaqueSeparator,
    },
    
    // 表面颜色
    surface: {
      elevated: AppleColors.dark.secondarySystemGroupedBackground,
      overlay: 'rgba(0, 0, 0, 0.6)',
    },
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type SemanticColorKey = keyof typeof SemanticColors.light;
