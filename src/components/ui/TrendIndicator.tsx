'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendIndicatorProps {
  value: number; // positive or negative
  showArrow?: boolean;
  size?: 'sm' | 'md';
}

export default function TrendIndicator({ value, showArrow = true, size = 'md' }: TrendIndicatorProps) {
  const isUpward = value >= 0;
  const colorClass = isUpward ? 'text-brand-accent' : 'text-error';
  const sizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-1 font-mono font-bold ${colorClass} ${sizeClass}`}>
      {showArrow && (isUpward ? <TrendingUp className="w-4 h-4 shrink-0" /> : <TrendingDown className="w-4 h-4 shrink-0" />)}
      <span>{isUpward ? '+' : ''}{(value * 100).toFixed(0)}%</span>
    </span>
  );
}
