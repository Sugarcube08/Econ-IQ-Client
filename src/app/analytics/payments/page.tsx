'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardGraphs } from '@/hooks/useDashboard';
import { usePortfolioAnalytics } from '@/hooks/queries/usePortfolioAnalytics';
import { useRiskSignals } from '@/hooks/queries/useRiskSignals';
import { formatCurrency } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import UnifiedBehaviorGraph from '@/components/ui/UnifiedBehaviorGraph';
import { DollarSign, ArrowRight } from 'lucide-react';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

function PaymentAnalyticsPageContent() {
  const { data: graphsTimeline, isLoading: isChartsLoading, isError: isChartsError } = useDashboardGraphs(365, 'monthly');
  const { data: analyticsData, isLoading: isAnalyticsLoading } = usePortfolioAnalytics();
  const { data: riskSignalsData, isLoading: isQueuesLoading } = useRiskSignals({
    page: 1,
    limit: 10,
    sort_by: 'outstanding_current',
    sort_order: 'desc'
  });

  const isLoading = isChartsLoading || isAnalyticsLoading || isQueuesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Loading payment analytics telemetry...</p>
      </div>
    );
  }

  // Aging distribution indicators from backend (Phase 5)
  const agingDist = analyticsData?.aging_distribution || {
    current: 0,
    '1_30_days': 0,
    '31_60_days': 0,
    '61_90_days': 0,
    '90_plus_days': 0
  };

  const totalOutstandingSum = (
    (agingDist.current || 0) +
    (agingDist['1_30_days'] || 0) +
    (agingDist['31_60_days'] || 0) +
    (agingDist['61_90_days'] || 0) +
    (agingDist['90_plus_days'] || 0)
  );

  // High risk collection accounts from backend
  const collectorsList = (riskSignalsData?.items || []).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Wholesale Client',
    outstanding: item.outstanding_current || 0,
    payment_delay: item.payment_delay !== undefined ? item.payment_delay : 0
  }));

  const columns: TableColumn<typeof collectorsList[0]>[] = [
    {
      key: 'customer_name',
      header: 'Customer Account',
      pinned: true,
      width: 250,
      render: (row) => (
        <div>
          <Link href={`/customer/${row.customer_id}`} className="font-semibold text-brand-accent hover:underline text-sm block">
            {row.customer_name}
          </Link>
        </div>
      )
    },
    {
      key: 'outstanding',
      header: 'Outstanding Exposure',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-primary text-sm">
          {formatCurrency(row.outstanding)}
        </span>
      )
    },
    {
      key: 'payment_delay',
      header: 'Average Delay',
      sortable: true,
      align: 'right',
      width: 160,
      render: (row) => (
        <span className="font-mono font-bold text-error text-sm">
          {row.payment_delay.toFixed(1)} Days
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Dossier',
      align: 'center',
      width: 130,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}?tab=payments`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent uppercase hover:underline"
        >
          View Payments <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )
    }
  ];

  const totalClearedVal = (graphsTimeline || []).reduce((acc, curr) => acc + (curr.portfolio_payment || 0), 0);
  const avgDso = analyticsData?.payment_analytics?.dso || 30.0;
  const avgDelay = analyticsData?.payment_analytics?.average_payment_delay_days || 0.0;
  const repaymentIndex = avgDelay <= 5.0 ? 'HEALTHY' : avgDelay <= 15.0 ? 'MONITOR_LAG' : 'CRITICAL_DELAY';

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/25 pb-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Payments & Collections Analytics</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Longitudinal telemetry of cash flow settlements, clearance velocity, and receivables metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Settlements Volume Trend */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant p-6 hover:shadow-md transition-shadow">
          <h3 className="font-headline text-xl font-bold text-primary border-b border-outline-variant/20 pb-3 mb-4 font-sans">Portfolio Behavior Timeline</h3>
          <UnifiedBehaviorGraph
            timeline={graphsTimeline || []}
            isPortfolio={true}
            isLoading={isChartsLoading}
            isError={isChartsError}
            height={260}
          />
        </div>

        {/* Aggregate Payment Vitals */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="border-b border-outline-variant/20 pb-3 flex items-center justify-between">
            <h3 className="font-headline text-lg font-bold text-primary tracking-tight">Settlements Status</h3>
            <DollarSign className="w-5 h-5 text-outline" />
          </div>
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Cleared Receivables:</span>
              <span className="font-bold text-brand-accent">{formatCurrency(totalClearedVal)}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Outstanding Balance:</span>
              <span className="font-bold text-primary">{formatCurrency(totalOutstandingSum)}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Average DSO Metric:</span>
              <span className="font-bold text-primary">{avgDso.toFixed(1)} Days</span>
            </div>
            <div className="flex justify-between font-sans">
              <span className="text-outline uppercase font-semibold">Repayment Index:</span>
              <span className="font-bold text-[#c8a96b]">{repaymentIndex}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Delinquent Accounts table */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Delinquent Account Profiles</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={collectorsList}
            isLoading={false}
            sortBy="outstanding"
            sortOrder="desc"
            density="standard"
          />
        </div>
      </div>
    </div>
  );
}

export default function PaymentAnalyticsPage() {
  return (
    <RouteErrorBoundary routeName="Payment Analytics telemetry">
      <PaymentAnalyticsPageContent />
    </RouteErrorBoundary>
  );
}
