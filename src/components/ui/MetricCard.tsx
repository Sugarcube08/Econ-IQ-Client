'use client';

import React from 'react';
import { Card } from './Card';
import TrendIndicator from './TrendIndicator';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'error' | 'success' | 'warning';
}

export default function MetricCard({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  variant = 'default'
}: MetricCardProps) {
  
  const valueColors = {
    default: 'text-primary',
    error: 'text-error',
    success: 'text-brand-accent',
    warning: 'text-brand-gold'
  };

  const iconColors = {
    default: 'text-outline bg-surface-container-low border-outline-variant/20',
    error: 'text-error bg-error/5 border-error/20',
    success: 'text-brand-accent bg-brand-accent/5 border-brand-accent/20',
    warning: 'text-brand-gold bg-brand-gold/5 border-brand-gold/25'
  };

  return (
    <Card className="flex flex-col justify-between h-36 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span className="font-sans text-[12px] font-bold text-outline uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg border shrink-0 ${iconColors[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline justify-between mt-4">
        <span className={`font-headline text-[32px] font-extrabold ${valueColors[variant]} tracking-tight`}>
          {value}
        </span>
        {delta !== undefined && (
          <div className="flex flex-col items-end leading-none">
            <TrendIndicator value={delta} size="sm" />
            {deltaLabel && (
              <span className="text-[10px] text-outline/60 mt-1 font-sans font-semibold uppercase">
                {deltaLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
