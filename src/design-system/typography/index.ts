import { typography } from '../tokens/typography';

export const typographyStyles = typography.sizes;

export type TypographyVariant = keyof typeof typographyStyles;

/**
 * Helper to get Tailwind class string for a typography variant
 */
export function getTypographyClass(variant: TypographyVariant): string {
  return typographyStyles[variant];
}
