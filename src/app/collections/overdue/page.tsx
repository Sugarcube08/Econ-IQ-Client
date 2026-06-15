'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardCharts, useDashboardQueues } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Chart from '@/components/ui/Chart';
import { Clock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function OverdueAnalysisPage() {
  const { agingDistribution, commercialFlow, isLoading: isChartsLoading } = useDashboardCharts();
  const { highRisk, isLoading: isQueuesLoading } = useDashboardQueues();

  const isLoading = isChartsLoading || isQueuesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Analyzing ledger aging structures...</p>
      </div>
    );
  }

  const agingData = agingDistribution?.data || {
    current: 0,
    overdue_30: 0,
    overdue_60: 0,
    overdue_90: 0,
    overdue_120: 0,
    overdue_120_plus: 0,
  };

  const maxAgingVal = Math.max(...Object.values(agingData), 1000);
  const agingKeys = Object.keys(agingData) as (keyof typeof agingData)[];

  // Overdue chart values
  const flowPoints = (commercialFlow?.data || []).map(p => ({
    date: p.period_start,
    value: p.outstanding_exposure || 0
  }));

  // Top overdue contributors
  const overdueContributors = (highRisk.data || []).slice(0, 5).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Corporate Debtor',
    city: item.city || 'National Account',
    outstanding: item.outstanding_current || 0,
    state: item.state || 'LIQUIDITY_STRESS'
  }));

  const columns: TableColumn<typeof overdueContributors[0]>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
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
      key: 'city',
      header: 'Location',
      width: 140,
      render: (row) => <span className="text-outline text-xs">{row.city}</span>
    },
    {
      key: 'outstanding',
      header: 'Overdue Balance',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-error text-sm">
          {formatCurrency(row.outstanding)}
        </span>
      )
    },
    {
      key: 'state',
      header: 'Behavioral State',
      width: 160,
      render: (row) => (
        <Badge variant="danger" size="sm">
          {row.state.replace('_', ' ')}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Detail',
      align: 'center',
      width: 120,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent uppercase hover:underline"
        >
          Workspace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/25 pb-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Receivables Aging & Overdue Analysis</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Detailed breakdown of ledger age distribution and top exposure delinquencies.
          </p>
        </div>
      </div>

      {/* Aging Receivables distribution */}
      <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow">
        <h3 className="font-headline text-xl font-bold text-primary border-b border-outline-variant/20 pb-2">Receivables Aging Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {agingKeys.map((key) => {
            const val = agingData[key] || 0;
            const pct = (val / maxAgingVal) * 100;
            const label = key.replace('_', ' ').replace('overdue', 'Overdue');
            
            return (
              <div key={key} className="flex flex-col justify-between items-center text-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 h-32">
                <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">{label}</span>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden border border-outline-variant/10">
                  <div className="bg-brand-accent h-full" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                </div>
                <span className="font-mono text-xs font-extrabold text-primary mt-2">{formatCurrency(val)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Overdue Exposure Chart */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant p-6 hover:shadow-md transition-shadow">
          <h3 className="font-headline text-xl font-bold text-primary border-b border-outline-variant/20 pb-3 mb-4">Historical Exposure Vitals</h3>
          <Chart
            data={flowPoints}
            type="outstanding"
            title="Overdue Outstanding Balance Trend"
            isLoading={false}
            height={220}
          />
        </div>

        {/* Action widget */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="border-b border-outline-variant/20 pb-3 flex items-center justify-between">
            <h3 className="font-headline text-lg font-bold text-primary tracking-tight">Aging Metrics</h3>
            <Clock className="w-5 h-5 text-outline" />
          </div>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase font-semibold">Current (Not Overdue):</span>
              <span className="font-bold text-brand-accent">{formatCurrency(agingData.current)}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase font-semibold">Total Overdue:</span>
              <span className="font-bold text-error">{formatCurrency(maxAgingVal)}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase font-semibold">Overdue 90d+ Index:</span>
              <span className="font-bold text-error">{formatCurrency(agingData.overdue_90 + agingData.overdue_120 + agingData.overdue_120_plus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline uppercase font-semibold">Overdue Severity:</span>
              <Badge variant="danger" size="sm">CRITICAL_ACCUMULATION</Badge>
            </div>
          </div>
        </div>

      </div>

      {/* Top Overdue Contributors */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Top Overdue Contributors</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={overdueContributors}
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
