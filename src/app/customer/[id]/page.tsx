'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  useCustomerProfile,
  useCustomerPredictions,
  useCustomerRecommendations,
  useCustomerGraphs,
} from '@/hooks/useCustomer';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';
import { GraphPoint } from '@/types/customer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const { id } = use(params);

  // Queries
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useCustomerProfile(id);
  const { data: predictions, isLoading: isPredictionsLoading } = useCustomerPredictions(id);
  const { data: recommendations, isLoading: isRecsLoading } = useCustomerRecommendations(id);
  
  // Graphs
  const graphs = useCustomerGraphs(id);

  // 1. Render Loading State
  if (isProfileLoading || isPredictionsLoading || isRecsLoading || graphs.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Loading Customer Scorecard & Timelines...</p>
      </div>
    );
  }

  // 2. Render Error State
  if (isProfileError || !profile) {
    return (
      <div className="p-xl bg-error-container/10 border border-error/50 rounded-lg text-center my-xl">
        <span className="material-symbols-outlined text-error text-3xl">error</span>
        <h3 className="font-headline text-lg font-bold text-error mt-2">Analytical Profile Error</h3>
        <p className="font-sans text-sm text-outline mt-1">
          Could not establish secure communication with Econiq Core engines. Verify that backend is running.
        </p>
        <Link href="/customers" className="mt-4 inline-block text-xs font-semibold text-brand-accent hover:underline">
          Back to Customer Directory
        </Link>
      </div>
    );
  }

  const scores = profile.scores;
  const deltas = profile.deltas;

  // Helper to render score bars
  const renderScoreBar = (label: string, score: number, delta: number) => {
    // Determine color based on score value
    let colorClass = 'bg-brand-accent';
    if (score < 0.4) colorClass = 'bg-error';
    else if (score < 0.7) colorClass = 'bg-brand-gold';

    return (
      <div className="p-md bg-surface-container-low rounded border border-outline-variant/30 space-y-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">{label}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${delta >= 0 ? 'text-brand-accent bg-brand-accent/10' : 'text-error bg-error/10'}`}>
            {delta >= 0 ? '+' : ''}{(delta * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-headline text-2xl font-extrabold text-primary">{(score * 100).toFixed(0)}%</span>
          <div className="w-24 bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className={`${colorClass} h-full`} style={{ width: `${score * 100}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  // Helper to draw inline SVG charts
  const drawSvgChart = (dataPoints: GraphPoint[] = [], color = '#0F766E', dashed = false) => {
    if (!dataPoints || dataPoints.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-xs text-outline font-sans">
          No transactions.
        </div>
      );
    }

    const getVal = (d: GraphPoint) =>
      Math.abs(
        d.purchase_amount ??
        d.payment_amount ??
        d.rg_amount ??
        d.outstanding ??
        d.closing_outstanding ??
        d.amount ??
        d.value ??
        d.sales_volume ??
        d.outstanding_exposure ??
        0
      );

    const maxVal = Math.max(...dataPoints.map((d) => getVal(d)), 1000);
    const length = dataPoints.length;

    const mapped = dataPoints.map((d, idx) => {
      const x = length > 1 ? (idx / (length - 1)) * 180 + 10 : 100;
      const amount = getVal(d);
      const y = 90 - (amount / maxVal) * 70;
      return { x, y };
    });

    const path = `M ${mapped[0].x} ${mapped[0].y} ` + mapped.slice(1).map((m) => `L ${m.x} ${m.y}`).join(' ');

    return (
      <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={dashed ? '3,3' : undefined}
        />
      </svg>
    );
  };

  // Collect explainability drivers from predictions snapshot key_drivers
  const positiveDrivers = ['HIGH_TRADE_REGULARITY', 'FAST_SETTLEMENT', 'LOW_CUSTOMER_RG', 'STABLE_PARTICIPATION'];
  const negativeDrivers = ['SLOW_SETTLEMENT', 'LIQUIDITY_STRESS', 'INCONSISTENT_TRADING', 'CRITICAL_BEHAVIORAL_STRESS'];

  const allDrivers = predictions
    ? Object.values(predictions).flatMap((p) => (p as { key_drivers?: string[] }).key_drivers || [])
    : [];
  
  const activePositive = allDrivers.filter((d) => positiveDrivers.includes(d) || d.includes('regularity') || d.includes('velocity'));
  const activeNegative = allDrivers.filter((d) => negativeDrivers.includes(d) || d.includes('stress') || d.includes('delay'));

  return (
    <div className="space-y-xl">
      {/* Header Profile Ribbon */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-lg bg-surface-container rounded-xl border border-outline-variant gap-md shadow-sm">
        <div className="flex items-center gap-md">
          <div className="w-12 h-12 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent font-headline text-lg font-bold">
            {profile.customer_name?.slice(0, 2).toUpperCase() || 'AC'}
          </div>
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">
              {profile.customer_name || 'Anonymous Account'}
            </h2>
            <div className="flex items-center gap-sm mt-1 text-xs text-outline">
              <span className="font-mono">ID: {profile.customer_id}</span>
              <span>•</span>
              <span>Location: {profile.city || 'National Scope'}</span>
              <span>•</span>
              <span>Last Order: {formatDate(profile.last_purchased_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <span className="text-xs font-semibold text-outline">State Segment:</span>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase ${
            profile.behavior_state.toLowerCase() === 'active' || profile.behavior_state.toLowerCase() === 'healthy'
              ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30'
              : 'bg-error/10 text-error border-error/30'
          }`}>
            {profile.behavior_state.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* 8 Canonical Scorecard Grids */}
      <div className="space-y-md">
        <h3 className="font-headline text-base font-bold text-primary">Consolidated Scorecard</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          {renderScoreBar('Health Score', scores.health_score, deltas.health_score)}
          {renderScoreBar('Risk Score', scores.risk_score, deltas.risk_score)}
          {renderScoreBar('Growth Score', scores.growth_score, deltas.growth_score)}
          {renderScoreBar('Trust Score', scores.trust_score, deltas.trust_score)}
          {renderScoreBar('Opportunity', scores.opportunity_score, deltas.opportunity_score)}
          {renderScoreBar('Credit Safety', scores.credit_score, deltas.credit_score)}
          {renderScoreBar('Collection Pri', scores.collection_score, deltas.collection_score)}
          {renderScoreBar('Relationship', scores.relationship_score, deltas.relationship_score)}
        </div>
      </div>

      {/* 4 Analytical Timeline Graphs */}
      <div className="space-y-md">
        <h3 className="font-headline text-base font-bold text-primary">Analytical Timelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {/* Purchase Graph */}
          <div className="bg-surface rounded-lg border border-outline-variant p-md flex flex-col justify-between h-48 shadow-sm">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Purchase Flow (Invoice Sales)</span>
            <div className="h-24 py-xs">
              {drawSvgChart(graphs.purchase.data || [], '#0F766E')}
            </div>
            <span className="text-[10px] text-outline font-sans text-center">Sales volume movements over 365d</span>
          </div>

          {/* Payment Graph */}
          <div className="bg-surface rounded-lg border border-outline-variant p-md flex flex-col justify-between h-48 shadow-sm">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Payment Flow (Settlements)</span>
            <div className="h-24 py-xs">
              {drawSvgChart(graphs.payment.data || [], '#243447')}
            </div>
            <span className="text-[10px] text-outline font-sans text-center">Collection timelines over 365d</span>
          </div>

          {/* RG Graph */}
          <div className="bg-surface rounded-lg border border-outline-variant p-md flex flex-col justify-between h-48 shadow-sm">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">RG Returns / Penalties</span>
            <div className="h-24 py-xs">
              {drawSvgChart(graphs.rg.data || [], '#ba1a1a')}
            </div>
            <span className="text-[10px] text-outline font-sans text-center">Credits and disputed claims count</span>
          </div>

          {/* Outstanding Graph */}
          <div className="bg-surface rounded-lg border border-outline-variant p-md flex flex-col justify-between h-48 shadow-sm">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Outstanding exposure</span>
            <div className="h-24 py-xs">
              {drawSvgChart(graphs.outstanding.data || [], '#C8A96B', true)}
            </div>
            <span className="text-[10px] text-outline font-sans text-center">Account balance exposure movements</span>
          </div>
        </div>
      </div>

      {/* Model Predictions & Policy Recommendations Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Predictions & Model Heuristics */}
        <div className="bg-surface rounded-lg border border-outline-variant shadow-sm flex flex-col h-fit">
          <div className="p-md border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-headline text-sm font-bold text-primary">Forecasting Heuristics</h3>
          </div>
          <div className="p-md divide-y divide-outline-variant/30 text-xs font-sans space-y-sm">
            {predictions ? (
              <>
                <div className="flex justify-between py-xs">
                  <span className="text-outline uppercase">Churn Risk Probability:</span>
                  <span className={`font-bold ${predictions.churn?.is_churn_risk ? 'text-error' : 'text-brand-accent'}`}>
                    {(predictions.churn?.score * 100).toFixed(1)}% ({(predictions.churn?.is_churn_risk ? 'HIGH' : 'LOW')})
                  </span>
                </div>
                <div className="flex justify-between py-xs">
                  <span className="text-outline uppercase">Repayment Delay Days:</span>
                  <span className="font-bold text-primary">
                    {predictions.collection?.expected_delay_days || 0} days
                  </span>
                </div>
                <div className="flex justify-between py-xs">
                  <span className="text-outline uppercase">Growth potential:</span>
                  <span className="font-bold text-brand-accent uppercase">
                    {predictions.growth?.growth_potential || 'STABLE'}
                  </span>
                </div>
                <div className="flex justify-between py-xs">
                  <span className="text-outline uppercase">Expected upsell potential:</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(predictions.opportunity?.expected_upsell_value || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-xs">
                  <span className="text-outline uppercase">Opportunity Tier:</span>
                  <span className="font-bold text-brand-gold uppercase">
                    {predictions.opportunity?.opportunity_tier || 'LOW'}
                  </span>
                </div>
                <div className="flex justify-between py-xs">
                  <span className="text-outline uppercase">Confidence Index:</span>
                  <span className="font-bold text-primary">
                    {formatPercent(predictions.health?.confidence || 0)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-outline">No forecasts compiled.</div>
            )}
          </div>
        </div>

        {/* Action recommendations Queue */}
        <div className="bg-surface rounded-lg border border-outline-variant shadow-sm flex flex-col lg:col-span-2">
          <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h3 className="font-headline text-sm font-bold text-primary">Next-Best-Action Policy Queue</h3>
            <span className="text-[10px] bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full font-semibold">Auto Engine V1</span>
          </div>
          <div className="divide-y divide-outline-variant/30 overflow-y-auto max-h-[300px]">
            {recommendations && recommendations.recommendations?.length > 0 ? (
              recommendations.recommendations.map((r, idx) => {
                let badgeClass = 'text-brand-accent bg-brand-accent/10 border-brand-accent/30';
                if (r.priority === 'HIGH' || r.priority === 'CRITICAL') {
                  badgeClass = 'text-error bg-error/10 border-error/30';
                } else if (r.priority === 'MEDIUM') {
                  badgeClass = 'text-brand-gold bg-brand-gold/10 border-brand-gold/30';
                }

                return (
                  <div key={idx} className="p-md flex items-start gap-md hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-outline mt-0.5">
                      {r.type === 'CREDIT_LIMIT' ? 'monetization_on' : r.type === 'PAYMENT_TERMS' ? 'schedule' : 'handshake'}
                    </span>
                    <div className="flex-1 space-y-xs">
                      <div className="flex items-center gap-sm">
                        <span className="font-sans text-xs font-bold text-primary">{r.action_category.replace(/_/g, ' ')}</span>
                        <span className={`px-2 py-0.2 text-[9px] font-bold rounded-full border uppercase ${badgeClass}`}>
                          {r.priority}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{r.reason}</p>
                      <div className="flex gap-md text-[10px] text-outline font-semibold">
                        <span>Affected: {r.affected_score.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>Value Offset: {r.value}</span>
                        <span>•</span>
                        <span>Confidence: {formatPercent(r.confidence)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-md text-xs text-outline text-center py-16">No recommendations triggered by policy rules.</div>
            )}
          </div>
        </div>
      </div>

      {/* Forensic Explainability Panel */}
      <div className="bg-surface rounded-lg border border-outline-variant shadow-sm">
        <div className="p-md border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-headline text-sm font-bold text-primary">Forensic Explainability & Drivers</h3>
        </div>
        <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-md divide-y md:divide-y-0 md:divide-x divide-outline-variant/30 text-xs font-sans">
          {/* Positive drivers */}
          <div className="space-y-sm">
            <h4 className="font-bold text-brand-accent uppercase tracking-wider flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Positive score drivers
            </h4>
            <ul className="space-y-xs text-outline list-disc list-inside">
              {activePositive.length > 0 ? (
                activePositive.map((d, i) => <li key={i} className="font-semibold text-primary">{d.replace(/_/g, ' ')}</li>)
              ) : (
                <>
                  <li>STRONG_DEBT_CLEARANCE (Receivable settlement velocity)</li>
                  <li>STABLE_PARTICIPATION (Trading rhythm stability)</li>
                </>
              )}
            </ul>
          </div>

          {/* Negative drivers */}
          <div className="space-y-sm pt-md md:pt-0 md:pl-md">
            <h4 className="font-bold text-error uppercase tracking-wider flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              Negative score drivers
            </h4>
            <ul className="space-y-xs text-outline list-disc list-inside">
              {activeNegative.length > 0 ? (
                activeNegative.map((d, i) => <li key={i} className="font-semibold text-primary">{d.replace(/_/g, ' ')}</li>)
              ) : (
                <>
                  <li>SLOW_SETTLEMENT (Average collection delays exceed terms)</li>
                  <li>LIQUIDITY_STRESS (High credit limits utilization)</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
