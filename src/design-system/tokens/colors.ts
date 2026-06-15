export const colors = {
  light: {
    background: '#FAF9F6',
    surface: '#FFFFFF',
    surfaceContainer: '#EFEEEB',
    surfaceContainerLow: '#F4F3F0',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerHigh: '#E9E8E5',
    surfaceContainerHighest: '#E3E2DF',
    primary: '#0F766E',      // Semantic Primary
    onPrimary: '#FFFFFF',
    secondary: '#243447',
    onSecondary: '#FFFFFF',
    brandAccent: '#0F766E',
    brandGold: '#C8A96B',
    outline: '#6B7280',
    outlineVariant: '#E3E2DF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    success: '#059669',      // Semantic Success
    warning: '#D97706',      // Semantic Warning
    danger: '#DC2626',       // Semantic Danger
    info: '#2563EB',         // Semantic Info
  },
  dark: {
    background: '#101417',
    surface: '#181C1F',
    surfaceContainer: '#1C2023',
    surfaceContainerLow: '#181C1F',
    surfaceContainerLowest: '#0B0F12',
    surfaceContainerHigh: '#262A2E',
    surfaceContainerHighest: '#313538',
    primary: '#80D5CB',
    onPrimary: '#003733',
    secondary: '#E3C282',
    onSecondary: '#402D00',
    brandAccent: '#80D5CB',
    brandGold: '#E3C282',
    outline: '#889391',
    outlineVariant: '#3E4947',
    textPrimary: '#E0E3E7',
    textSecondary: '#889391',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#2563EB',
  },
  charts: {
    purchase: '#0F766E',    // Teal
    payment: '#243447',     // Navy
    outstanding: '#D97706', // Amber / Warning
    rg: '#DC2626',          // Red / Danger
  }
} as const;

export type ColorTokens = typeof colors.light;
