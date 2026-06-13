import { colors } from '../tokens/colors';

export type ThemeMode = 'light' | 'dark';

export const themes = {
  light: {
    id: 'light',
    name: 'Econ-IQ Corporate Light',
    colors: colors.light,
  },
  dark: {
    id: 'dark',
    name: 'Econ-IQ Terminal Dark',
    colors: colors.dark,
  },
} as const;

export function getTheme(mode: ThemeMode = 'light') {
  return themes[mode];
}

/**
 * Enforces design system theme on the document root element
 */
export function applyTheme(mode: ThemeMode = 'light') {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
