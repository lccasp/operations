/**
 * 苹果风格阴影系统
 * 基于 iOS 设计规范的精细阴影定义
 */

import { Platform } from 'react-native';

// 基础阴影配置
const createShadow = (
  elevation: number,
  shadowOffset: { width: number; height: number },
  shadowOpacity: number,
  shadowRadius: number,
  shadowColor: string = '#000000'
) => {
  if (Platform.OS === 'android') {
    return {
      elevation,
      shadowColor,
    };
  }
  
  return {
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    shadowColor,
  };
};

// 苹果风格阴影层级
export const Shadows = {
  // 无阴影
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  // 微阴影 - 适用于轻微提升的元素
  subtle: createShadow(
    1,
    { width: 0, height: 1 },
    0.1,
    1
  ),
  
  // 小阴影 - 适用于按钮、小卡片
  small: createShadow(
    2,
    { width: 0, height: 1 },
    0.12,
    2
  ),
  
  // 中等阴影 - 适用于卡片、面板
  medium: createShadow(
    4,
    { width: 0, height: 2 },
    0.15,
    4
  ),
  
  // 大阴影 - 适用于浮动按钮、重要卡片
  large: createShadow(
    8,
    { width: 0, height: 4 },
    0.18,
    8
  ),
  
  // 特大阴影 - 适用于模态框、抽屉
  extra: createShadow(
    12,
    { width: 0, height: 6 },
    0.2,
    12
  ),
  
  // 巨大阴影 - 适用于全屏覆盖层
  massive: createShadow(
    16,
    { width: 0, height: 8 },
    0.25,
    16
  ),
} as const;

// 组件特定阴影
export const ComponentShadows = {
  // 按钮阴影
  button: {
    default: Shadows.small,
    pressed: Shadows.subtle,
    floating: Shadows.medium,
  },
  
  // 卡片阴影
  card: {
    resting: Shadows.small,
    elevated: Shadows.medium,
    floating: Shadows.large,
  },
  
  // 导航栏阴影
  navigation: {
    header: createShadow(
      4,
      { width: 0, height: 2 },
      0.1,
      4
    ),
  },
  
  // TabBar 阴影
  tabBar: createShadow(
    8,
    { width: 0, height: -2 },
    0.1,
    8
  ),
  
  // 模态框阴影
  modal: {
    backdrop: {
      ...Shadows.none,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: Shadows.extra,
  },
  
  // 下拉菜单阴影
  dropdown: Shadows.large,
  
  // 工具提示阴影
  tooltip: Shadows.medium,
  
  // 浮动操作按钮阴影
  fab: {
    resting: Shadows.large,
    pressed: Shadows.medium,
  },
  
  // 输入框阴影
  input: {
    default: Shadows.subtle,
    focused: Shadows.small,
  },
} as const;

// 动态阴影（根据状态变化）
export const DynamicShadows = {
  // 交互式元素阴影变化
  interactive: {
    rest: Shadows.small,
    hover: Shadows.medium,
    pressed: Shadows.subtle,
  },
  
  // 拖拽时的阴影
  dragging: Shadows.large,
  
  // 选中状态的阴影
  selected: Shadows.medium,
  
  // 禁用状态的阴影
  disabled: Shadows.none,
} as const;

// 特殊效果阴影
export const SpecialShadows = {
  // 内阴影效果（需要特殊处理）
  inset: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    // 注意：React Native 不直接支持内阴影，需要使用其他技术实现
  },
  
  // 彩色阴影（品牌色）
  colored: {
    blue: createShadow(
      4,
      { width: 0, height: 2 },
      0.3,
      4,
      '#007AFF'
    ),
    green: createShadow(
      4,
      { width: 0, height: 2 },
      0.3,
      4,
      '#34C759'
    ),
    red: createShadow(
      4,
      { width: 0, height: 2 },
      0.3,
      4,
      '#FF3B30'
    ),
  },
  
  // 发光效果
  glow: {
    soft: createShadow(
      8,
      { width: 0, height: 0 },
      0.3,
      8,
      '#007AFF'
    ),
    strong: createShadow(
      12,
      { width: 0, height: 0 },
      0.5,
      12,
      '#007AFF'
    ),
  },
} as const;

// 深色模式阴影调整
export const DarkModeShadows = {
  // 深色模式下的阴影通常更浅且更明显
  subtle: createShadow(
    2,
    { width: 0, height: 1 },
    0.3,
    2,
    '#000000'
  ),
  
  small: createShadow(
    4,
    { width: 0, height: 2 },
    0.35,
    4,
    '#000000'
  ),
  
  medium: createShadow(
    8,
    { width: 0, height: 4 },
    0.4,
    8,
    '#000000'
  ),
  
  large: createShadow(
    12,
    { width: 0, height: 6 },
    0.45,
    12,
    '#000000'
  ),
} as const;

export type ShadowKey = keyof typeof Shadows;
export type ComponentShadowKey = keyof typeof ComponentShadows;
