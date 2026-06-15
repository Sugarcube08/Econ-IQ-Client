'use client';

import React from 'react';
import { Card } from './Card';
import Badge from './Badge';
import { LucideIcon } from 'lucide-react';

interface IntelligenceCardProps {
  title: string;
  description: string;
  timestamp: string;
  badgeText?: string;
  badgeVariant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  icon?: LucideIcon;
}

export default function IntelligenceCard({
  title,
  description,
  timestamp,
  badgeText,
  badgeVariant = 'info',
  icon: Icon
}: IntelligenceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow p-5 flex gap-4 items-start">
      {Icon && (
        <div className="p-2 bg-surface-container text-outline rounded-lg border border-outline-variant/30 shrink-0 mt-0.5">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start gap-2 flex-wrap sm:flex-nowrap">
          <span className="font-headline font-bold text-sm text-primary">
            {title}
          </span>
          {badgeText && (
            <Badge variant={badgeVariant} size="sm">
              {badgeText}
            </Badge>
          )}
        </div>
        <p className="font-sans text-xs text-outline leading-relaxed">
          {description}
        </p>
        <span className="text-[10px] text-outline/50 font-mono block pt-1">
          {timestamp}
        </span>
      </div>
    </Card>
  );
}
