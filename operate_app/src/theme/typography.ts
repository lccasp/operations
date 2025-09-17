/**
 * 苹果风格字体系统
 * 基于 iOS Human Interface Guidelines
 */

import { Platform } from 'react-native';

// SF Pro 字体配置
const SF_PRO_FONT_FAMILY = Platform.select({
  ios: 'SF Pro Display',
  android: 'Roboto', // Android 使用 Roboto 作为备选
  default: 'System',
});

const SF_PRO_TEXT_FAMILY = Platform.select({
  ios: 'SF Pro Text',
  android: 'Roboto',
  default: 'System',
});

// 字重定义
export const FontWeights = {
  thin: '100',
  ultraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
} as const;

// iOS 标准字体大小（基于动态类型）
export const FontSizes = {
  largeTitle: 34,
  title1: 28,
  title2: 22,
  title3: 20,
  headline: 17,
  body: 17,
  callout: 16,
  subheadline: 15,
  footnote: 13,
  caption1: 12,
  caption2: 11,
} as const;

// 行高计算（基于苹果设计规范）
export const LineHeights = {
  largeTitle: 41,
  title1: 34,
  title2: 28,
  title3: 25,
  headline: 22,
  body: 22,
  callout: 21,
  subheadline: 20,
  footnote: 18,
  caption1: 16,
  caption2: 13,
} as const;

// 字母间距（苹果风格）
export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
} as const;

// 完整的字体样式定义
export const Typography = {
  // 标题类型（使用 SF Pro Display）
  largeTitle: {
    fontFamily: SF_PRO_FONT_FAMILY,
    fontSize: FontSizes.largeTitle,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.largeTitle,
    letterSpacing: LetterSpacing.normal,
  },
  
  title1: {
    fontFamily: SF_PRO_FONT_FAMILY,
    fontSize: FontSizes.title1,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.title1,
    letterSpacing: LetterSpacing.normal,
  },
  
  title2: {
    fontFamily: SF_PRO_FONT_FAMILY,
    fontSize: FontSizes.title2,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.title2,
    letterSpacing: LetterSpacing.normal,
  },
  
  title3: {
    fontFamily: SF_PRO_FONT_FAMILY,
    fontSize: FontSizes.title3,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.title3,
    letterSpacing: LetterSpacing.normal,
  },
  
  // 正文类型（使用 SF Pro Text）
  headline: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.headline,
    fontWeight: FontWeights.semibold,
    lineHeight: LineHeights.headline,
    letterSpacing: LetterSpacing.tight,
  },
  
  body: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.normal,
  },
  
  bodyEmphasized: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
    lineHeight: LineHeights.body,
    letterSpacing: LetterSpacing.normal,
  },
  
  callout: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.callout,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.callout,
    letterSpacing: LetterSpacing.normal,
  },
  
  subheadline: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.subheadline,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.subheadline,
    letterSpacing: LetterSpacing.normal,
  },
  
  footnote: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.footnote,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.footnote,
    letterSpacing: LetterSpacing.normal,
  },
  
  caption1: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.caption1,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.caption1,
    letterSpacing: LetterSpacing.normal,
  },
  
  caption2: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.caption2,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.caption2,
    letterSpacing: LetterSpacing.normal,
  },
  
  // 别名，向后兼容
  caption: {
    fontFamily: SF_PRO_TEXT_FAMILY,
    fontSize: FontSizes.caption1,
    fontWeight: FontWeights.regular,
    lineHeight: LineHeights.caption1,
    letterSpacing: LetterSpacing.normal,
  },
} as const;

// 常用字体组合
export const FontCombinations = {
  // 按钮文本
  button: {
    large: {
      ...Typography.headline,
      fontWeight: FontWeights.semibold,
    },
    medium: {
      ...Typography.body,
      fontWeight: FontWeights.semibold,
    },
    small: {
      ...Typography.callout,
      fontWeight: FontWeights.semibold,
    },
  },
  
  // 表单标签
  formLabel: {
    ...Typography.subheadline,
    fontWeight: FontWeights.medium,
  },
  
  // 导航标题
  navigationTitle: {
    ...Typography.headline,
    fontWeight: FontWeights.semibold,
  },
  
  // 列表项
  listItem: {
    primary: Typography.body,
    secondary: Typography.subheadline,
  },
  
  // 卡片内容
  card: {
    title: {
      ...Typography.headline,
      fontWeight: FontWeights.semibold,
    },
    subtitle: Typography.subheadline,
    body: Typography.body,
  },
} as const;

export type TypographyKey = keyof typeof Typography;
export type FontSizeKey = keyof typeof FontSizes;
export type FontWeightKey = keyof typeof FontWeights;
