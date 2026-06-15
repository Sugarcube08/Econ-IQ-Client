'use client';

import React from 'react';
import Badge from './Badge';

interface RiskIndicatorProps {
  score: number; // 0 to 1
  label?: string;
  size?: 'sm' | 'md';
}

export default function RiskIndicator({ score, label, size = 'md' }: RiskIndicatorProps) {
  let variant: 'accent' | 'warning' | 'danger' = 'accent';
  let text = label || 'Low Risk';

  if (score >= 0.7) {
    variant = 'danger';
    text = label || 'Critical';
  } else if (score >= 0.4) {
    variant = 'warning';
    text = label || 'Medium';
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} size={size}>
        {text}
      </Badge>
      <span className="font-mono font-bold text-primary text-xs">
        {(score * 100).toFixed(0)}%
      </span>
    </div>
  );
}
