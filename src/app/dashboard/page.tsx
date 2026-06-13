'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useDashboardOverview,
  useDashboardCharts,
  useDashboardQueues,
} from '@/hooks/useDashboard';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function DashboardPage() {
  const router = useRouter();
  
  // Onboarding store states
  const {
    checklist,
    completedTour,
    orgProfile,
    updateChecklistItem,
    setTourCompleted
  } = useOnboardingStore();

  // Guided Tour States
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Simulation loading state for Sync checklist action
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);

  // Queries (enabled only if firstSync is complete to avoid uninitialized data calls)
  const { data: overview, isLoading: isOverviewLoading, isError: isOverviewError } = useDashboardOverview();
  const { commercialFlow, agingDistribution, stateDistribution, isLoading: isChartsLoading } = useDashboardCharts();
  const { deteriorating, improving, highRisk, isLoading: isQueuesLoading } = useDashboardQueues();

  // Start the tour automatically if onboarding is complete but tour is not
  useEffect(() => {
    if (checklist.orgSetup && checklist.firstSync && !completedTour && tourStep === null) {
      // Delay slightly for dashboard layout rendering
      const timer = setTimeout(() => {
        setTourStep(1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [checklist.orgSetup, checklist.firstSync, completedTour, tourStep]);

  const handleExport = () => {
    updateChecklistItem('firstReport', true);
    router.push('/reports');
  };

  const handleSyncDataSimulated = async () => {
    setIsSimulatingSync(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateChecklistItem('firstSync', true);
    updateChecklistItem('firstRun', true);
    setIsSimulatingSync(false);
  };

  const nextTourStep = () => {
    if (tourStep === 4) {
      setTourStep(null);
      setTourCompleted(true);
    } else if (tourStep !== null) {
      setTourStep(tourStep + 1);
    }
  };

  const skipTour = () => {
    setTourStep(null);
    setTourCompleted(true);
  };

  // Render loading state for background fetches
  if (isSimulatingSync || ((checklist.firstSync) && (isOverviewLoading || isChartsLoading || isQueuesLoading))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">
          {isSimulatingSync ? 'Ingesting transaction records & syncing schemas...' : 'Reconstructing Event Ledger & Scores...'}
        </p>
      </div>
    );
  }

  // Calculate activation progress
  const checklistItems = [
    { key: 'orgSetup' as const, label: 'Complete Organization Profile' },
    { key: 'firstUser' as const, label: 'Provision Team Access' },
    { key: 'firstSync' as const, label: 'Synchronize ERP Ledger' },
    { key: 'firstRun' as const, label: 'Compute Credit Behavior Scores' },
    { key: 'firstReport' as const, label: 'Generate Compliance Audit List' }
  ];
  const completedCount = checklistItems.filter(item => checklist[item.key]).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  // 1. WELCOME EMPTY STATE (If first sync has not been run)
  if (!checklist.firstSync) {
    return (
      <div className="space-y-xl max-w-4xl mx-auto py-md">
        {/* Welcome Banner */}
        <div className="bg-white border border-[#E3E2DF] rounded-xl p-8 shadow-sm space-y-4 font-sans text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-[#0F766E]/10 text-[#0F766E] rounded-full w-fit">
            Setup Wizard Completed
          </span>
          <h2 className="font-headline text-2xl font-extrabold text-[#243447]">
            Welcome to {orgProfile.name || 'Econ-IQ'}
          </h2>
          <p className="text-[#5E6266] leading-relaxed max-w-2xl text-xs sm:text-sm">
            Your secure analytical database tenant has been provisioned. To unlock the executive dashboard, credit telemetry scores, and deteriorating warning queues, synchronize your ERP invoice ledgers.
          </p>
          <div className="pt-2">
            <button
              onClick={handleSyncDataSimulated}
              className="px-6 py-3 bg-[#0F766E] text-white text-xs font-bold uppercase tracking-wider rounded hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              Sync Demo Ledger Data
            </button>
          </div>
        </div>

        {/* Getting Started Activation Checklist Widget */}
        <div className="bg-white border border-[#E3E2DF] rounded-xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-[#243447]">Econ-IQ Activation Checklist</h3>
            <span className="text-xs font-mono font-bold text-[#0F766E]">{progressPercent}% Completed</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#FAF9F6] rounded-full border border-[#E3E2DF] overflow-hidden">
            <div className="bg-[#0F766E] h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {checklistItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded border border-[#E3E2DF]/60">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${
                    checklist[item.key] ? 'text-[#0F766E]' : 'text-outline opacity-40'
                  }`}>
                    {checklist[item.key] ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className={`font-semibold ${checklist[item.key] ? 'text-primary' : 'text-[#5E6266]'}`}>
                    {item.label}
                  </span>
                </div>
                
                {!checklist[item.key] && (
                  <div>
                    {item.key === 'firstUser' && (
                      <Link
                        href="/organization/users/invite"
                        className="text-[10px] font-bold text-[#0F766E] uppercase hover:underline"
                      >
                        Invite Team
                      </Link>
                    )}
                    {item.key === 'firstSync' && (
                      <button
                        onClick={handleSyncDataSimulated}
                        className="text-[10px] font-bold text-[#0F766E] bg-transparent border-0 hover:underline cursor-pointer uppercase"
                      >
                        Trigger Ingestion
                      </button>
                    )}
                    {item.key === 'firstReport' && (
                      <Link
                        href="/reports"
                        className="text-[10px] font-bold text-[#0F766E] uppercase hover:underline"
                      >
                        Go to Exporter
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE DASHBOARD EXPERIENCE
  const points = commercialFlow?.data || [];
  let salesPath = '';
  let collectionsPath = '';
  let periods: string[] = [];

  if (points.length > 0) {
    const maxVal = Math.max(
      ...points.map((p) => Math.max(p.sales_volume || 0, p.collection_volume || 0, 1000))
    );
    
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

  const agingData = agingDistribution?.data || {
    current: 0,
    overdue_30: 0,
    overdue_60: 0,
    overdue_90: 0,
    overdue_120: 0,
    overdue_120_plus: 0,
  };
  const agingKeys = Object.keys(agingData) as (keyof typeof agingData)[];
  const maxAgingVal = Math.max(...Object.values(agingData), 1000);
  const stateData = stateDistribution?.data || {};

  return (
    <div className="space-y-xl relative">
      
      {/* Tour Step 1 Highlight: KPI Cards */}
      {tourStep === 1 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E3E2DF] p-6 max-w-sm space-y-4 font-sans text-xs text-[#243447] animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center">
              <strong className="text-sm font-bold text-[#0F766E] uppercase">1. Platform Telemetry KPIs</strong>
              <span className="text-[10px] text-outline">Step 1 of 4</span>
            </div>
            <p className="leading-relaxed">
              These key metrics represent your live commercial health. View active customer volumes, longitudinal sales, collections, and total outstanding exposure parsed directly from transaction ledgers.
            </p>
            <div className="flex justify-between items-center pt-2">
              <button onClick={skipTour} className="text-outline hover:text-primary hover:underline bg-transparent border-0 cursor-pointer">Skip Tour</button>
              <button onClick={nextTourStep} className="px-4 py-1.5 bg-[#0F766E] text-white font-bold uppercase rounded hover:brightness-110 cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Step 2 Highlight: Chart */}
      {tourStep === 2 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E3E2DF] p-6 max-w-sm space-y-4 font-sans text-xs text-[#243447] animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center">
              <strong className="text-sm font-bold text-[#0F766E] uppercase">2. Commercial Pulse</strong>
              <span className="text-[10px] text-outline">Step 2 of 4</span>
            </div>
            <p className="leading-relaxed">
              The Commercial Pulse charts weekly sales trends alongside collection activities. Divergence between these curves indicates cash flow bottlenecks and payment delays.
            </p>
            <div className="flex justify-between items-center pt-2">
              <button onClick={skipTour} className="text-outline hover:text-primary hover:underline bg-transparent border-0 cursor-pointer">Skip Tour</button>
              <button onClick={nextTourStep} className="px-4 py-1.5 bg-[#0F766E] text-white font-bold uppercase rounded hover:brightness-110 cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Step 3 Highlight: Attention Queues */}
      {tourStep === 3 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E3E2DF] p-6 max-w-sm space-y-4 font-sans text-xs text-[#243447] animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center">
              <strong className="text-sm font-bold text-[#0F766E] uppercase">3. Attention Queues</strong>
              <span className="text-[10px] text-outline">Step 3 of 4</span>
            </div>
            <p className="leading-relaxed">
              Econ-IQ segments accounts into actionable queues. The deteriorating list highlights accounts showing sudden payment delays, allowing credit teams to act before defaults occur.
            </p>
            <div className="flex justify-between items-center pt-2">
              <button onClick={skipTour} className="text-outline hover:text-primary hover:underline bg-transparent border-0 cursor-pointer">Skip Tour</button>
              <button onClick={nextTourStep} className="px-4 py-1.5 bg-[#0F766E] text-white font-bold uppercase rounded hover:brightness-110 cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Step 4 Highlight: Customer Matrix */}
      {tourStep === 4 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E3E2DF] p-6 max-w-sm space-y-4 font-sans text-xs text-[#243447] animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center">
              <strong className="text-sm font-bold text-[#0F766E] uppercase">4. Customer Matrix</strong>
              <span className="text-[10px] text-outline">Step 4 of 4</span>
            </div>
            <p className="leading-relaxed">
              Click the Customer Matrix link to view the complete list of commercial accounts, filter stateful segments, and drill down into customer risk details.
            </p>
            <div className="flex justify-between items-center pt-2">
              <button onClick={skipTour} className="text-outline hover:text-primary hover:underline bg-transparent border-0 cursor-pointer">Skip Tour</button>
              <button onClick={nextTourStep} className="px-4 py-1.5 bg-[#0F766E] text-white font-bold uppercase rounded hover:brightness-110 cursor-pointer">Finish Tour</button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Activation Checklist Header (if not 100% completed) */}
      {progressPercent < 100 && (
        <div className="bg-white border border-[#E3E2DF] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0F766E]">task_alt</span>
            <div>
              <strong className="text-[#243447] block">Econ-IQ Activation Checklist</strong>
              <span className="text-[10px] text-outline">Completed {completedCount} of 5 tasks ({progressPercent}%)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Simple progress bar */}
            <div className="flex-grow sm:w-40 bg-[#FAF9F6] h-1.5 rounded-full border border-[#E3E2DF] overflow-hidden">
              <div className="bg-[#0F766E] h-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            {/* Show remaining step link */}
            {!checklist.firstUser && (
              <Link href="/organization/users/invite" className="text-[10px] font-bold text-[#0F766E] uppercase hover:underline shrink-0">
                Next: Invite Team
              </Link>
            )}
            {checklist.firstUser && !checklist.firstReport && (
              <button onClick={handleExport} className="text-[10px] font-bold text-[#0F766E] uppercase hover:underline shrink-0 bg-transparent border-0 cursor-pointer">
                Next: Export Report
              </button>
            )}
          </div>
        </div>
      )}

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
            className="flex-1 sm:flex-none px-md py-2 bg-surface border border-secondary text-secondary font-sans font-semibold text-xs rounded hover:bg-surface-container-low transition-colors flex items-center justify-center gap-xs cursor-pointer bg-white"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Reports
          </button>
          <Link
            href="/customers"
            className="flex-1 sm:flex-none px-md py-2 bg-[#0F766E] text-white font-sans font-semibold text-xs rounded hover:brightness-110 transition-colors shadow-sm flex items-center justify-center gap-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            Customer Matrix
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md ${tourStep === 1 ? 'ring-4 ring-[#0F766E] rounded-lg' : ''}`}>
        <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col justify-between h-36 bg-white">
          <div className="flex justify-between items-start">
            <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">Active Customers</span>
            <span className="material-symbols-outlined text-outline text-[20px]">groups</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline text-3xl font-extrabold text-primary">
              {overview?.active_customers || 0}
            </span>
            {overview && overview.comparison_deltas && (
              <div className="flex items-center gap-xs text-xs font-semibold text-brand-accent">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+{overview.comparison_deltas.active_customers}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col justify-between h-36 bg-white">
          <div className="flex justify-between items-start">
            <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">Total Sales (365d)</span>
            <span className="material-symbols-outlined text-outline text-[20px]">payments</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline text-3xl font-extrabold text-primary">
              {overview ? formatCurrency(overview.sales_total) : '$0.00'}
            </span>
            {overview && overview.comparison_deltas && (
              <div className="flex items-center gap-xs text-xs font-semibold text-brand-accent">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+{overview.comparison_deltas.sales_total}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col justify-between h-36 bg-white">
          <div className="flex justify-between items-start">
            <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">Collections Total</span>
            <span className="material-symbols-outlined text-outline text-[20px]">account_balance_wallet</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline text-3xl font-extrabold text-primary">
              {overview ? formatCurrency(overview.collections_total) : '$0.00'}
            </span>
            {overview && overview.comparison_deltas && (
              <div className="flex items-center gap-xs text-xs font-semibold text-brand-accent">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+{overview.comparison_deltas.collections_total}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col justify-between h-36 bg-white">
          <div className="flex justify-between items-start">
            <span className="font-sans text-xs font-semibold text-outline uppercase tracking-wider">Outstanding Exposure</span>
            <span className="material-symbols-outlined text-outline text-[20px]">shield</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline text-3xl font-extrabold text-primary">
              {overview ? formatCurrency(overview.outstanding_exposure) : '$0.00'}
            </span>
            {overview && overview.comparison_deltas && (
              <div className="flex items-center gap-xs text-xs font-semibold text-error">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+{overview.comparison_deltas.outstanding_exposure}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bento Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Commercial Pulse SVG Chart */}
        <div className={`lg:col-span-2 bg-surface rounded-lg border border-outline-variant flex flex-col shadow-sm bg-white ${tourStep === 2 ? 'ring-4 ring-[#0F766E] rounded-lg' : ''}`}>
          <div className="p-md lg:p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline text-base font-bold text-primary">Commercial Pulse</h3>
            <div className="flex items-center gap-md text-xs">
              <span className="flex items-center gap-xs font-sans text-outline">
                <span className="w-3 h-3 bg-[#0F766E] inline-block rounded-full"></span>
                Sales Volume
              </span>
              <span className="flex items-center gap-xs font-sans text-outline">
                <span className="w-3 h-3 bg-[#243447] inline-block rounded-full"></span>
                Collections
              </span>
            </div>
          </div>
          <div className="p-md lg:p-lg flex-1 min-h-[300px] flex flex-col justify-between">
            {points.length > 0 ? (
              <div className="w-full h-[240px] relative">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <line x1="20" y1="40" x2="480" y2="40" stroke="#e3e2df" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="20" y1="90" x2="480" y2="90" stroke="#e3e2df" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="20" y1="140" x2="480" y2="140" stroke="#e3e2df" strokeWidth="0.5" strokeDasharray="2" />
                  <path d={salesPath} fill="none" stroke="#0F766E" strokeWidth="2.5" />
                  <path d={collectionsPath} fill="none" stroke="#243447" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
                </svg>
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
        <div className="bg-surface rounded-lg border border-outline-variant flex flex-col shadow-sm bg-white">
          <div className="p-md lg:p-lg border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-headline text-base font-bold text-primary">Behavioral Segment Spread</h3>
          </div>
          <div className="p-md lg:p-lg flex-1 flex flex-col justify-around gap-sm">
            {Object.keys(stateData).length > 0 ? (
              Object.entries(stateData).map(([state, val]: [string, any]) => {
                const percentage = val.percentage;
                let colorClass = 'bg-[#0F766E]';
                if (state.toLowerCase() === 'monitor') colorClass = 'bg-[#c8a96b]';
                if (state.toLowerCase() === 'contract') colorClass = 'bg-[#243447]';
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
      <div className="bg-surface rounded-lg border border-outline-variant shadow-sm bg-white">
        <div className="p-md lg:p-lg border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-headline text-base font-bold text-primary">Receivables Aging Distribution</h3>
        </div>
        <div className="p-md lg:p-lg grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-md">
          {agingKeys.map((key) => {
            const val = agingData[key] || 0;
            const pct = (val / maxAgingVal) * 100;
            const label = key.replace('_', ' ').replace('overdue', 'Overdue');
            
            return (
              <div key={key} className="flex flex-col justify-between items-center text-center p-sm bg-surface-container-low rounded border border-outline-variant/30 h-28 bg-[#FAF9F6]">
                <span className="text-[10px] text-outline font-semibold uppercase tracking-wider">{label}</span>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0F766E] h-full" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                </div>
                <span className="font-sans text-xs font-bold text-primary mt-1">{formatCurrency(val)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attention Queues Bento Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-md ${tourStep === 3 ? 'ring-4 ring-[#0F766E] rounded-lg' : ''}`}>
        {/* Deteriorating List */}
        <div className="bg-surface rounded-lg border border-outline-variant shadow-sm flex flex-col bg-white">
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
        <div className="bg-surface rounded-lg border border-outline-variant shadow-sm flex flex-col bg-white">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline text-sm font-bold text-[#0F766E] flex items-center gap-xs">
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
                    <span className="font-headline text-xs font-bold text-[#0F766E]">
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
        <div className="bg-surface rounded-lg border border-outline-variant shadow-sm flex flex-col bg-white">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline text-sm font-bold text-[#c8a96b] flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              High Default Risks
            </h3>
            <span className="text-[10px] bg-brand-gold/10 text-[#c8a96b] px-2 py-0.5 rounded-full font-semibold">Credit Risk</span>
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
                    <span className="font-headline text-xs font-bold text-[#c8a96b]">
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
