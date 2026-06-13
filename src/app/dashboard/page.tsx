'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useDashboardOverview,
  useDashboardCharts,
  useDashboardQueues,
} from '@/hooks/useDashboard';
import { formatCurrency, formatPercent } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();

  // Queries
  const { data: overview, isLoading: isOverviewLoading, isError: isOverviewError } = useDashboardOverview();
  const { commercialFlow, agingDistribution, stateDistribution, isLoading: isChartsLoading } = useDashboardCharts();
  const { deteriorating, improving, highRisk, isLoading: isQueuesLoading } = useDashboardQueues();

  const handleExport = () => {
    router.push('/reports');
  };

  // 1. Render Loading State
  if (isOverviewLoading || isChartsLoading || isQueuesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Reconstructing Event Ledger & Scores...</p>
      </div>
    );
  }

  // 2. Render Error State
  if (isOverviewError || !overview) {
    return (
      <div className="p-xl bg-error-container/10 border border-error/50 rounded-lg text-center my-xl">
        <span className="material-symbols-outlined text-error text-3xl">error</span>
        <h3 className="font-headline text-lg font-bold text-error mt-2">Analytical Ledger Error</h3>
        <p className="font-sans text-sm text-outline mt-1">
          Could not establish secure communication with Econiq Core engines. Verify that backend is running.
        </p>
      </div>
    );
  }

  // Helper for KPI card delta formatting
  const renderDelta = (delta: number | undefined, isPositiveGood = true) => {
    if (delta === undefined) return null;
    const isPositive = delta > 0;
    const isGood = isPositiveGood ? isPositive : !isPositive;
    return (
      <div
        className={`flex items-center gap-xs text-xs font-semibold ${
          isGood ? 'text-brand-accent' : 'text-error'
        }`}
      >
        <span className="material-symbols-outlined text-[14px]">
          {isPositive ? 'trending_up' : 'trending_down'}
        </span>
        <span>{isPositive ? '+' : ''}{delta}%</span>
      </div>
    );
  };

  // Helper to draw the line chart SVG path
  const points = commercialFlow.data || [];
  let salesPath = '';
  let collectionsPath = '';
  let periods: string[] = [];

  if (points.length > 0) {
    const maxVal = Math.max(
      ...points.map((p) => Math.max(p.sales_volume || 0, p.collection_volume || 0, 1000))
    );
    
    // Map to 500x160 coordinates
    const mapped = points.map((p, idx) => {
      const x = points.length > 1 ? (idx / (points.length - 1)) * 460 + 20 : 250;
      const ySales = 180 - ((p.sales_volume || 0) / maxVal) * 140;
      const yColl = 180 - ((p.collection_volume || 0) / maxVal) * 140;
      return { x, ySales, yColl, date: p.period_start };
    });

    salesPath = `M ${mapped[0].x} ${mapped[0].ySales} ` + mapped.slice(1).map((m) => `L ${m.x} ${m.ySales}`).join(' ');
    collectionsPath = `M ${mapped[0].x} ${mapped[0].yColl} ` + mapped.slice(1).map((m) => `L ${m.x} ${m.yColl}`).join(' ');
    periods = mapped.map((m) => {
      const d = new Date(m.date);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });
  }

  // Draw aging variables
  const agingData = agingDistribution.data || {
    current: 0,
    overdue_30: 0,
    overdue_60: 0,
    overdue_90: 0,
    overdue_120: 0,
    overdue_120_plus: 0,
  };
  const agingKeys = Object.keys(agingData) as (keyof typeof agingData)[];
  const maxAgingVal = Math.max(...Object.values(agingData), 1000);

  // States distribution data mapping
  const stateData = stateDistribution.data || {};

  return (
    <div className="space-y-xl">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <h2 className="font-headline text-3xl font-semibold text-primary">Q3 Overview</h2>
          <p className="font-sans text-sm text-outline mt-1">
            Real-time commercial intelligence extracted directly from ledger records.
          </p>
        </div>
        <div className="flex gap-sm w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none px-md py-2 bg-surface border border-secondary text-secondary font-sans font-semibold text-xs rounded hover:bg-surface-container-low transition-colors flex items-center justify-center gap-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Reports
          </button>
          <Link
            href="/customers"
            className="flex-1 sm:flex-none px-md py-2 bg-brand-accent text-white font-sans font-semibold text-xs rounded hover:brightness-110 transition-colors shadow-sm flex items-center justify-center gap-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            Customer Matrix
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* KPI 1 */}
        <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">Active Customers</span>
            <span className="material-symbols-outlined text-outline text-[20px]">groups</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline text-3xl font-extrabold text-primary">
              {overview.active_customers}
            </span>
            {renderDelta(overview.comparison_deltas?.active_customers, true)}
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">Total Sales (365d)</span>
            <span className="material-symbols-outlined text-outline text-[20px]">payments</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline text-3xl font-extrabold text-primary">
              {formatCurrency(overview.sales_total)}
            </span>
            {renderDelta(overview.comparison_deltas?.sales_total, true)}
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">Collections Total</span>
            <span className="material-symbols-outlined text-outline text-[20px]">account_balance_wallet</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline text-3xl font-extrabold text-primary">
              {formatCurrency(overview.collections_total)}
            </span>
            {renderDelta(overview.comparison_deltas?.collections_total, true)}
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">Outstanding Exposure</span>
            <span className="material-symbols-outlined text-outline text-[20px]">shield</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline text-3xl font-extrabold text-primary">
              {formatCurrency(overview.outstanding_exposure)}
            </span>
            {renderDelta(overview.comparison_deltas?.outstanding_exposure, false)}
          </div>
        </div>
      </div>

      {/* Main Bento Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Commercial Pulse SVG Chart (2 columns on large screens) */}
        <div className="lg:col-span-2 bg-surface rounded-lg border border-outline-variant flex flex-col shadow-sm">
          <div className="p-md lg:p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline text-base font-bold text-primary">Commercial Pulse</h3>
            <div className="flex items-center gap-md text-xs">
              <span className="flex items-center gap-xs font-sans text-outline">
                <span className="w-3 h-3 bg-brand-accent inline-block rounded-full"></span>
                Sales Volume
              </span>
              <span className="flex items-center gap-xs font-sans text-outline">
                <span className="w-3 h-3 bg-secondary inline-block rounded-full"></span>
                Collections
              </span>
            </div>
          </div>
          <div className="p-md lg:p-lg flex-1 min-h-[300px] flex flex-col justify-between">
            {points.length > 0 ? (
              <div className="w-full h-[240px] relative">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="20" y1="40" x2="480" y2="40" stroke="#e3e2df" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="20" y1="90" x2="480" y2="90" stroke="#e3e2df" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="20" y1="140" x2="480" y2="140" stroke="#e3e2df" strokeWidth="0.5" strokeDasharray="2" />

                  {/* Paths */}
                  <path d={salesPath} fill="none" stroke="#0F766E" strokeWidth="2.5" />
                  <path d={collectionsPath} fill="none" stroke="#243447" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
                </svg>

                {/* Timeline Labels */}
                <div className="absolute bottom-1 w-full flex justify-between px-md text-[10px] text-outline font-sans">
                  <span>{periods[0] || 'Start'}</span>
                  <span>{periods[Math.floor(periods.length / 2)] || 'Mid'}</span>
                  <span>{periods[periods.length - 1] || 'End'}</span>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-sm text-outline">
                No longitudinal ledger events recorded.
              </div>
            )}
          </div>
        </div>

        {/* State Distributions */}
        <div className="bg-surface rounded-lg border border-outline-variant flex flex-col shadow-sm">
          <div className="p-md lg:p-lg border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-headline text-base font-bold text-primary">Behavioral Segment Spread</h3>
          </div>
          <div className="p-md lg:p-lg flex-1 flex flex-col justify-around gap-sm">
            {Object.keys(stateData).length > 0 ? (
              Object.entries(stateData).map(([state, val]) => {
                const percentage = val.percentage;
                let colorClass = 'bg-brand-accent';
                if (state.toLowerCase() === 'monitor') colorClass = 'bg-brand-gold';
                if (state.toLowerCase() === 'contract') colorClass = 'bg-secondary';
                if (state.toLowerCase() === 'liquidity_stress' || state.toLowerCase() === 'declining') colorClass = 'bg-error';

                return (
                  <div key={state} className="space-y-xs">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="uppercase tracking-wider text-primary font-sans">{state.replace('_', ' ')}</span>
                      <span className="text-outline font-sans">{val.count} accounts ({formatPercent(percentage)})</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className={`${colorClass} h-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-outline text-center py-8">No accounts recorded.</div>
            )}
          </div>
        </div>
      </div>

      {/* Aging Receivables distribution */}
      <div className="bg-surface rounded-lg border border-outline-variant shadow-sm">
        <div className="p-md lg:p-lg border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-headline text-base font-bold text-primary">Receivables Aging Distribution</h3>
        </div>
        <div className="p-md lg:p-lg grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-md">
          {agingKeys.map((key) => {
            const val = agingData[key] || 0;
            const pct = (val / maxAgingVal) * 100;
            const label = key.replace('_', ' ').replace('overdue', 'Overdue');
            
            return (
              <div key={key} className="flex flex-col justify-between items-center text-center p-sm bg-surface-container-low rounded border border-outline-variant/30 h-28">
                <span className="text-[10px] text-outline font-semibold uppercase tracking-wider">{label}</span>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-accent h-full" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                </div>
                <span className="font-sans text-xs font-bold text-primary mt-1">{formatCurrency(val)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attention Queues Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Deteriorating List */}
        <div className="bg-surface rounded-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline text-sm font-bold text-error flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">trending_down</span>
              Deteriorating Accounts
            </h3>
            <span className="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded-full font-semibold">Warning Queue</span>
          </div>
          <div className="flex-1 divide-y divide-outline-variant/30 overflow-y-auto max-h-[300px]">
            {deteriorating.isError ? (
              <div className="p-md text-xs text-error text-center bg-error/5 border border-error/10 m-sm rounded">
                Telemetry error: Failed to retrieve warning list.
              </div>
            ) : deteriorating.data && deteriorating.data.length > 0 ? (
              deteriorating.data.map((c) => (
                <Link
                  key={c.customer_id}
                  href={`/customer/${c.customer_id}`}
                  className="p-md flex justify-between items-center hover:bg-surface-container-low transition-colors block"
                >
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">{c.customer_name || 'Anonymous Customer'}</h4>
                    <span className="text-[10px] text-outline uppercase">{c.city || 'National Scope'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline text-xs font-bold text-error">
                      {c.trust_delta !== undefined ? `-${Math.abs(c.trust_delta * 100).toFixed(1)}%` : 'Score drop'}
                    </span>
                    <p className="text-[10px] text-outline font-sans">
                      {c.outstanding_current !== undefined ? `Exposure: ${formatCurrency(c.outstanding_current)}` : `Grade: ${c.grade || 'N/A'}`}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-md text-xs text-outline text-center">No deteriorating customers.</div>
            )}
          </div>
        </div>

        {/* Improving List */}
        <div className="bg-surface rounded-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline text-sm font-bold text-brand-accent flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              Improving Accounts
            </h3>
            <span className="text-[10px] bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full font-semibold">Growth Queue</span>
          </div>
          <div className="flex-1 divide-y divide-outline-variant/30 overflow-y-auto max-h-[300px]">
            {improving.isError ? (
              <div className="p-md text-xs text-error text-center bg-error/5 border border-error/10 m-sm rounded">
                Telemetry error: Failed to retrieve growth list.
              </div>
            ) : improving.data && improving.data.length > 0 ? (
              improving.data.map((c) => (
                <Link
                  key={c.customer_id}
                  href={`/customer/${c.customer_id}`}
                  className="p-md flex justify-between items-center hover:bg-surface-container-low transition-colors block"
                >
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">{c.customer_name || 'Anonymous Customer'}</h4>
                    <span className="text-[10px] text-outline uppercase">{c.city || 'National Scope'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline text-xs font-bold text-brand-accent">
                      {c.trust_delta !== undefined ? `+${Math.abs(c.trust_delta * 100).toFixed(1)}%` : 'Score gain'}
                    </span>
                    <p className="text-[10px] text-outline font-sans">
                      {c.outstanding_current !== undefined ? `Exposure: ${formatCurrency(c.outstanding_current)}` : `Grade: ${c.grade || 'N/A'}`}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-md text-xs text-outline text-center">No improving customers.</div>
            )}
          </div>
        </div>

        {/* Critical Risk List */}
        <div className="bg-surface rounded-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline text-sm font-bold text-brand-gold flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              High Default Risks
            </h3>
            <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full font-semibold">Credit Risk</span>
          </div>
          <div className="flex-1 divide-y divide-outline-variant/30 overflow-y-auto max-h-[300px]">
            {highRisk.isError ? (
              <div className="p-md text-xs text-error text-center bg-error/5 border border-error/10 m-sm rounded">
                Telemetry error: Failed to retrieve default risk queue.
              </div>
            ) : highRisk.data && highRisk.data.length > 0 ? (
              highRisk.data.map((c) => (
                <Link
                  key={c.customer_id}
                  href={`/customer/${c.customer_id}`}
                  className="p-md flex justify-between items-center hover:bg-surface-container-low transition-colors block"
                >
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">{c.customer_name || 'Anonymous Customer'}</h4>
                    <span className="text-[10px] text-outline uppercase">{c.city || 'National Scope'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline text-xs font-bold text-brand-gold">
                      Risk Index: {(c.risk_score !== undefined ? c.risk_score * 100 : 80).toFixed(0)}%
                    </span>
                    <p className="text-[10px] text-outline font-sans">
                      {c.outstanding_current !== undefined ? `Exposure: ${formatCurrency(c.outstanding_current)}` : `Grade: ${c.grade || 'N/A'}`}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-md text-xs text-outline text-center">No critical defaults identified.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
