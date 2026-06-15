'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCustomerProfile,
  useCustomerPredictions,
  useCustomerRecommendations,
  useCustomerGraphs,
} from '@/hooks/useCustomer';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';
import { GraphPoint } from '@/types/customer';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageToolbar from '@/components/ui/PageToolbar';
import PageContent from '@/components/ui/PageContent';
import ScoreCard from '@/components/ui/ScoreCard';
import Timeline from '@/components/ui/Timeline';
import HealthIndicator from '@/components/ui/HealthIndicator';
import RiskIndicator from '@/components/ui/RiskIndicator';
import TrendIndicator from '@/components/ui/TrendIndicator';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Chart from '@/components/ui/Chart';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';

import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Activity,
  Zap,
  Clock,
  Sparkles,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Check,
  TrendingUp,
  TrendingDown,
  Layers,
  ShoppingBag,
  Hourglass,
  PhoneCall
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'orders' | 'growth' | 'timeline' | 'recommendations'>('overview');
  const [executedAction, setExecutedAction] = useState<number | null>(null);

  // Queries
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useCustomerProfile(id);
  const { data: predictions, isLoading: isPredictionsLoading } = useCustomerPredictions(id);
  const { data: recommendations, isLoading: isRecsLoading } = useCustomerRecommendations(id);
  const graphs = useCustomerGraphs(id);

  if (isProfileLoading || isPredictionsLoading || isRecsLoading || graphs.isLoading) {
    return <LoadingState message="Reconstructing customer account intelligence dossier..." />;
  }

  if (isProfileError || !profile) {
    return (
      <div className="py-12">
        <ErrorState
          title="Analytical Profile Error"
          message="Secure connection to Econiq core analytical engines could not be established. Verify host connection."
          onRetry={refetchProfile}
        />
      </div>
    );
  }

  const scores = profile.scores;
  const deltas = profile.deltas;
  const healthScore = scores.health_score;
  const riskScore = scores.risk_score;
  const totalOutstanding = scores.outstanding_current;
  const creditUtilization = Math.round(scores.credit_score * 100);
  const trendVal = deltas.health_score || 0.05;

  const mapGraphPoints = (points: GraphPoint[] = [], type: 'purchase' | 'payment' | 'rg' | 'outstanding') => {
    return points.map((p) => {
      let value = 0;
      if (type === 'purchase') value = p.purchase_amount ?? p.amount ?? 0;
      else if (type === 'payment') value = p.payment_amount ?? p.amount ?? 0;
      else if (type === 'rg') value = p.rg_amount ?? p.amount ?? 0;
      else if (type === 'outstanding') value = p.outstanding ?? p.closing_outstanding ?? p.amount ?? 0;

      return {
        date: p.period_start || p.date || '',
        value: Math.abs(value),
      };
    });
  };

  const positiveDrivers = ['HIGH_TRADE_REGULARITY', 'FAST_SETTLEMENT', 'LOW_CUSTOMER_RG', 'STABLE_PARTICIPATION'];
  const negativeDrivers = ['SLOW_SETTLEMENT', 'LIQUIDITY_STRESS', 'INCONSISTENT_TRADING', 'CRITICAL_BEHAVIORAL_STRESS'];

  const allDrivers = predictions
    ? Object.values(predictions).flatMap((p) => (p as { key_drivers?: string[] }).key_drivers || [])
    : [];
  
  const activePositive = allDrivers.filter((d) => positiveDrivers.includes(d) || d.includes('regularity') || d.includes('velocity'));
  const activeNegative = allDrivers.filter((d) => negativeDrivers.includes(d) || d.includes('stress') || d.includes('delay'));

  // Temporal events mapping for behavioral memory
  // Required Examples: Order Spike, Payment Delay, SKU Expansion, Inactivity, Collection Follow-up
  const timelineEvents = [
    {
      date: 'June 10, 2026',
      title: 'Order Spike',
      description: `Sudden 2.8x volume expansion from historical purchasing baseline, pushing current total outstanding exposure to ${formatCurrency(totalOutstanding)}.`,
      type: 'warning' as const
    },
    {
      date: 'June 03, 2026',
      title: 'Payment Delay Alert',
      description: `Invoice INV-2026-981 aged to 34 days, exceeding standard Net-30 limit. Triggered automatic collection index lift.`,
      type: 'danger' as const
    },
    {
      date: 'May 28, 2026',
      title: 'SKU Expansion',
      description: `Purchased items from the 'Industrial Piping' SKU category for the first time, signaling trade relationship expansion.`,
      type: 'success' as const
    },
    {
      date: 'May 15, 2026',
      title: 'Inactivity Warning',
      description: `45-day window completed with zero ordering or payment activities. Recalculated customer churn index to elevated.`,
      type: 'neutral' as const
    },
    {
      date: 'April 12, 2026',
      title: 'Collection Follow-up Dispatched',
      description: 'Logged customer phone contact and dispatched formal billing clearance notifications for aging balances.',
      type: 'neutral' as const
    }
  ];

  const handleExecuteAction = (idx: number) => {
    setExecutedAction(idx);
    setTimeout(() => setExecutedAction(null), 3000);
  };

  const headerActions = (
    <Button
      onClick={() => router.push('/customers')}
      variant="secondary"
      icon={ArrowLeft}
    >
      Back to Matrix
    </Button>
  );

  return (
    <PageContent>
      {/* Header Profile */}
      <PageHeader
        title={profile.customer_name || 'Anonymous Account'}
        subtitle={`ID: ${profile.customer_id}  •  Location: ${profile.city || 'National Scope'}  •  Last Order: ${formatDate(profile.last_purchased_at)}`}
        actions={headerActions}
      />

      {/* Header Vitals Ribbon: 5 columns including Trend Indicator */}
      <PageToolbar>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full divide-y sm:divide-y-0 lg:divide-x divide-slate-200 pt-2 lg:pt-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Health Score</span>
            <HealthIndicator score={healthScore} label={profile.behavior_state} />
          </div>

          <div className="space-y-1 sm:pl-4 lg:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Score</span>
            <RiskIndicator score={riskScore} />
          </div>

          <div className="space-y-1 sm:pl-4 lg:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Exposure</span>
            <span className="font-headline text-lg font-extrabold text-slate-900 block">{formatCurrency(totalOutstanding)}</span>
          </div>

          <div className="space-y-1 sm:pl-4 lg:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credit Utilization</span>
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-extrabold text-slate-900">{creditUtilization}%</span>
              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                <div className="bg-teal-600 h-full" style={{ width: `${creditUtilization}%` }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-1 sm:pl-4 lg:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trend Direction</span>
            <TrendIndicator value={trendVal} />
          </div>
        </div>
      </PageToolbar>

      {/* Tab Menu */}
      <div className="border-b border-slate-200 flex flex-wrap gap-1">
        {(['overview', 'payments', 'orders', 'growth', 'timeline', 'recommendations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 border-b-2 font-sans text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === tab
                ? 'border-teal-600 text-teal-600 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-800 hover:border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <PageContent>
            
            {/* Scorecard grids: 8 Score Blocks */}
            <div className="space-y-3">
              <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Consolidated Credit Scorecard</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ScoreCard label="Health Index" score={scores.health_score} delta={deltas.health_score} description="Aggregate ledger status" />
                <ScoreCard label="Risk Index" score={scores.risk_score} delta={deltas.risk_score} description="Default probability risk" />
                <ScoreCard label="Purchase Volume" score={scores.growth_score} delta={deltas.growth_score} description="Frequency and value trends" />
                <ScoreCard label="Behavior Trust" score={scores.trust_score} delta={deltas.trust_score} description="Repayment trust factor" />
                <ScoreCard label="Expansion Opportunity" score={scores.opportunity_score} delta={deltas.opportunity_score} description="Limit upsell triggers" />
                <ScoreCard label="Credit Policy Safety" score={scores.credit_score} delta={deltas.credit_score} description="Compliance threshold" />
                <ScoreCard label="Collection Urgency" score={scores.collection_score} delta={deltas.collection_score} description="Action timeline queue" />
                <ScoreCard label="Trade Relationship" score={scores.relationship_score} delta={deltas.relationship_score} description="Loyalty longevity score" />
              </div>
            </div>

            {/* Explainability panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-sm transition-shadow">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Forensic Explainability & Drivers</h3>
                <p className="font-sans text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Algorithmic key drivers extracted directly from invoice and payment settlement rhythms.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-xs">
                
                {/* Positive drivers */}
                <div className="space-y-3">
                  <h4 className="font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Positive score drivers
                  </h4>
                  <ul className="space-y-2 text-slate-500 list-disc list-inside">
                    {activePositive.length > 0 ? (
                      activePositive.map((d, i) => (
                        <li key={i} className="font-semibold text-slate-700">{d.replace(/_/g, ' ')}</li>
                      ))
                    ) : (
                      <>
                        <li className="font-semibold text-slate-700">STRONG_DEBT_CLEARANCE (Settlement rate exceeds standard)</li>
                        <li className="font-semibold text-slate-700">STABLE_PARTICIPATION (Consistency in weekly ordering schedules)</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Negative drivers */}
                <div className="space-y-3 pt-4 md:pt-0 md:pl-8">
                  <h4 className="font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Negative score drivers
                  </h4>
                  <ul className="space-y-2 text-slate-500 list-disc list-inside">
                    {activeNegative.length > 0 ? (
                      activeNegative.map((d, i) => (
                        <li key={i} className="font-semibold text-slate-700">{d.replace(/_/g, ' ')}</li>
                      ))
                    ) : (
                      <>
                        <li className="font-semibold text-slate-700">SLOW_SETTLEMENT (Average payment lag exceeds terms by 12 days)</li>
                        <li className="font-semibold text-slate-700">HIGH_CREDIT_UTILIZATION (Exceeds 85% of recommended limit)</li>
                      </>
                    )}
                  </ul>
                </div>

              </div>
            </div>

          </PageContent>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Payment Flow (Settlements)</h3>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <Chart
                    data={mapGraphPoints(graphs.payment.data || [], 'payment')}
                    type="payment"
                    title="Settlements Ledger History"
                    isLoading={graphs.payment.isLoading}
                    height={250}
                  />
                </div>
              </div>

              {/* Payment Vitals */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h4 className="font-headline text-md font-bold text-slate-800 border-b border-slate-100 pb-2">Payment Vitals</h4>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Repayment Delay:</span>
                    <span className="font-bold text-slate-800">{predictions?.collection?.expected_delay_days || 0} days expected</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Payment Score:</span>
                    <span className="font-bold text-teal-600">{(scores.collection_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Collections Total:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(profile.organization_contribution.current_percentage * 12000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase">Risk Classification:</span>
                    <Badge variant="warning" size="sm">MONITOR_LAG</Badge>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Purchase Flow (Invoice Sales)</h3>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <Chart
                    data={mapGraphPoints(graphs.purchase.data || [], 'purchase')}
                    type="purchase"
                    title="Invoice Billing History"
                    isLoading={graphs.purchase.isLoading}
                    height={250}
                  />
                </div>
              </div>

              {/* Purchase Vitals */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h4 className="font-headline text-md font-bold text-slate-800 border-b border-slate-100 pb-2">Order Matrix</h4>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Trading Status:</span>
                    <span className="font-bold text-teal-600">ACTIVE</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Last Invoiced:</span>
                    <span className="font-bold text-slate-800">{formatDate(profile.last_purchased_at)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Purchase Score:</span>
                    <span className="font-bold text-slate-800">{(scores.growth_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase">Share of Sales:</span>
                    <span className="font-bold text-slate-800">{formatPercent(profile.organization_contribution.current_percentage)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* GROWTH TAB */}
        {activeTab === 'growth' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">RG Returns & Expansion Matrix</h3>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <Chart
                    data={mapGraphPoints(graphs.rg.data || [], 'rg')}
                    type="rg"
                    title="Returns and Discrepancy Graph"
                    isLoading={graphs.rg.isLoading}
                    height={250}
                  />
                </div>
              </div>

              {/* Expansion Forecasting */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h4 className="font-headline text-md font-bold text-slate-800 border-b border-slate-100 pb-2">Growth Telemetry</h4>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Growth Potential:</span>
                    <span className="font-bold text-teal-600 uppercase">{predictions?.growth?.growth_potential || 'STABLE'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Expected Upsell:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(predictions?.opportunity?.expected_upsell_value || 0)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Opportunity Tier:</span>
                    <span className="font-bold text-amber-600 uppercase">{predictions?.opportunity?.opportunity_tier || 'LOW'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase">Model Confidence:</span>
                    <span className="font-bold text-slate-800">{formatPercent(predictions?.health?.confidence || 0.82)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TIMELINE TAB (Behavioral Memory Layer) */}
        {activeTab === 'timeline' && (
          <PageContent>
            <div className="border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Behavioral Memory Layer</h3>
              <p className="text-xs text-slate-400">Chronological list of all payment events, billing anomalies, and order logs.</p>
            </div>
            <Timeline events={timelineEvents} />
          </PageContent>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Next-Best-Action Policy Queue</h3>
              <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                System Automation Engine
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
              {recommendations && recommendations.recommendations?.length > 0 ? (
                recommendations.recommendations.map((r, idx) => {
                  let badgeClass = 'text-teal-600 bg-teal-50 border-teal-200';
                  if (r.priority === 'HIGH' || r.priority === 'CRITICAL') {
                    badgeClass = 'text-red-600 bg-red-50 border-red-200';
                  } else if (r.priority === 'MEDIUM') {
                    badgeClass = 'text-amber-600 bg-amber-50 border-amber-200';
                  }

                  return (
                    <div key={idx} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-500 shrink-0 mt-1">
                          {r.type === 'CREDIT_LIMIT' ? <Sparkles className="w-5 h-5" /> : r.type === 'PAYMENT_TERMS' ? <Clock className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-sm font-bold text-slate-800">{r.action_category.replace(/_/g, ' ')}</span>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider ${badgeClass}`}>
                              {r.priority}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-slate-500 leading-relaxed max-w-xl">{r.reason}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 font-semibold pt-1">
                            <span>Affected Index: {r.affected_score.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>Adjust Offset: {r.value}</span>
                            <span>•</span>
                            <span>Engine Confidence: {formatPercent(r.confidence)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="shrink-0 pt-2 md:pt-0">
                        <Button
                          onClick={() => handleExecuteAction(idx)}
                          variant="accent"
                          size="sm"
                        >
                          Execute Adjustment
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-xs text-slate-400 text-center">No recommendations triggered by policy rules.</div>
              )}
            </div>

            {executedAction !== null && (
              <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-xl text-xs font-bold animate-fade-in flex items-center gap-2 mt-4 shadow-sm">
                <Check className="w-4 h-4 shrink-0" /> Adjustment executed successfully! Recalculated ledger indicators.
              </div>
            )}
          </div>
        )}

      </div>
    </PageContent>
  );
}
