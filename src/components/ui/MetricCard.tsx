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
    <Card className="flex flex-col justify-between min-h-[9rem] h-auto hover:shadow-md transition-shadow p-5 space-y-3">
      <div className="flex justify-between items-start gap-4">
        <span className="font-sans text-[11px] font-bold text-outline uppercase tracking-wider block leading-relaxed">
          {label}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg border shrink-0 ${iconColors[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col justify-end mt-auto space-y-1">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <span 
            className={`font-headline font-extrabold ${valueColors[variant]} tracking-tight`}
            style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2rem)', lineHeight: '1.1' }}
          >
            {value}
          </span>
          {delta !== undefined && (
            <TrendIndicator value={delta} size="sm" />
          )}
        </div>
        {deltaLabel && (
          <span className="text-[10px] text-outline/70 font-sans font-semibold uppercase tracking-wider block mt-1">
            {deltaLabel}
          </span>
        )}
      </div>
    </Card>
  );
}
