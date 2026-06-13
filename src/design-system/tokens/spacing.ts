export const spacing = {
  base: 4,
  xxs: 4,   // 4px
  xs: 8,    // 8px
  sm: 12,   // 12px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
  xxxl: 64, // 64px
  huge: 96, // 96px
} as const;

export const spacingClasses = {
  padding: {
    xxs: 'p-1',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    xxl: 'p-12',
    xxxl: 'p-16',
  },
  margin: {
    xxs: 'm-1',
    xs: 'm-2',
    sm: 'm-3',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
    xxl: 'm-12',
    xxxl: 'm-16',
  },
  gap: {
    xxs: 'gap-1',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    xxl: 'gap-12',
  }
} as const;
