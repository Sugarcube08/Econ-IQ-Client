'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Loader2, Sliders, Calendar, Activity, Info } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';

export interface UnifiedTimelinePoint {
  timestamp: string;
  // Customer metrics
  purchase_volume?: number;
  payment_volume?: number;
  outstanding?: number;
  health_score?: number;
  risk_score?: number;
  safety_score?: number;
  trust_score?: number;
  growth_score?: number;
  collection_score?: number;
  alerts_count?: number;
  returns_amount?: number;
  // Portfolio metrics
  portfolio_purchase?: number;
  portfolio_payment?: number;
  portfolio_outstanding?: number;
  critical_alerts?: number;
  collection_backlog?: number;
}

interface UnifiedBehaviorGraphProps {
  timeline: UnifiedTimelinePoint[];
  isPortfolio?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  height?: number;
}

// Define metric styling config
const METRIC_CONFIGS: Record<
  string,
  { label: string; color: string; type: 'currency' | 'percent' | 'count' }
> = {
  // Customer metrics
  purchase_volume: { label: 'Purchase Volume', color: '#0d9488', type: 'currency' }, // Teal
  payment_volume: { label: 'Payment Volume', color: '#1e40af', type: 'currency' }, // Navy Blue
  outstanding: { label: 'Outstanding Balance', color: '#d97706', type: 'currency' }, // Amber
  health_score: { label: 'Health Score', color: '#16a34a', type: 'percent' }, // Green
  safety_score: { label: 'Safety Score', color: '#dc2626', type: 'percent' }, // Red
  trust_score: { label: 'Trust Score', color: '#4f46e5', type: 'percent' }, // Indigo
  growth_score: { label: 'Growth Score', color: '#9333ea', type: 'percent' }, // Purple
  collection_score: { label: 'Collection Score', color: '#e11d48', type: 'percent' }, // Pink
  alerts_count: { label: 'Alerts Count', color: '#ea580c', type: 'count' }, // Orange
  returns_amount: { label: 'Returns Amount', color: '#be123c', type: 'currency' }, // Crimson

  // Portfolio metrics
  portfolio_purchase: { label: 'Portfolio Sales', color: '#0d9488', type: 'currency' },
  portfolio_payment: { label: 'Portfolio Receipts', color: '#1e40af', type: 'currency' },
  portfolio_outstanding: { label: 'Portfolio Outstanding', color: '#d97706', type: 'currency' },
  critical_alerts: { label: 'Critical Alerts', color: '#dc2626', type: 'count' },
  collection_backlog: { label: 'Collection Backlog', color: '#ea580c', type: 'currency' },
};

