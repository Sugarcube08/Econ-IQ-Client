'use client';

import React from 'react';
import { Card } from './Card';
import Badge from './Badge';
import { ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';

interface AlertCardProps {
  id: string;
  type: string;
  customerName: string;
  customerId: string;
  message: string;
  timestamp: string;
  exposure?: number;
  recommendation?: string;
  onAction?: (id: string, actionType: string) => void;
}

export default function AlertCard({
  id,
  type,
  customerName,
  customerId,
  message,
  timestamp,
  exposure,
  recommendation,
  onAction
}: AlertCardProps) {
  
  const isRisk = type.toLowerCase().includes('risk') || type.toLowerCase().includes('deteriorate');
  const isGrowth = type.toLowerCase().includes('growth') || type.toLowerCase().includes('improve');
  
  let iconColor = 'text-brand-gold bg-brand-gold/10 border-brand-gold/25';
  let badgeVariant: 'accent' | 'warning' | 'danger' = 'warning';
  let bulletColor = '🔴';
  
  if (isRisk) {
    iconColor = 'text-error bg-error/5 border-error/20';
    badgeVariant = 'danger';
    bulletColor = '🔴';
  } else if (isGrowth) {
    iconColor = 'text-brand-accent bg-brand-accent/5 border-brand-accent/20';
    badgeVariant = 'accent';
    bulletColor = '🟢';
  } else {
    bulletColor = '🟠';
  }

  return (
    <Card className="hover:shadow-md transition-shadow p-6 space-y-4">
      {/* Alert Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm shrink-0">{bulletColor}</span>
          <div>
            <span className="font-headline font-bold text-sm text-primary block">
              {customerName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant} size="sm">
            {type.replace(/_/g, ' ')}
          </Badge>
          <span className="text-[10px] text-outline/60 font-mono">{new Date(timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Message */}
      <p className="font-sans text-xs sm:text-sm text-outline leading-relaxed">
        {message}
      </p>

      {/* Recommendations & Exposure */}
      {(exposure !== undefined || recommendation) && (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 space-y-2 text-xs">
          {exposure !== undefined && (
            <div className="flex justify-between font-sans">
              <span className="text-outline uppercase font-semibold">Current Exposure:</span>
              <span className="font-mono font-bold text-primary">${exposure.toLocaleString()}</span>
            </div>
          )}
          {recommendation && (
            <div className="space-y-0.5">
              <span className="text-outline uppercase font-semibold block">Recommendation:</span>
              <p className="font-sans text-primary leading-relaxed font-medium">{recommendation}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {onAction && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-outline-variant/10">
          <div className="flex flex-wrap gap-2">
            {isRisk ? (
              <button
                onClick={() => onAction(id, 'adjust_terms')}
                className="px-3.5 py-1.5 bg-error text-white font-semibold text-xs rounded hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border-0 shadow-sm"
              >
                Tighten Payment Terms
              </button>
            ) : isGrowth ? (
              <button
                onClick={() => onAction(id, 'adjust_terms')}
                className="px-3.5 py-1.5 bg-brand-accent text-white font-semibold text-xs rounded hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border-0 shadow-sm"
              >
                Extend Credit Limit
              </button>
            ) : (
              <button
                onClick={() => onAction(id, 'adjust_terms')}
                className="px-3.5 py-1.5 bg-brand-gold text-white font-semibold text-xs rounded hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border-0 shadow-sm"
              >
                Audit Invoices
              </button>
            )}
            
            <button
              onClick={() => onAction(id, 'dispatch_warning')}
              className="px-3.5 py-1.5 bg-surface border border-outline-variant text-primary font-semibold text-xs rounded hover:bg-surface-container-low transition-colors cursor-pointer shadow-sm"
            >
              Dispatch Warning
            </button>
          </div>

          <button
            onClick={() => onAction(id, 'acknowledge')}
            className="px-3.5 py-1.5 bg-surface-container-high border border-outline-variant/30 text-outline hover:text-primary font-semibold text-xs rounded transition-colors cursor-pointer"
          >
            Acknowledge & Archive
          </button>
        </div>
      )}
    </Card>
  );
}
