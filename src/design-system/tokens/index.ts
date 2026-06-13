import { colors } from './colors';
import { spacing, spacingClasses } from './spacing';
import { typography } from './typography';
import { radius } from './radius';
import { borders } from './borders';
import { elevation } from './elevation';
import { motion } from './motion';

export const tokens = {
  colors,
  spacing,
  spacingClasses,
  typography,
  radius,
  borders,
  elevation,
  motion,
} as const;

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './radius';
export * from './borders';
export * from './elevation';
export * from './motion';
