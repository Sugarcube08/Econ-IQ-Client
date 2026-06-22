'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDashboardGraphs } from '@/hooks/useDashboard';
import { useGrowthAnalytics } from '@/hooks/queries/useGrowthAnalytics';
import { formatCurrency, formatPercent } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import UnifiedBehaviorGraph from '@/components/ui/UnifiedBehaviorGraph';
import { TrendingUp, ArrowRight, Search } from 'lucide-react';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import Button from '@/components/ui/Button';

function GrowthAnalyticsPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('contribution');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load backend growth metrics and contributors list
  const { data: growthData, isLoading: isGrowthLoading } = useGrowthAnalytics({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const { data: graphsTimeline, isLoading: isChartsLoading, isError: isChartsError } = useDashboardGraphs(365, 'monthly');

  const isLoading = isGrowthLoading || isChartsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Loading sales analytics telemetry...</p>
      </div>
    );
  }

  const contributors = growthData?.items || [];
  const totalPages = growthData?.total_pages || 1;
  const totalRecords = growthData?.total || 0;

  const handleSort = (key: string) => {
    let backendKey = key;
    if (key === 'sales_volume') {
      backendKey = 'sales_volume';
    } else if (key === 'contribution') {
      backendKey = 'contribution';
    } else if (key === 'growth_rate') {
      backendKey = 'growth_rate';
    }
    const isAsc = sortBy === backendKey && sortOrder === 'asc';
    setSortBy(backendKey);
    setSortOrder(isAsc ? 'desc' : 'asc');
    setPage(1);
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      header: 'Customer Partner',
      pinned: true,
      width: 250,
      render: (row) => (
        <div>
          <Link href={`/customer/${row.customer_id}`} className="font-semibold text-brand-accent hover:underline text-sm block">
            {row.name || row.customer_name || 'Commercial Account'}
          </Link>
        </div>
      )
    },
    {
      key: 'sales_volume',
      header: 'Sales Volume (365d)',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-primary text-sm">
          {formatCurrency(row.sales_volume)}
        </span>
      )
    },
    {
      key: 'contribution',
      header: 'Portfolio Contribution',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-brand-accent text-sm">
          {formatPercent(row.contribution)}
        </span>
      )
    },
    {
      key: 'growth_rate',
      header: 'Growth Rate',
      sortable: true,
      width: 140,
      render: (row) => (
        <span className="font-mono font-bold text-primary">
          {formatPercent(row.growth_rate)}
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

  const totalSalesSum = (graphsTimeline || []).reduce((acc, curr) => acc + (curr.portfolio_purchase || 0), 0);

  // Directly bind backend values with no interpretations/heuristics
  const topAccountShareVal = growthData?.top_account_share ?? 0;
  const growthTrajectoryVal = growthData?.growth_trajectory ?? 'STABLE';
  const opportunityLabelVal = growthData?.opportunity_label ?? 'MARKET_EXPANSION';

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
          <h3 className="font-headline text-xl font-bold text-primary border-b border-outline-variant/20 pb-3 mb-4 font-sans">Portfolio Behavior Timeline</h3>
          <UnifiedBehaviorGraph
            timeline={graphsTimeline || []}
            isPortfolio={true}
            isLoading={isChartsLoading}
            isError={isChartsError}
            height={260}
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
              <span className="font-bold text-brand-accent">{formatPercent(topAccountShareVal)} Portfolio Concentration</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Growth Trajectory:</span>
              <span className="font-bold text-brand-accent uppercase">{growthTrajectoryVal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline uppercase">Opportunity Index:</span>
              <span className="font-mono text-brand-gold font-bold">{opportunityLabelVal}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Search Toolbar */}
      <div className="flex gap-2 max-w-sm bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search contributors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent bg-white text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
        </div>
      </div>

      {/* Top Portfolio Contributors */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Top Portfolio Contributors ({totalRecords})</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={contributors}
            isLoading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
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
