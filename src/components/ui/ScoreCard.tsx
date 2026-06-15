'use client';

import React from 'react';
import { Card } from './Card';
import TrendIndicator from './TrendIndicator';

interface ScoreCardProps {
  label: string;
  score: number; // 0 to 1
  delta: number;
  description: string;
}

export default function ScoreCard({
  label,
  score,
  delta,
  description
}: ScoreCardProps) {
  
  let colorClass = 'text-brand-accent';
  let progressBg = 'bg-brand-accent';
  let statusText = 'Healthy';

  if (score < 0.4) {
    colorClass = 'text-error';
    progressBg = 'bg-error';
    statusText = 'Critical';
  } else if (score < 0.7) {
    colorClass = 'text-brand-gold';
    progressBg = 'bg-brand-gold';
    statusText = 'Monitor';
  }

  return (
    <Card className="flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-outline uppercase tracking-wider block">
            {label}
          </span>
          <span className="text-[10px] text-outline/60 leading-tight block">
            {description}
          </span>
        </div>
        <TrendIndicator value={delta} size="sm" />
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-headline text-3xl font-extrabold text-primary">
            {(score * 100).toFixed(0)}%
          </span>
          <span className={`text-xs font-bold ${colorClass}`}>
            {statusText}
          </span>
        </div>
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden border border-outline-variant/15">
          <div
            className={`${progressBg} h-full transition-all duration-300`}
            style={{ width: `${score * 100}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
}
