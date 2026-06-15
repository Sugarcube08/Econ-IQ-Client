'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ChartDataPoint {
  date: string;
  value: number;
  secondaryValue?: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  type?: 'purchase' | 'payment' | 'rg' | 'outstanding' | 'double';
  title?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  height?: number;
}

export default function Chart({
  data,
  type = 'purchase',
  title,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load telemetry chart.',
  height = 200
}: ChartProps) {
  
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-surface border border-outline-variant rounded-xl p-6" style={{ height: `${height}px` }}>
        <Loader2 className="w-6 h-6 animate-spin text-brand-accent shrink-0 mb-2" />
        <span className="text-xs text-outline font-sans">Compiling data series...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-error/5 border border-error/20 rounded-xl p-6 text-center" style={{ height: `${height}px` }}>
        <span className="material-symbols-outlined text-error text-2xl mb-1">error</span>
        <span className="text-xs text-error font-semibold font-sans">{errorMessage}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-surface border border-outline-variant rounded-xl p-6" style={{ height: `${height}px` }}>
        <span className="material-symbols-outlined text-outline/40 text-2xl mb-1">query_stats</span>
        <span className="text-xs text-outline font-sans">No longitudinal ledger events recorded.</span>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const secondaryValues = type === 'double' ? data.map(d => d.secondaryValue || 0) : [];
  const allValues = [...values, ...secondaryValues];
  
  const maxVal = Math.max(...allValues, 1000);
  const length = data.length;

  // Resolve coordinate mapping: width=500, height=200
  const width = 500;
  const paddingX = 30;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const mapped = data.map((d, idx) => {
    const x = length > 1 ? paddingX + (idx / (length - 1)) * chartWidth : width / 2;
    const y1 = height - paddingY - (d.value / maxVal) * chartHeight;
    const y2 = type === 'double' && d.secondaryValue !== undefined 
      ? height - paddingY - (d.secondaryValue / maxVal) * chartHeight 
      : 0;
    return { x, y1, y2, date: d.date };
  });

  const path1 = `M ${mapped[0].x} ${mapped[0].y1} ` + mapped.slice(1).map(m => `L ${m.x} ${m.y1}`).join(' ');
  const path2 = type === 'double' 
    ? `M ${mapped[0].x} ${mapped[0].y2} ` + mapped.slice(1).map(m => `L ${m.x} ${m.y2}`).join(' ')
    : '';

  // Standard colors matching the Design System tokens
  const colorMap = {
    purchase: 'var(--brand-accent)',  // Teal
    payment: 'var(--secondary)',      // Navy
    rg: 'var(--error)',               // Red
    outstanding: 'var(--brand-gold)', // Amber/Gold
    double: 'var(--brand-accent)'     // Primary Teal
  };

  const primaryColor = colorMap[type];

  // Helper to format labels
  const formatLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full flex flex-col font-sans text-xs bg-surface p-4 rounded-xl border border-outline-variant/60">
      {title && (
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/30">
          <h4 className="font-headline font-bold text-primary text-xs uppercase tracking-wider">{title}</h4>
          {type === 'double' && (
            <div className="flex items-center gap-3 text-[10px] text-outline font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 inline-block rounded-full" style={{ backgroundColor: 'var(--brand-accent)' }}></span>
                Sales Volume
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 inline-block rounded-full border border-dashed" style={{ borderColor: 'var(--secondary)' }}></span>
                Collections
              </span>
            </div>
          )}
        </div>
      )}

      <div className="relative w-full" style={{ height: `${height - 40}px` }}>
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          {/* Horizontal Gridlines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--outline-variant)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--outline-variant)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--outline-variant)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />

          {/* Primary Line */}
          <path d={path1} fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Secondary Line (Double Series) */}
          {type === 'double' && (
            <path d={path2} fill="none" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="4,4" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
          )}

          {/* Axis Labels */}
          <text x={paddingX} y={height - 5} fill="var(--outline)" fontSize="9" fontWeight="500" textAnchor="start">
            {formatLabel(data[0].date)}
          </text>
          <text x={width / 2} y={height - 5} fill="var(--outline)" fontSize="9" fontWeight="500" textAnchor="middle">
            {formatLabel(data[Math.floor(length / 2)].date)}
          </text>
          <text x={width - paddingX} y={height - 5} fill="var(--outline)" fontSize="9" fontWeight="500" textAnchor="end">
            {formatLabel(data[length - 1].date)}
          </text>
        </svg>
      </div>
    </div>
  );
}
