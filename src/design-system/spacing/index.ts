import { spacing, spacingClasses } from '../tokens/spacing';

export const spacingValues = spacing;
export const layoutSpacing = spacingClasses;

export type SpacingKey = keyof Omit<typeof spacing, 'base'>;

/**
 * Returns the raw spacing value in pixels
 */
export function getSpacingPx(key: SpacingKey): number {
  return spacing[key];
}
