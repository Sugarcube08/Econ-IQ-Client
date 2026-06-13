import { elevation } from '../tokens/elevation';

export const elevationStyles = elevation;

export type ElevationLevel = keyof typeof elevation;

/**
 * Returns Tailwind class string for a given shadow elevation level
 */
export function getElevationClass(level: ElevationLevel): string {
  return elevation[level];
}
