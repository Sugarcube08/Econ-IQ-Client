'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomers } from '@/hooks/queries/useCustomers';
import { ReportService } from '@/services/report.service';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageToolbar from '@/components/ui/PageToolbar';
import PageContent from '@/components/ui/PageContent';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import HealthIndicator from '@/components/ui/HealthIndicator';
import RiskIndicator from '@/components/ui/RiskIndicator';
import TrendIndicator from '@/components/ui/TrendIndicator';

import { 
  FileDown, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  Zap,
  TrendingUp,
  UserCheck,
  TrendingDown,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

function AuthenticatedCustomers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stateParam = searchParams?.get('state') || '';
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('trust_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stateFilter, setStateFilter] = useState<string>(stateParam.toUpperCase());
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (stateParam) {
      setStateFilter(stateParam.toUpperCase());
    }
  }, [stateParam]);

  useEffect(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, [search]);

  const params = {
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(stateFilter ? { current_state: stateFilter } : {}),
  };

  const { data, isLoading, isError } = useCustomers(params);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await ReportService.downloadCustomersCsv({
        search: debouncedSearch,
        current_state: stateFilter,
      });
      ReportService.triggerDownload(blob);
    } catch (e) {
      console.error('Failed to export CSV:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const customers = (data && data.data && Array.isArray(data.data.customers)) ? data.data.customers : [];
  const pagination = data?.metadata?.pagination || {
    page: 1,
    limit: 10,
    total_records: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  };

  // Standardized Table Columns matching Phase 5 requirements:
  // Customer, Health, Risk, Outstanding, Trend, Recommended Action
  const columns: TableColumn<any>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      pinned: true,
      width: 250,
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Link href={`/customer/${row.customer_id}`} className="font-semibold text-teal-700 hover:underline block text-sm">
            {row.customer_name || 'Anonymous Customer'}
          </Link>
        </div>
      )
    },
    {
      key: 'health_score',
      header: 'Health Score',
      sortable: true,
      width: 140,
      render: (row) => <HealthIndicator score={row.health_score} size="sm" />
    },
    {
      key: 'safety_score',
      header: 'Safety Score',
      sortable: true,
      width: 140,
      render: (row) => <RiskIndicator score={row.safety_score} size="sm" />
    },
    {
      key: 'outstanding_current',
      header: 'Outstanding Exposure',
      sortable: true,
      align: 'right',
      width: 170,
      render: (row) => <span className="font-mono font-bold text-slate-900 text-sm">{formatCurrency(row.outstanding_current)}</span>
    },
    {
      key: 'trend',
      header: 'Trend',
      width: 120,
      render: (row) => <TrendIndicator value={row.deltas?.health_score || 0} size="sm" />
    },
    {
      key: 'recommended_action',
      header: 'Recommended Action',
      width: 220,
      render: (row) => {
        const actionText = row.safety_score <= 0.4 ? 'TIGHTEN_PAYMENT_TERMS' : 'EXPAND_CREDIT_LIMIT';
        const isTighten = row.safety_score <= 0.4;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/customer/${row.customer_id}?tab=recommendations`}
              className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase hover:underline ${
                isTighten ? 'text-red-600' : 'text-teal-600'
              }`}
            >
              {actionText.replace(/_/g, ' ')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      }
    }
  ];

  // Refactored Row Expansion with explicit sections:
  // Recent Activity, Payment Trend, Risk Drivers, Growth Signals, Recommendations
  const renderRowExpansion = (row: any) => {
    const isStressed = row.safety_score <= 0.4;
    
    // Derived values
    const positiveDrivers = ['HIGH_TRADE_REGULARITY', 'FAST_SETTLEMENT', 'LOW_CUSTOMER_RG', 'STABLE_PARTICIPATION'];
    const negativeDrivers = ['SLOW_SETTLEMENT', 'LIQUIDITY_STRESS', 'INCONSISTENT_TRADING', 'CRITICAL_BEHAVIORAL_STRESS'];

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-sans text-xs pt-2 pb-4 px-2 border-t border-slate-100 bg-slate-50/20">
        
        {/* 1. Recent Activity */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5 shadow-sm">
          <span className="font-headline font-bold text-[10px] text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">
            1. Recent Activity
          </span>
          <div className="space-y-2 text-slate-500">
            <div className="leading-tight">
              <span className="font-mono text-[9px] text-slate-400 block">06/10/2026</span>
              <p className="font-medium text-slate-700 mt-0.5">Invoice INV-2026-981 settled (₹24,150.00)</p>
            </div>
            <div className="leading-tight">
              <span className="font-mono text-[9px] text-slate-400 block">05/28/2026</span>
              <p className="font-medium text-slate-700 mt-0.5">Order executed ORD-2026-441 (₹48,250.00)</p>
            </div>
          </div>
        </div>

        {/* 2. Payment Trend */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5 shadow-sm">
          <span className="font-headline font-bold text-[10px] text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">
            2. Payment Trend
          </span>
          <div className="space-y-2 text-slate-500">
            <div>
              <span className="text-slate-400 block font-medium">Avg settlement velocity:</span>
              <strong className="text-slate-800 text-sm font-mono mt-0.5 block">14.2 Days (Net-30)</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Overdue delinquency:</span>
              <span className={`font-semibold block mt-0.5 ${isStressed ? 'text-red-600' : 'text-emerald-600'}`}>
                {isStressed ? 'Slightly slow clearance' : 'Prompt payment cycle'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Risk Drivers */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5 shadow-sm">
          <span className="font-headline font-bold text-[10px] text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">
            3. Risk Drivers
          </span>
          <div className="space-y-1.5">
            {isStressed ? (
              <div className="space-y-1">
                <Badge variant="danger" size="sm">LIQUIDITY_STRESS</Badge>
                <p className="text-slate-500 text-[11px] leading-tight">Aging outstanding balances exceed credit limit rules.</p>
              </div>
            ) : (
              <p className="text-slate-400 italic font-medium pt-1">No significant risk drivers identified.</p>
            )}
          </div>
        </div>

        {/* 4. Growth Signals */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5 shadow-sm">
          <span className="font-headline font-bold text-[10px] text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">
            4. Growth Signals
          </span>
          <div className="space-y-1.5">
            {!isStressed ? (
              <div className="space-y-1">
                <Badge variant="accent" size="sm">HIGH_TRADE_REGULARITY</Badge>
                <p className="text-slate-500 text-[11px] leading-tight">Order volume increasing alongside prompt settlements.</p>
              </div>
            ) : (
              <p className="text-slate-400 italic font-medium pt-1">Growth capacity muted by active exposures.</p>
            )}
          </div>
        </div>

        {/* 5. Recommendations */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="font-headline font-bold text-[10px] text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">
              5. Recommendations
            </span>
            <p className="text-slate-600 font-medium leading-relaxed mt-2">
              {isStressed 
                ? 'Tighten credit limits, suspend Net-30 term privileges.' 
                : 'Offer Net-45 term rewards or expand credit allocation.'}
            </p>
          </div>
          <div className="pt-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Link 
              href={`/customer/${row.customer_id}`} 
              className="w-full text-center px-2 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-[10px] rounded-lg transition-colors uppercase tracking-wider block"
            >
              Analyze Dossier
            </Link>
          </div>
        </div>

      </div>
    );
  };

  const headerActions = (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="secondary"
      icon={FileDown}
    >
      {isExporting ? 'Exporting...' : 'Export Filtered CSV'}
    </Button>
  );

  return (
    <PageContent>
      <PageHeader
        title="Customer Intelligence Workspace"
        subtitle="Stateful credit analysis matrix. Click on any row to expand behavioral memory layers and recommended actions."
        actions={headerActions}
      />

      <PageToolbar>
        <div className="flex flex-1 items-center gap-4 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 text-xs text-slate-800 placeholder:text-slate-400"
              placeholder="Search by ID, name, or location..."
            />
          </div>

          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20"
          >
            <option value="">All Segment States</option>
            <option value="active">Active</option>
            <option value="declining">Declining</option>
            <option value="healthy">Healthy</option>
            <option value="monitor">Monitor</option>
            <option value="contract">Contract</option>
            <option value="liquidity_stress">Liquidity Stress</option>
          </select>

          {stateFilter || debouncedSearch ? (
            <button
              onClick={() => {
                setSearch('');
                setStateFilter('');
                setPage(1);
              }}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer bg-transparent border-0"
            >
              Clear Filters
            </button>
          ) : null}
        </div>

        <div className="text-xs text-slate-400 font-semibold shrink-0">
          Showing {Math.min(pagination.total_records, (page - 1) * limit + 1)}-
          {Math.min(pagination.total_records, page * limit)} of {pagination.total_records} records
        </div>
      </PageToolbar>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <Table
          columns={columns}
          data={customers}
          isLoading={isLoading}
          isError={isError}
          errorMessage="Could not retrieve customer records. Ensure the core API service is active."
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          page={page}
          totalPages={pagination.total_pages}
          onPageChange={(p) => setPage(p)}
          hasPrevious={pagination.has_previous}
          hasNext={pagination.has_next}
          renderRowExpansion={renderRowExpansion}
          emptyState={
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4 max-w-md mx-auto font-sans">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">group</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  No customer records available yet.
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                  To get started, synchronize your ERP invoice ledgers, import billing tables from CSV, or manually provision corporate accounts.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <button
                  onClick={() => alert('Triggering ERP sync...')}
                  className="px-4 py-2 bg-teal-600 text-white font-bold uppercase tracking-wider rounded text-[10px] hover:brightness-110 transition-colors shadow-sm cursor-pointer border-0"
                >
                  Connect ERP source
                </button>
                <button
                  onClick={() => alert('Opening CSV import dialog...')}
                  className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 font-bold uppercase tracking-wider rounded text-[10px] hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Import CSV
                </button>
                <button
                  onClick={() => alert('Opening manual creator...')}
                  className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 font-bold uppercase tracking-wider rounded text-[10px] hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Create Customer
                </button>
              </div>
            </div>
          }
        />
      </div>
    </PageContent>
  );
}

function PublicCustomers() {
  const caseStudies = [
    {
      company: 'Standard Steel Castings Ltd.',
      initials: 'SC',
      industry: 'Heavy Manufacturing & Distribution',
      metric: 'DSO -18.4 Days',
      metricLabel: 'Working Capital Cycle Acceleration',
      description: 'Econ-IQ synchronized our ERP ledgers and highlighted payment delays before our quarterly close, saving us millions in working capital by active automated credit terms adaptation.',
      challenge: 'Average DSO exceeded 58 days. credit exposures across 120 regional distributor accounts were completely unmonitored.',
      solution: 'Automated ledger analysis computes continuous payment scores, triggering proactive term modifications.',
    },
    {
      company: 'Apex Logistics & Wholesale Supply',
      initials: 'AL',
      industry: 'Industrial Supply & Wholesale',
      metric: '-32.5%',
      metricLabel: 'Reduction in Credit Delinquency',
      description: 'We replaced outdated manual credit checks with Econ-IQs live behavioral intelligence scores, dramatically dropping default rates in our wholesale channels.',
      challenge: 'Manual credit reports were compiled monthly and missed live order surges and regional payment delays.',
      solution: 'Real-time ingestion of invoice data updates customer trust and payment profiles on every order execution.',
    },
    {
      company: 'Vohra-Dugal FMCG Corporation',
      initials: 'VD',
      industry: 'FMCG Distribution Network',
      metric: '2.8x',
      metricLabel: 'Increase in Collections Efficiency',
      description: 'By prioritizing high-risk, high-exposure accounts based on active risk buckets rather than nominal invoice age, we managed cash flow recovery rates.',
      challenge: 'Our collections staff spent 80% of their time chasing small, low-risk invoices while massive exposures aged silently.',
      solution: 'Stateful customer segmentation automatically queues outstanding accounts based on live liquidity stress flags.',
    },
    {
      company: 'Metals Trading Alliance',
      initials: 'MT',
      industry: 'Commodities Trading & Logistics',
      metric: '₹4.2M',
      metricLabel: 'Released Working Capital',
      description: 'Within 90 days of deploying Econ-IQ, we identified and resolved hidden bottlenecks in our billing and dispute management workflows.',
      challenge: 'Disputes over freight charges lingered for months, stalling payments and bloating total outstanding balances.',
      solution: 'Consolidated commercial analytics matches invoices with delivery signals, raising dispute alerts instantly.',
    }
  ];

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-[1280px] mx-auto text-center space-y-4">
        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block">Case Studies</span>
        <h2 className="text-3xl font-extrabold text-teal-800">Validated Business Outcomes</h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          Explore how leading industrial enterprise manufacturers, distributors, and wholesalers convert ledger signals into stateful liquidity improvements.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {caseStudies.map((study, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="font-bold text-slate-900 text-base block">{study.company}</span>
                <span className="text-[10px] text-slate-400 block">{study.industry}</span>
              </div>
              <span className="text-xl font-extrabold text-teal-600">{study.metric}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{study.description}</p>
            <div className="space-y-1 text-[11px] text-slate-500">
              <p><strong>Challenge:</strong> {study.challenge}</p>
              <p><strong>Solution:</strong> {study.solution}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AuthenticatedCustomers />
    </Suspense>
  ) : (
    <PublicCustomers />
  );
}
