'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type?: 'neutral' | 'success' | 'warning' | 'danger';
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  
  const indicatorColors = {
    neutral: 'bg-outline border-outline-variant/35 bg-outline/25',
    success: 'bg-brand-accent border-brand-accent/30 bg-brand-accent/25',
    warning: 'bg-[#c8a96b] border-[#c8a96b]/30 bg-[#c8a96b]/25',
    danger: 'bg-error border-error/30 bg-error/25'
  };

  const bulletColors = {
    neutral: 'bg-outline',
    success: 'bg-brand-accent',
    warning: 'bg-[#c8a96b]',
    danger: 'bg-error'
  };

  return (
    <div className="bg-surface rounded-xl border border-outline-variant p-8 font-sans">
      <div className="relative border-l-2 border-outline-variant/30 pl-8 ml-4 space-y-8">
        {events.map((event, idx) => {
          const variant = event.type || 'neutral';
          return (
            <div key={idx} className="relative">
              <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-surface flex items-center justify-center ${indicatorColors[variant]}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${bulletColors[variant]}`}></div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-outline uppercase block">
                  {event.date}
                </span>
                <strong className="text-sm text-primary block">
                  {event.title}
                </strong>
                <p className="text-xs text-outline leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
