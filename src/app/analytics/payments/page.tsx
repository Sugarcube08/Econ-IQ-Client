'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardCharts, useDashboardQueues } from '@/hooks/useDashboard';
import { formatCurrency, formatPercent } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Chart from '@/components/ui/Chart';
import { DollarSign, ArrowRight } from 'lucide-react';

export default function PaymentAnalyticsPage() {
  const { commercialFlow, agingDistribution, isLoading: isChartsLoading } = useDashboardCharts();
  const { highRisk, isLoading: isQueuesLoading } = useDashboardQueues();

  const isLoading = isChartsLoading || isQueuesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Loading payment analytics telemetry...</p>
      </div>
    );
  }

  // Collections trend points
  const paymentPoints = (commercialFlow?.data || []).map(p => ({
    date: p.period_start,
    value: p.collection_volume || 0
  }));

  // Aging distribution indicators
  const agingData = agingDistribution?.data || {
    current: 0,
    overdue_30: 0,
    overdue_60: 0,
    overdue_90: 0,
    overdue_120: 0,
    overdue_120_plus: 0,
  };

  const totalOutstandingSum = Object.values(agingData).reduce((a, b) => a + b, 0);

  // High risk collection accounts
  const collectorsList = (highRisk.data || []).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Wholesale Client',
    city: item.city || 'Regional Scope',
    outstanding: item.outstanding_current || 0,
    payment_delay: item.repayment_health_delta !== undefined ? Math.abs(item.repayment_health_delta * 40).toFixed(0) : '18'
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
          <span className="text-[10px] text-outline font-mono block">ID: {row.customer_id.slice(0, 8)}</span>
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
          {row.payment_delay} Days
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

  const totalClearedVal = paymentPoints.reduce((acc, curr) => acc + curr.value, 0);

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
          <h3 className="font-headline text-xl font-bold text-primary border-b border-outline-variant/20 pb-3 mb-4 font-sans">Settlements Pulse</h3>
          <Chart
            data={paymentPoints}
            type="payment"
            title="Weekly Invoice Settlements Clearances"
            isLoading={false}
            height={220}
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
              <span className="font-bold text-primary">34.2 Days (Target: 30)</span>
            </div>
            <div className="flex justify-between font-sans">
              <span className="text-outline uppercase font-semibold">Repayment Index:</span>
              <span className="font-bold text-[#c8a96b]">MONITOR_LAG</span>
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