export default function UnifiedBehaviorGraph({
  timeline = [],
  isPortfolio = false,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load telemetry graphs.',
  height = 320,
}: UnifiedBehaviorGraphProps) {
  // Determine available metrics based on mode
  const availableMetrics = useMemo(() => {
    if (isPortfolio) {
      return [
        'portfolio_purchase',
        'portfolio_payment',
        'portfolio_outstanding',
        'critical_alerts',
        'collection_backlog',
      ];
    } else {
      return [
        'purchase_volume',
        'payment_volume',
        'outstanding',
        'health_score',
        'safety_score',
        'trust_score',
        'growth_score',
        'collection_score',
        'alerts_count',
        'returns_amount',
      ];
    }
  }, [isPortfolio]);

  // Set default active metrics
  const [activeMetrics, setActiveMetrics] = useState<string[]>(() => {
    if (isPortfolio) {
      return ['portfolio_purchase', 'portfolio_payment', 'portfolio_outstanding'];
    } else {
      return ['purchase_volume', 'payment_volume', 'outstanding', 'health_score'];
    }
  });

  // Brush / Zoom Indices
  const [brushRange, setBrushRange] = useState<[number, number]>(() => [0, 100]);

  // Tooltip Hover States
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  if (isLoading) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl p-6"
        style={{ height: `${height}px` }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2 shrink-0" />
        <span className="text-xs text-slate-500 font-semibold font-sans">Compiling timeline metrics...</span>
      </div>
    );
  }

  if (isError || !timeline || timeline.length === 0) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center"
        style={{ height: `${height}px` }}
      >
        <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">query_stats</span>
        <span className="text-xs text-slate-500 font-semibold font-sans">
          {timeline.length === 0 ? 'No historical ledger snapshots compiled.' : errorMessage}
        </span>
      </div>
    );
  }

  // Calculate slice based on brush range (sliders from 0 to 100)
  const totalPoints = timeline.length;
  const startIdx = Math.max(0, Math.floor((brushRange[0] / 100) * (totalPoints - 1)));
  const endIdx = Math.min(totalPoints - 1, Math.ceil((brushRange[1] / 100) * (totalPoints - 1)));
  const visibleTimeline = timeline.slice(startIdx, endIdx + 1);
  const visibleCount = visibleTimeline.length;

  // Toggle active metrics helper
  const toggleMetric = (metric: string) => {
    setActiveMetrics((prev) => {
      if (prev.includes(metric)) {
        if (prev.length === 1) return prev; // Keep at least one active
        return prev.filter((m) => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
  };

  // Dimensions & Padding
  const width = 800;
  const paddingLeft = 50;
  const paddingRight = 50;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate max values for each active metric individually to normalize them beautifully
  const metricMaxes = activeMetrics.reduce<Record<string, number>>((acc, metric) => {
    const vals = visibleTimeline.map((p) => {
      let v = p[metric as keyof UnifiedTimelinePoint];
      if (metric === 'safety_score' && v === undefined && p.risk_score !== undefined) {
        v = 1.0 - p.risk_score;
      }
      return typeof v === 'number' ? Math.abs(v) : 0;
    });
    const maxVal = Math.max(...vals, 1.0);
    acc[metric] = maxVal;
    return acc;
  }, {});

  // Map coordinates for each active metric
  const linesData = activeMetrics.map((metric) => {
    const maxVal = metricMaxes[metric];
    const points = visibleTimeline.map((p, idx) => {
      const x = paddingLeft + (visibleCount > 1 ? (idx / (visibleCount - 1)) * chartWidth : chartWidth / 2);
      let rawVal = p[metric as keyof UnifiedTimelinePoint];
      if (metric === 'safety_score' && rawVal === undefined && p.risk_score !== undefined) {
        rawVal = 1.0 - p.risk_score;
      }
      const val = typeof rawVal === 'number' ? Math.abs(rawVal) : 0;
      const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
      return { x, y, val, date: p.timestamp };
    });

    const path =
      points.length > 0
        ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((pt) => `L ${pt.x} ${pt.y}`).join(' ')
        : '';

    return {
      metric,
      config: METRIC_CONFIGS[metric],
      points,
      path,
    };
  });

  // Handle SVG Mouse Move to position tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || visibleCount === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert screen coordinates back to SVG coordinates scale
    const svgX = (mouseX / rect.width) * width;
    const svgY = (mouseY / rect.height) * height;

    // Resolve index of closest timeline point
    const relativeX = svgX - paddingLeft;
    const percentX = relativeX / chartWidth;
    let idx = Math.round(percentX * (visibleCount - 1));
    idx = Math.max(0, Math.min(visibleCount - 1, idx));

    setHoverIdx(idx);
    setHoverPos({ x: mouseX, y: mouseY });
  };

  const handleMouseLeave = () => {
    setHoverIdx(null);
    setHoverPos(null);
  };

  // Format Helper
  const formatVal = (val: number, type: 'currency' | 'percent' | 'count') => {
    if (type === 'currency') return formatCurrency(val);
    if (type === 'percent') return formatPercent(val);
    return val.toString();
  };

  const hoveredDataPoint = hoverIdx !== null ? visibleTimeline[hoverIdx] : null;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm font-sans">
      
      {/* Metric Selector Toggles */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
          <Sliders className="w-3.5 h-3.5" /> Toggle Timeline Layers
        </div>
        <div className="flex flex-wrap gap-2">
          {availableMetrics.map((m) => {
            const config = METRIC_CONFIGS[m];
            if (!config) return null;
            const isActive = activeMetrics.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMetric(m)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
                style={isActive ? { backgroundColor: config.color } : undefined}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : ''}`} style={!isActive ? { backgroundColor: config.color } : undefined}></span>
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary SVG Chart */}
      <div className="relative w-full overflow-visible">
        <svg
          ref={svgRef}
          className="w-full h-auto overflow-visible select-none cursor-crosshair"
          viewBox={`0 0 ${width} ${height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Horizontal Gridlines */}
          {[0, 1/4, 2/4, 3/4, 4/4].map((ratio) => {
            const y = paddingTop + ratio * chartHeight;
            return (
              <line
                key={ratio}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="var(--outline-variant)"
                strokeWidth="0.5"
                strokeDasharray="3,3"
                opacity="0.3"
              />
            );
          })}

          {/* Lines */}
          {linesData.map(({ metric, config, path }) => (
            <path
              key={metric}
              d={path}
              fill="none"
              stroke={config.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Horizontal X Axis line */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#94a3b8"
            strokeWidth="1"
          />

          {/* Bottom Date Labels */}
          {visibleCount > 0 && (
            <>
              <text
                x={paddingLeft}
                y={height - 15}
                fill="#64748b"
                fontSize="10"
                fontWeight="600"
                textAnchor="start"
              >
                {visibleTimeline[0].timestamp}
              </text>
              {visibleCount > 2 && (
                <text
                  x={paddingLeft + chartWidth / 2}
                  y={height - 15}
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {visibleTimeline[Math.floor(visibleCount / 2)].timestamp}
                </text>
              )}
              <text
                x={width - paddingRight}
                y={height - 15}
                fill="#64748b"
                fontSize="10"
                fontWeight="600"
                textAnchor="end"
              >
                {visibleTimeline[visibleCount - 1].timestamp}
              </text>
            </>
          )}

          {/* Interactive Hover Tooltip Line */}
          {hoverIdx !== null && (
            <line
              x1={paddingLeft + (hoverIdx / (visibleCount - 1)) * chartWidth}
              y1={paddingTop}
              x2={paddingLeft + (hoverIdx / (visibleCount - 1)) * chartWidth}
              y2={paddingTop + chartHeight}
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}

          {/* Interactive Hover Point Circles */}
          {hoverIdx !== null &&
            linesData.map(({ metric, config, points }) => {
              const pt = points[hoverIdx];
              if (!pt) return null;
              return (
                <circle
                  key={metric}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="white"
                  stroke={config.color}
                  strokeWidth="2.5"
                />
              );
            })}
        </svg>

        {/* Hover Tooltip Card HTML Popup overlay */}
        {hoverIdx !== null && hoveredDataPoint && hoverPos && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-950/95 text-white border border-slate-800 rounded-xl p-4 shadow-xl text-xs space-y-2 animate-fade-in font-sans min-w-[200px]"
            style={{
              left: `${hoverPos.x + 15}px`,
              top: `${Math.min(hoverPos.y, height - 160)}px`,
            }}
          >
            <div className="flex items-center gap-1.5 font-bold border-b border-slate-800 pb-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <Calendar className="w-3 h-3" /> Date: {hoveredDataPoint.timestamp}
            </div>
            <div className="space-y-1.5">
              {activeMetrics.map((m) => {
                const config = METRIC_CONFIGS[m];
                let rawVal = hoveredDataPoint[m as keyof UnifiedTimelinePoint];
                if (m === 'safety_score' && rawVal === undefined && hoveredDataPoint.risk_score !== undefined) {
                  rawVal = 1.0 - hoveredDataPoint.risk_score;
                }
                const val = typeof rawVal === 'number' ? rawVal : 0;
                return (
                  <div key={m} className="flex justify-between items-center gap-6">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: config.color }}></span>
                      {config.label}
                    </span>
                    <span className="font-mono font-bold">{formatVal(val, config.type)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Brush Zoom Sliders Control */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-sans border-b border-slate-200/30 pb-2">
          <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> Timeline Range Filter</span>
          <span className="font-mono">
            {timeline[startIdx]?.timestamp} — {timeline[endIdx]?.timestamp} ({visibleCount} periods)
          </span>
        </div>
        <div className="space-y-2 font-mono text-[10px] font-semibold text-slate-400">
          <div className="flex items-center gap-4">
            <span className="w-14">Start Bound:</span>
            <input
              type="range"
              min="0"
              max={Math.min(90, brushRange[1] - 5)}
              value={brushRange[0]}
              onChange={(e) => setBrushRange([parseInt(e.target.value), brushRange[1]])}
              className="flex-1 accent-teal-600 h-1 bg-slate-200 rounded-lg cursor-pointer appearance-none"
            />
            <span className="w-8 text-right">{brushRange[0]}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-14">End Bound:</span>
            <input
              type="range"
              min={Math.max(10, brushRange[0] + 5)}
              max="100"
              value={brushRange[1]}
              onChange={(e) => setBrushRange([brushRange[0], parseInt(e.target.value)])}
              className="flex-1 accent-teal-600 h-1 bg-slate-200 rounded-lg cursor-pointer appearance-none"
            />
            <span className="w-8 text-right">{brushRange[1]}%</span>
          </div>
        </div>
      </div>

      {/* Normalize Information Banner */}
      <div className="flex items-start gap-2 bg-slate-50 border border-slate-200/40 rounded-xl p-3 text-[10px] text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700">Multi-Scale Representation:</strong> To accommodate distinct metrics on a single grid (e.g. currency volumes and 0-1 scores), each metric line is automatically scaled relative to its active window maximum. True non-normalized values are shown on hover.
        </p>
      </div>

    </div>
  );
}
