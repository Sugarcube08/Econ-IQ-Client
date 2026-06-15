'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardCharts, useDashboardQueues } from '@/hooks/useDashboard';
import { formatCurrency, formatPercent } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Chart from '@/components/ui/Chart';
import { ShieldAlert, ArrowRight, PieChart } from 'lucide-react';

export default function RiskAnalyticsPage() {
  const { stateDistribution, isLoading: isChartsLoading } = useDashboardCharts();
  const { highRisk, isLoading: isQueuesLoading } = useDashboardQueues();

  const isLoading = isChartsLoading || isQueuesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Compiling risk telemetry...</p>
      </div>
    );
  }

  const stateData = stateDistribution?.data || {};

  // Risk distribution points
  const riskList = (highRisk.data || []).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Wholesale Client',
    city: item.city || 'Regional Scope',
    risk_score: item.risk_score !== undefined ? item.risk_score : 0.75,
    outstanding: item.outstanding_current || 0,
    state: item.state || 'MONITOR'
  }));

  const columns: TableColumn<typeof riskList[0]>[] = [
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
      key: 'city',
      header: 'Location',
      width: 140,
      render: (row) => <span className="text-outline text-xs">{row.city}</span>
    },
    {
      key: 'risk_score',
      header: 'Risk Score Index',
      sortable: true,
      width: 150,
      render: (row) => (
        <span className="font-mono font-bold text-error text-sm">
          {(row.risk_score * 100).toFixed(0)}%
        </span>
      )
    },
    {
      key: 'outstanding',
      header: 'Balance Exposure',
      sortable: true,
      align: 'right',
      width: 170,
      render: (row) => (
        <span className="font-mono font-bold text-primary text-sm">
          {formatCurrency(row.outstanding)}
        </span>
      )
    },
    {
      key: 'state',
      header: 'Segment',
      width: 150,
      render: (row) => {
        const stateLower = row.state?.toLowerCase() || '';
        const variant = stateLower === 'active' || stateLower === 'healthy' ? 'accent' : stateLower === 'monitor' ? 'warning' : 'danger';
        return (
          <Badge variant={variant} size="sm">
            {row.state.replace('_', ' ')}
          </Badge>
        );
      }
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
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Risk Analytics Center</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Longitudinal distribution of customer default risk metrics and stateful segments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* State Distributions */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="border-b border-outline-variant/20 pb-3">
            <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Behavioral Segment Spread</h3>
          </div>
          <div className="space-y-4">
            {Object.keys(stateData).length > 0 ? (
              Object.entries(stateData).map(([state, val]: [string, any]) => {
                const percentage = val.percentage;
                let colorClass = 'bg-brand-accent';
                if (state.toLowerCase() === 'monitor') colorClass = 'bg-[#c8a96b]';
                if (state.toLowerCase() === 'contract') colorClass = 'bg-secondary';
                if (state.toLowerCase() === 'liquidity_stress' || state.toLowerCase() === 'declining') colorClass = 'bg-error';

                return (
                  <div key={state} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold font-sans">
                      <span className="uppercase tracking-wider text-primary">{state.replace('_', ' ')}</span>
                      <span className="text-outline">{val.count} accounts ({formatPercent(percentage / 100)})</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden border border-outline-variant/10">
                      <div className={`${colorClass} h-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-outline text-center py-8">No accounts recorded.</div>
            )}
          </div>
        </div>

        {/* Aggregate Risk Vitals */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="border-b border-outline-variant/20 pb-3 flex items-center justify-between">
            <h3 className="font-headline text-lg font-bold text-primary tracking-tight">Risk Index Status</h3>
            <PieChart className="w-5 h-5 text-outline" />
          </div>
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Active Monitor Share:</span>
              <span className="font-bold text-brand-gold">{(stateData.monitor?.percentage || 0).toFixed(0)}% of accounts</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Stressed Share:</span>
              <span className="font-bold text-error">{(stateData.liquidity_stress?.percentage || 0).toFixed(0)}% of accounts</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Aggregate Risk Level:</span>
              <span className="font-bold text-error">HIGH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline uppercase">Risk Severity SLA:</span>
              <Badge variant="warning" size="sm">TIGHTEN_CREDIT_POLICY</Badge>
            </div>
          </div>
        </div>

      </div>

      {/* Stressed Accounts table */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Stressed Accounts Queue</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={riskList}
            isLoading={false}
            sortBy="risk_score"
            sortOrder="desc"
            density="standard"
          />
        </div>
      </div>

    </div>
  );
}
