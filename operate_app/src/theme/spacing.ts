/**
 * 苹果风格间距系统
 * 基于 8pt 网格和 iOS 设计规范
 */

// 基础间距单位（8pt 网格系统）
const BASE_UNIT = 8;

// 间距标准
export const Spacing = {
  // 极小间距
  xs: BASE_UNIT * 0.5, // 4pt
  
  // 小间距
  sm: BASE_UNIT, // 8pt
  
  // 中等间距
  md: BASE_UNIT * 2, // 16pt
  
  // 大间距
  lg: BASE_UNIT * 3, // 24pt
  
  // 特大间距
  xl: BASE_UNIT * 4, // 32pt
  
  // 超大间距
  xxl: BASE_UNIT * 6, // 48pt
  
  // 巨大间距
  xxxl: BASE_UNIT * 8, // 64pt
} as const;

// 组件内部间距
export const ComponentSpacing = {
  // 按钮内边距
  button: {
    horizontal: Spacing.md,
    vertical: Spacing.sm,
    large: {
      horizontal: Spacing.lg,
      vertical: Spacing.md,
    },
    small: {
      horizontal: Spacing.sm,
      vertical: Spacing.xs,
    },
  },
  
  // 卡片间距
  card: {
    padding: Spacing.md,
    margin: Spacing.sm,
    borderRadius: 12,
  },
  
  // 表单元素间距
  form: {
    fieldSpacing: Spacing.md,
    labelSpacing: Spacing.xs,
    groupSpacing: Spacing.lg,
  },
  
  // 列表间距
  list: {
    itemSpacing: Spacing.sm,
    sectionSpacing: Spacing.lg,
    itemPadding: Spacing.md,
  },
  
  // 导航间距
  navigation: {
    headerHeight: 44,
    tabBarHeight: 83,
    statusBarHeight: 44,
  },
  
  // 模态框间距
  modal: {
    padding: Spacing.lg,
    margin: Spacing.md,
    borderRadius: 16,
  },
} as const;

// 布局间距（页面级别）
export const LayoutSpacing = {
  // 页面边距
  pageHorizontal: Spacing.md,
  pageVertical: Spacing.lg,
  
  // 安全区域
  safeAreaTop: 44,
  safeAreaBottom: 34,
  
  // 内容区域
  contentMaxWidth: 375, // iPhone 标准宽度参考
  
  // 分隔线
  separatorHeight: 0.5,
  
  // 阴影相关
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowRadius: 8,
  elevation: 3, // Android 阴影
} as const;

// 圆角半径（基于苹果设计语言）
export const BorderRadius = {
  // 小圆角
  sm: 6,
  
  // 中等圆角
  md: 8,
  
  // 大圆角
  lg: 12,
  
  // 特大圆角
  xl: 16,
  
  // 超大圆角
  xxl: 20,
  
  // 圆形
  round: 999,
  
  // 组件特定圆角
  button: 8,
  card: 12,
  modal: 16,
  input: 8,
  avatar: 999,
} as const;

// 边框宽度
export const BorderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 0.5,
  regular: 1,
  thick: 2,
} as const;

// 响应式间距（根据屏幕尺寸调整）
export const ResponsiveSpacing = {
  // 小屏幕（iPhone SE 等）
  small: {
    horizontal: Spacing.sm,
    vertical: Spacing.md,
  },
  
  // 中等屏幕（标准 iPhone）
  medium: {
    horizontal: Spacing.md,
    vertical: Spacing.lg,
  },
  
  // 大屏幕（iPhone Plus/Max 等）
  large: {
    horizontal: Spacing.lg,
    vertical: Spacing.xl,
  },
} as const;

// 动画时长（基于苹果标准）
export const AnimationDuration = {
  // 快速动画
  fast: 200,
  
  // 标准动画
  normal: 300,
  
  // 慢速动画
  slow: 500,
  
  // 页面过渡
  pageTransition: 350,
  
  // 模态框动画
  modal: 400,
  
  // 弹性动画
  spring: 600,
} as const;

// 动画缓动函数（苹果风格）
export const AnimationEasing = {
  // 标准缓动
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  // 减速缓动
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  
  // 加速缓动
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // 苹果风格弹性
  apple: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

export type SpacingKey = keyof typeof Spacing;
export type BorderRadiusKey = keyof typeof BorderRadius;
