import { motion } from '../tokens/motion';

export const motionStyles = motion;

export type MotionKey = keyof typeof motion;

/**
 * Returns Tailwind class string for a motion/transition token
 */
export function getMotionClass(key: MotionKey): string {
  return motion[key];
}
