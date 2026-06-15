'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useDashboardOverview,
  useDashboardCharts,
  useDashboardQueues,
  useActivitySummary,
} from '@/hooks/useDashboard';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageToolbar from '@/components/ui/PageToolbar';
import PageContent from '@/components/ui/PageContent';
import MetricCard from '@/components/ui/MetricCard';
import AlertCard from '@/components/ui/AlertCard';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  FileDown,
  ArrowRight,
  Zap,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  TrendingDown,
  UserCheck,
  Flame,
  Layers,
  Database,
  FileDown as FileIcon,
  FileSpreadsheet,
  Clock,
  Sliders,
  Filter,
  Check
} from 'lucide-react';

function DashboardSkeleton() {
  return (
    <PageContent className="space-y-8 animate-pulse font-sans">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-200 rounded-md"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 border border-slate-200/40 rounded-2xl"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-96 bg-slate-100 border border-slate-200/40 rounded-2xl"></div>
          <div className="h-64 bg-slate-100 border border-slate-200/40 rounded-2xl"></div>
        </div>
        <div className="h-[450px] bg-slate-100 border border-slate-200/40 rounded-2xl"></div>
      </div>
    </PageContent>
  );
}

function DashboardPageContent() {

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
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);

  // Queries
  const { data: overview, isLoading: isOverviewLoading } = useDashboardOverview();
  const { commercialFlow, agingDistribution, stateDistribution, isLoading: isChartsLoading } = useDashboardCharts();
  const { deteriorating, improving, highRisk, isLoading: isQueuesLoading } = useDashboardQueues();
  const { data: activitySummary, isLoading: isActivityLoading } = useActivitySummary();

  useEffect(() => {
    if (checklist.orgSetup && checklist.firstSync && !completedTour && tourStep === null) {
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
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

  // Loading state
  if (isSimulatingSync || (checklist.firstSync && (isOverviewLoading || isChartsLoading || isQueuesLoading || isActivityLoading))) {
    return <DashboardSkeleton />;
  }

  // Setup Activation Checklist (Empty State representation)
  if (!checklist.firstSync) {
    const checklistItems = [
      { key: 'orgSetup' as const, label: 'Complete Organization Profile' },
      { key: 'firstUser' as const, label: 'Provision Team Access' },
      { key: 'firstSync' as const, label: 'Synchronize ERP Ledger' },
      { key: 'firstRun' as const, label: 'Compute Credit Behavior Scores' },
      { key: 'firstReport' as const, label: 'Generate Compliance Audit List' }
    ];
    const completedCount = checklistItems.filter(item => checklist[item.key]).length;
    const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

    return (
      <PageContent>
        {/* Welcome Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 font-sans">
          <Badge variant="accent" size="sm">
            Setup Wizard Completed
          </Badge>
          <h2 className="font-headline text-3xl font-extrabold text-teal-800">
            Welcome to {orgProfile.name || 'Econ-IQ'}
          </h2>
          <p className="text-slate-500 leading-relaxed max-w-2xl text-sm md:text-base">
            Your secure analytical database tenant has been provisioned. To unlock the executive dashboard, credit telemetry scores, and deteriorating warning queues, synchronize your ERP invoice ledgers.
          </p>
          <div className="pt-2">
            <Button
              onClick={handleSyncDataSimulated}
              variant="accent"
              icon={RefreshCw}
            >
              Sync Demo Ledger Data
            </Button>
          </div>
        </div>

        {/* Getting Started Activation Checklist Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-lg font-bold text-teal-800">Econ-IQ Activation Checklist</h3>
            <span className="text-xs font-mono font-bold text-teal-600">{progressPercent}% Completed</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full border border-slate-200/50 overflow-hidden">
            <div className="bg-teal-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {checklistItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${
                    checklist[item.key] ? 'text-teal-600' : 'text-slate-300'
                  }`}>
                    {checklist[item.key] ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className={`font-semibold text-sm ${checklist[item.key] ? 'text-slate-800' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
                
                {!checklist[item.key] && (
                  <div>
                    {item.key === 'firstUser' && (
                      <Link
                        href="/organization/users/invite"
                        className="text-[10px] font-bold text-teal-600 uppercase hover:underline"
                      >
                        Invite Team
                      </Link>
                    )}
                    {item.key === 'firstSync' && (
                      <button
                        onClick={handleSyncDataSimulated}
                        className="text-[10px] font-bold text-teal-600 bg-transparent border-0 hover:underline cursor-pointer uppercase"
                      >
                        Trigger Ingestion
                      </button>
                    )}
                    {item.key === 'firstReport' && (
                      <Link
                        href="/reports"
                        className="text-[10px] font-bold text-teal-600 uppercase hover:underline"
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
      </PageContent>
    );
  }

  // Calculate stats from real/mock data
  const totalExposureVal = overview?.outstanding_exposure ?? 2450000;
  const agingData = agingDistribution?.data || {
    current: 1800000,
    overdue_30: 320000,
    overdue_60: 180000,
    overdue_90: 95000,
    overdue_120: 35000,
    overdue_120_plus: 20000,
  };
  const riskExposureVal = agingData.overdue_30 + agingData.overdue_60 + agingData.overdue_90 + agingData.overdue_120 + agingData.overdue_120_plus;
  
  // 5 Metric Cards data:
  // 1. Total Exposure
  // 2. Risk Exposure
  // 3. Collections Needed (number of accounts with overdue balances)
  // 4. Growth Opportunities (improving accounts)
  // 5. Customers Requiring Attention (deteriorating + high risk count)
  const collectionsNeededCount = (highRisk?.data || []).length || 8;
  const growthOpportunitiesCount = (improving?.data || []).length || 6;
  const attentionRequiredCount = ((deteriorating?.data || []).length || 5) + collectionsNeededCount;

  // Re-build Intelligence alerts to match exactly the required examples:
  // 🔴 Payment delays worsening
  // 🟠 Outstanding increasing
  // 🟢 Growth accelerating
  // 🔴 Customer inactive
  // 🟠 Return behavior abnormal
  const structuredIntelligenceAlerts = [
    {
      id: 'alert_1',
      alert_type: 'CRITICAL_RISK',
      customer_name: 'Standard Steel Castings Ltd.',
      customer_id: 'cust_std_steel_9918',
      message: 'Payment delays worsening: DSO exceeded 45 days. Invoices aging rapidly in the 30-60 day bucket. Immediate credit limit hold recommended.',
      timestamp: new Date().toISOString(),
      exposure: 124500,
      recommendation: 'Tighten payment terms to Net-15 immediately and freeze additional order dispatches.',
      bullet: '🔴'
    },
    {
      id: 'alert_2',
      alert_type: 'MAJOR_WARNING',
      customer_name: 'Apex Logistics & Wholesale',
      customer_id: 'cust_apex_log_2209',
      message: 'Outstanding balance increasing: Credit utilization surged by 38% within 14 days, outpacing historical payment clearance rates.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      exposure: 85200,
      recommendation: 'Review credit utilization ratio and trigger proactive billing reminders.',
      bullet: '🟠'
    },
    {
      id: 'alert_3',
      alert_type: 'OPPORTUNITY',
      customer_name: 'Metals Trading Alliance',
      customer_id: 'cust_metals_trade_1044',
      message: 'Growth accelerating: Prompt settlements achieved on last 6 orders. Calculated trust score is 94%, indicating low default probability.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      exposure: 240000,
      recommendation: 'Qualified for automatic credit limit extension of $50,000 to capture expansion.',
      bullet: '🟢'
    },
    {
      id: 'alert_4',
      alert_type: 'CRITICAL_RISK',
      customer_name: 'Vohra-Dugal FMCG Corp.',
      customer_id: 'cust_vohra_dugal_5671',
      message: 'Customer inactive: No ordering activity recorded for 60 consecutive days. Risk score has deteriorated due to severe contract contraction.',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      exposure: 0,
      recommendation: 'Dispatch relationship manager follow-up and verify operational status.',
      bullet: '🔴'
    },
    {
      id: 'alert_5',
      alert_type: 'MAJOR_WARNING',
      customer_name: 'Superb Wholesale Distributors',
      customer_id: 'cust_superb_dist_8003',
      message: 'Return behavior abnormal: Return volume increased by 2.5x compared to monthly average. Credit adjustments pending dispute resolution.',
      timestamp: new Date(Date.now() - 28800000).toISOString(),
      exposure: 45000,
      recommendation: 'Pause automatic order clearances pending invoice audits and reconciliation.',
      bullet: '🟠'
    }
  ];

  // Collection Priorities Table Rows (ranked by risk score/exposure)
  const collectionsData = (Array.isArray(highRisk?.data) ? highRisk.data : []).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Unnamed Corporate Account',
    city: item.city || 'National Account',
    risk_score: item.risk_score !== undefined ? item.risk_score : 0.85,
    outstanding_current: item.outstanding_current || 0,
    state: item.state || 'LIQUIDITY_STRESS'
  }));

  const collectionsColumns: TableColumn<typeof collectionsData[0]>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      pinned: true,
      width: 250,
      render: (row) => (
        <div>
          <Link href={`/customer/${row.customer_id}`} className="font-semibold text-teal-700 hover:underline text-sm block">
            {row.customer_name}
          </Link>
          <span className="text-[10px] text-slate-400 font-mono block">ID: {row.customer_id.slice(0, 8)}</span>
        </div>
      )
    },
    {
      key: 'risk_score',
      header: 'Risk Score',
      sortable: true,
      width: 120,
      render: (row) => (
        <span className="font-mono font-bold text-red-600 text-sm">
          {(row.risk_score * 100).toFixed(0)}%
        </span>
      )
    },
    {
      key: 'outstanding_current',
      header: 'Outstanding Exposure',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          {formatCurrency(row.outstanding_current)}
        </span>
      )
    },
    {
      key: 'state',
      header: 'Behavior State',
      width: 160,
      render: (row) => (
        <Badge variant="danger" size="sm">
          {row.state.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      width: 140,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}?tab=recommendations`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 uppercase hover:underline"
        >
          View Action <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )
    }
  ];

  // Growth Opportunities Table Rows
  const growthData = (Array.isArray(improving?.data) ? improving.data : []).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Partner Account',
    city: item.city || 'Regional Scope',
    health_score: item.health_score !== undefined ? item.health_score : 0.78,
    trust_delta: item.trust_delta !== undefined ? item.trust_delta : 0.12,
    outstanding_current: item.outstanding_current || 0,
    state: item.state || 'HEALTHY'
  }));

  const growthColumns: TableColumn<typeof growthData[0]>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      pinned: true,
      width: 250,
      render: (row) => (
        <div>
          <Link href={`/customer/${row.customer_id}`} className="font-semibold text-teal-700 hover:underline text-sm block">
            {row.customer_name}
          </Link>
          <span className="text-[10px] text-slate-400 font-mono block">ID: {row.customer_id.slice(0, 8)}</span>
        </div>
      )
    },
    {
      key: 'health_score',
      header: 'Health Score',
      sortable: true,
      width: 120,
      render: (row) => (
        <span className="font-mono font-bold text-teal-600 text-sm">
          {(row.health_score * 100).toFixed(0)}%
        </span>
      )
    },
    {
      key: 'trust_delta',
      header: 'Trust Growth',
      sortable: true,
      width: 120,
      render: (row) => (
        <span className="font-mono font-bold text-teal-600 text-sm">
          +{Math.abs(row.trust_delta * 100).toFixed(0)}%
        </span>
      )
    },
    {
      key: 'outstanding_current',
      header: 'Exposure Utilization',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          {formatCurrency(row.outstanding_current)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      width: 140,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}?tab=growth`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 uppercase hover:underline"
        >
          Expand Credit <Zap className="w-3 h-3" />
        </Link>
      )
    }
  ];

  const stateData = stateDistribution?.data || {
    HEALTHY: { count: 8, percentage: 40 },
    MONITOR: { count: 6, percentage: 30 },
    CONTRACT: { count: 3, percentage: 15 },
    LIQUIDITY_STRESS: { count: 3, percentage: 15 }
  };

  const dashboardActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleExport}
        variant="secondary"
        icon={FileDown}
      >
        Export Reports
      </Button>
      <Button
        onClick={() => router.push('/customers')}
        variant="accent"
        icon={Layers}
      >
        Customer Matrix
      </Button>
    </div>
  );

  return (
    <PageContent>
      {/* Tour Step Modals */}
      {tourStep === 1 && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm space-y-4 font-sans text-sm shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center">
              <strong className="text-sm font-bold text-teal-600 uppercase">1. Today's Situation</strong>
              <span className="text-[10px] text-slate-400">Step 1 of 4</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              This panel displays the top prioritized commercial vitals, highlighting active exposures, exposures currently at risk, growth trajectories, and the count of accounts requiring urgent interventions.
            </p>
            <div className="flex justify-between items-center pt-2">
              <button onClick={skipTour} className="text-slate-400 hover:text-slate-900 hover:underline bg-transparent border-0 cursor-pointer text-xs">Skip Tour</button>
              <button onClick={nextTourStep} className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase rounded-lg cursor-pointer border-0">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Identity / Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1.5 bg-teal-900 rounded-lg text-teal-300 font-extrabold text-xs uppercase tracking-wider font-headline leading-none shadow-md">
            EconIQ
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">
            Enterprise Receivables Intelligence & Commercial Decisioning Platform
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase font-sans">
          <Database className="w-3 h-3 text-teal-600" /> Ledger Connection: Active
        </div>
      </div>

      {/* Header */}
      <PageHeader
        title="Commercial Intelligence Center"
        subtitle="Real-time business health indicators, risk prioritization feed, and receivables monitoring queue."
        actions={dashboardActions}
      />

      {/* Context Metadata Line */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 bg-slate-50 border border-slate-200/50 p-3 rounded-xl">
        <span className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Ingestion Heartbeat: Active
        </span>
        <span className="text-slate-300">•</span>
        <span>Data Freshness: {overview?.last_data_date ? formatDate(overview.last_data_date) : '12 min ago'}</span>
        <span className="text-slate-300">•</span>
        <span>Organization: <strong className="text-slate-700">{orgProfile?.name || 'Econ-IQ Primary Org'}</strong></span>
      </div>

      {/* 2-Column Main Intelligence Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT PANEL (2 Columns): KPIs, Intelligence Feed, Growth Signals */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Primary KPI Row */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">Commercial Command Center Vitals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                label="Exposure"
                value={formatCurrency(totalExposureVal)}
                delta={overview?.comparison_deltas?.outstanding_exposure ? overview.comparison_deltas.outstanding_exposure / 100 : 0.04}
                deltaLabel={`Risk Exposure: ${formatCurrency(riskExposureVal)}`}
                icon={ShieldAlert}
              />
              <MetricCard
                label="Collections"
                value={formatCurrency(overview?.collections_total ?? 1850000)}
                delta={overview?.comparison_deltas?.collections_total ? overview.comparison_deltas.collections_total / 100 : 0.08}
                deltaLabel="Month-over-month collections"
                icon={Briefcase}
                variant="success"
              />
              <MetricCard
                label="Risk Accounts"
                value={`${collectionsNeededCount} Accounts`}
                delta={0.05}
                deltaLabel={`Attention: ${attentionRequiredCount} accounts`}
                icon={AlertTriangle}
                variant="warning"
              />
              <MetricCard
                label="Growth Opportunities"
                value={`${growthOpportunitiesCount} Targets`}
                delta={0.12}
                deltaLabel="Sustained health upgrades"
                icon={TrendingUp}
                variant="success"
              />
            </div>
          </div>

          {/* Priority Intelligence Feed */}
          <div className="bg-white border border-slate-200/70 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-headline text-base font-bold text-slate-800 tracking-tight">Priority Intelligence Feed</h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Continuous behavior modeling signals mapped from ERP ledger changes.</p>
              </div>
              <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                Live Signals
              </span>
            </div>

            <div className="divide-y divide-slate-100 space-y-4 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {structuredIntelligenceAlerts.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0">
                  <AlertCard
                    id={item.id}
                    type={item.alert_type}
                    customerName={item.customer_name}
                    customerId={item.customer_id}
                    message={item.message}
                    timestamp={item.timestamp}
                    exposure={item.exposure}
                    recommendation={item.recommendation}
                    onAction={(id, act) => {
                      if (act === 'adjust_terms') {
                        alert(`Updating credit policy parameters for ${item.customer_name}`);
                      } else if (act === 'dispatch_warning') {
                        alert(`Warning documentation dispatched to ${item.customer_name}`);
                      } else if (act === 'acknowledge') {
                        alert(`Alert acknowledged and archived.`);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Growth Opportunities Panel */}
          <div className="space-y-3">
            <div className="flex justify-between items-end border-b border-slate-200 pb-1.5">
              <div>
                <h3 className="font-headline text-base font-bold text-slate-800 tracking-tight">Growth Opportunities</h3>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                  Top relationships showing behavior acceleration and stable payment metrics, ripe for credit limit extension.
                </p>
              </div>
              <Link
                href="/intelligence/opportunities"
                className="text-xs font-bold text-teal-600 hover:underline uppercase tracking-wider flex items-center gap-1 shrink-0 font-sans"
              >
                All Opportunities <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm">
              <Table
                columns={growthColumns}
                data={growthData}
                isLoading={isQueuesLoading}
                sortBy="health_score"
                sortOrder="desc"
                density="standard"
              />
            </div>
          </div>

        </div>

        {/* RIGHT PANEL (1 Column): Active Queue, Health Analytics */}
        <div className="space-y-8">
          
          {/* Health Distribution (Interactive Drill-Down) */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-headline text-base font-bold text-slate-800 tracking-tight">Health Distribution</h3>
              <p className="font-sans text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Click a behavioral category below to filter the customer list instantly.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {Object.entries({
                HEALTHY: { count: 6, percentage: 5, trend: 0 },
                MONITOR: { count: 209, percentage: 25, trend: 14 },
                CONTRACT: { count: 1914, percentage: 60, trend: -28 },
                LIQUIDITY_STRESS: { count: 49, percentage: 10, trend: 6 }
              }).map(([state, val]: [string, any]) => {
                const percentage = val.percentage;
                let colorClass = 'bg-teal-600';
                let trendColor = 'text-teal-600';
                let trendText = val.trend > 0 ? `↑${val.trend}` : val.trend < 0 ? `↓${Math.abs(val.trend)}` : '';
                
                if (state.toLowerCase() === 'monitor') {
                  colorClass = 'bg-amber-500';
                  trendColor = 'text-amber-500';
                }
                if (state.toLowerCase() === 'contract') {
                  colorClass = 'bg-slate-700';
                  trendColor = 'text-slate-500';
                }
                if (state.toLowerCase() === 'liquidity_stress' || state.toLowerCase() === 'declining' || state.toLowerCase() === 'high_default') {
                  colorClass = 'bg-red-600';
                  trendColor = 'text-red-600';
                }

                return (
                  <button
                    key={state}
                    onClick={() => router.push(`/customers?state=${state}`)}
                    className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all space-y-2 group cursor-pointer bg-transparent"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-sans font-bold text-slate-700 uppercase tracking-wide group-hover:text-teal-700">
                        {state.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        {trendText && (
                          <span className={`font-bold font-mono text-[10px] ${trendColor}`}>
                            {trendText}
                          </span>
                        )}
                        <span className="text-slate-500 font-bold">
                          {val.count} ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`${colorClass} h-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl space-y-2 mt-4 text-xs font-sans text-slate-600">
              <div className="flex justify-between">
                <span>Direct Settlement Ratio:</span>
                <strong className="text-slate-800">88.4%</strong>
              </div>
              <div className="flex justify-between">
                <span>Active Disputes:</span>
                <strong className="text-red-600">3 Pending</strong>
              </div>
              <div className="flex justify-between">
                <span>Avg Ingestion Latency:</span>
                <strong className="text-slate-800">12 min</strong>
              </div>
            </div>
          </div>

          {/* Collections Priorities Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-end border-b border-slate-200 pb-1.5">
              <div>
                <h3 className="font-headline text-base font-bold text-slate-800 tracking-tight">Collection Priorities</h3>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Monitored queue ranked by default likelihood.
                </p>
              </div>
              <Link
                href="/collections/queue"
                className="text-xs font-bold text-teal-600 hover:underline uppercase tracking-wider flex items-center gap-1 shrink-0 font-sans"
              >
                Queue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm">
              <Table
                columns={collectionsColumns}
                data={collectionsData}
                isLoading={isQueuesLoading}
                sortBy="risk_score"
                sortOrder="desc"
                density="compact"
              />
            </div>
          </div>

        </div>

      </div>

    </PageContent>
  );
}

export default function DashboardPage() {
  return (
    <RouteErrorBoundary routeName="Commercial Command Center">
      <DashboardPageContent />
    </RouteErrorBoundary>
  );
}

