'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardCharts, useTopContributors } from '@/hooks/useDashboard';
import { formatCurrency, formatPercent } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Chart from '@/components/ui/Chart';
import { TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

function GrowthAnalyticsPageContent() {
  const { commercialFlow, isLoading: isChartsLoading } = useDashboardCharts();
  const { data: topContributors, isLoading: isContributorsLoading } = useTopContributors();

  const isLoading = isChartsLoading || isContributorsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Loading sales analytics telemetry...</p>
      </div>
    );
  }

  // Sales trend points
  const salesPoints = (Array.isArray(commercialFlow?.data) ? commercialFlow.data : []).map(p => ({
    date: p.period_start,
    value: p.sales_volume || 0
  }));

  // Top contributors list
  const contributors = (Array.isArray(topContributors) ? topContributors : []).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Commercial Account',
    contribution_percent: item.contribution_percent,
    sales_total: item.sales_total,
    trust_score: item.trust_score !== undefined ? item.trust_score : 0.8
  }));

  const columns: TableColumn<typeof contributors[0]>[] = [
    {
      key: 'customer_name',
      header: 'Customer Partner',
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
      key: 'sales_total',
      header: 'Sales Volume (365d)',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-primary text-sm">
          {formatCurrency(row.sales_total)}
        </span>
      )
    },
    {
      key: 'contribution_percent',
      header: 'Portfolio Contribution',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-brand-accent text-sm">
          {formatPercent(row.contribution_percent)}
        </span>
      )
    },
    {
      key: 'trust_score',
      header: 'Trust Score',
      sortable: true,
      width: 140,
      render: (row) => (
        <span className="font-mono font-bold text-primary">
          {(row.trust_score * 100).toFixed(0)}%
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Workspace',
      align: 'center',
      width: 130,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent uppercase hover:underline"
        >
          View dossier <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )
    }
  ];

  const totalSalesSum = salesPoints.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/25 pb-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Growth & Revenue Analytics</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Longitudinal telemetry of sales volume, contribution ratios, and customer partnership growth.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Sales Volume Trend */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant p-6 hover:shadow-md transition-shadow">
          <h3 className="font-headline text-xl font-bold text-primary border-b border-outline-variant/20 pb-3 mb-4 font-sans">Invoice Sales Trend</h3>
          <Chart
            data={salesPoints}
            type="purchase"
            title="Weekly Invoice Sales Volume"
            isLoading={false}
            height={220}
          />
        </div>

        {/* Aggregate Sales Vitals */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="border-b border-outline-variant/20 pb-3 flex items-center justify-between">
            <h3 className="font-headline text-lg font-bold text-primary tracking-tight">Revenue Status</h3>
            <TrendingUp className="w-5 h-5 text-outline" />
          </div>
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Aggregate Sales (Ledger):</span>
              <span className="font-bold text-primary">{formatCurrency(totalSalesSum)}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Top Account share:</span>
              <span className="font-bold text-brand-accent">24.5% Portfolio Concentration</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Growth Trajectory:</span>
              <span className="font-bold text-brand-accent uppercase">ACCELERATING</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline uppercase">Opportunity Index:</span>
              <span className="font-mono text-brand-gold font-bold">STIMULUS_ELAPSED</span>
            </div>
          </div>
        </div>

      </div>

      {/* Top Portfolio Contributors */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Top Portfolio Contributors</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={contributors}
            isLoading={false}
            sortBy="sales_total"
            sortOrder="desc"
            density="standard"
          />
        </div>
      </div>
    </div>
  );
}

export default function GrowthAnalyticsPage() {
  return (
    <RouteErrorBoundary routeName="Growth Analytics telemetry">
      <GrowthAnalyticsPageContent />
    </RouteErrorBoundary>
  );
}

