export const shadows = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  outline: 'shadow-outline',
  low: 'shadow-[0_1px_3px_rgba(0,0,0,0.05)]',
  medium: 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]',
  high: 'shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08)]',
} as const;

export type ShadowTokens = typeof shadows;
