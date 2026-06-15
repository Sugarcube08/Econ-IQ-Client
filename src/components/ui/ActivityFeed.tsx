'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  maxHeight?: string;
}

export default function ActivityFeed({ items, maxHeight = 'max-h-[440px]' }: ActivityFeedProps) {
  return (
    <div className={`divide-y divide-outline-variant/15 space-y-3 overflow-y-auto pr-1 ${maxHeight}`}>
      {items.length > 0 ? (
        items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="pt-3 flex gap-4 items-start first:pt-0">
              {Icon && (
                <div className="p-2 rounded-lg bg-surface-container-low text-outline shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-sans font-bold text-sm text-primary">
                    {item.title}
                  </span>
                  {item.badge && <div className="shrink-0">{item.badge}</div>}
                </div>
                <p className="font-sans text-xs text-outline leading-relaxed">
                  {item.description}
                </p>
                <span className="text-[10px] text-outline/50 font-mono block pt-1">
                  {item.timestamp}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12 text-outline">
          No items recorded in active feed.
        </div>
      )}
    </div>
  );
}
