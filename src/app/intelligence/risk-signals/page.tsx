'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRiskSignals } from '@/hooks/queries/useRiskSignals';
import { usePortfolioAnalytics } from '@/hooks/queries/usePortfolioAnalytics';
import { formatCurrency } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ShieldAlert, ArrowRight, Flame, AlertTriangle, Search } from 'lucide-react';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

function RiskSignalsPageContent() {
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParam, setSearchParam] = useState('');
  const [sortBy, setSortBy] = useState('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Query risk signals from the backend (Phase 4)
  const { data, isLoading, isError } = useRiskSignals({
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
    search: searchParam || undefined,
  });

  const { data: portfolioData } = usePortfolioAnalytics();
  const riskTrend = portfolioData?.portfolio_risk_trend || 'HEALTHY';

  const items = useMemo(() => {
    return data?.items || [];
  }, [data]);

  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total || 0;

  const handleSort = (key: string) => {
    let backendKey = key;
    if (key === 'safety_score') {
      backendKey = 'risk_score'; // Risk score sorting naturally maps to safety score (just inverse)
    }
    const isAsc = sortBy === backendKey && sortOrder === 'asc';
    setSortBy(backendKey);
    setSortOrder(isAsc ? 'desc' : 'asc');
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParam(searchQuery);
    setPage(1);
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'customer_name',
      header: 'Customer Account',
      sortable: true,
      pinned: true,
      width: 250,
      render: (row) => (
        <Link href={`/customer/${row.customer_id}`} className="font-semibold text-brand-accent hover:underline text-sm block">
          {row.customer_name}
        </Link>
      )
    },
    {
      key: 'safety_score',
      header: 'Safety Score',
      sortable: true,
      width: 130,
      render: (row) => {
        const score = row.safety_score;
        let scoreColor = 'text-brand-accent';
        if (score <= 0.4) {
          scoreColor = 'text-error';
        } else if (score < 0.7) {
          scoreColor = 'text-brand-gold';
        }
        return (
          <span className={`font-mono font-extrabold text-sm ${scoreColor}`}>
            {(score * 100).toFixed(0)}%
          </span>
        );
      }
    },
    {
      key: 'trust_delta',
      header: 'Trust Score Delta',
      sortable: true,
      width: 150,
      render: (row) => {
        const delta = row.trust_delta;
        const color = delta < 0 ? 'text-error' : delta > 0 ? 'text-brand-accent' : 'text-slate-500';
        const sign = delta > 0 ? '+' : '';
        return (
          <span className={`font-mono font-semibold text-xs ${color}`}>
            {sign}{(delta * 100).toFixed(1)}%
          </span>
        );
      }
    },
    {
      key: 'outstanding_current',
      header: 'Exposure Balance',
      sortable: true,
      align: 'right',
      width: 180,
      render: (row) => (
        <span className="font-mono font-bold text-primary text-sm">
          {formatCurrency(row.outstanding_current)}
        </span>
      )
    },
    {
      key: 'state',
      header: 'Behavioral State',
      sortable: true,
      width: 160,
      render: (row) => {
        let variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'info';
        const stateStr = (row.state || 'HEALTHY').toUpperCase();
        if (stateStr === 'LIQUIDITY_STRESS' || stateStr === 'STRESSED') {
          variant = 'danger';
        } else if (stateStr === 'MONITOR' || stateStr === 'CONTRACT') {
          variant = 'warning';
        } else if (stateStr === 'HEALTHY') {
          variant = 'success';
        }
        return (
          <Badge variant={variant} size="sm">
            {stateStr.replace('_', ' ')}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      width: 130,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}?tab=recommendations`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent uppercase hover:underline"
        >
          Mitigate <ArrowRight className="w-3 h-3" />
        </Link>
      )
    }
  ];

  const totalAtRiskVal = items.reduce((acc, curr) => acc + (curr.outstanding_current || 0), 0);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/25 pb-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Risk Signals Center</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Consolidated telemetry of stressed and deteriorating credit profiles showing payment delays or defaults.
          </p>
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Stressed Accounts</span>
            <span className="font-headline text-3xl font-extrabold text-error">{totalItems}</span>
          </div>
          <div className="p-3 bg-error/10 text-error rounded-lg border border-error/20">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Page Exposure at Risk</span>
            <span className="font-headline text-3xl font-extrabold text-primary">{formatCurrency(totalAtRiskVal)}</span>
          </div>
          <div className="p-3 bg-surface-container-high text-primary rounded-lg border border-outline-variant/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Risk Severity Trend</span>
            <span className={`font-headline text-2xl font-extrabold ${
              riskTrend === 'HEALTHY' ? 'text-emerald-600' :
              riskTrend === 'MONITOR' ? 'text-amber-500' :
              riskTrend === 'CONTRACT' ? 'text-blue-500' : 'text-red-600'
            }`}>
              {riskTrend}
            </span>
          </div>
          <div className={`p-3 rounded-lg border ${
            riskTrend === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            riskTrend === 'MONITOR' ? 'bg-amber-50 text-amber-500 border-amber-100' :
            riskTrend === 'CONTRACT' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <Button type="submit" variant="accent" size="sm">
          Search
        </Button>
        {searchParam && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSearchParam('');
              setPage(1);
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Grid Table */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Stressed Accounts Queue</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={items}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Failed to retrieve risk signals from backend."
            sortBy={sortBy === 'risk_score' ? 'safety_score' : sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            hasPrevious={page > 1}
            hasNext={page < totalPages}
            density="standard"
          />
        </div>
      </div>
    </div>
  );
}

export default function RiskSignalsPage() {
  return (
    <RouteErrorBoundary routeName="Risk Signals telemetry">
      <RiskSignalsPageContent />
    </RouteErrorBoundary>
  );
}
