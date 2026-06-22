'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomers } from '@/hooks/queries/useCustomers';
import { useSegments } from '@/hooks/queries/useSegments';
import { formatCurrency } from '@/lib/utils';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageContent from '@/components/ui/PageContent';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import HealthIndicator from '@/components/ui/HealthIndicator';
import RiskIndicator from '@/components/ui/RiskIndicator';

import { 
  TrendingUp, 
  ArrowRight,
  Flame,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Clock,
  RefreshCw,
  Activity
} from 'lucide-react';

const SEGMENT_CONFIGS: Record<string, {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  badgeVariant: 'danger' | 'warning' | 'accent' | 'primary' | 'success';
  recommendation: string;
  averageRisk: string;
  recentChanges: string;
}> = {
  STRESSED: {
    name: 'Stressed',
    description: 'Accounts exhibiting severe liquidity issues, dunning actions, or delayed clearances.',
    icon: Flame,
    color: 'border-red-200 bg-red-50 text-red-700',
    badgeVariant: 'danger',
    recommendation: 'Tighten payment terms to Net-15 immediately',
    averageRisk: '85%',
    recentChanges: 'Liquidity contraction',
  },
  DISTRESSED: {
    name: 'Distressed',
    description: 'Accounts in acute financial distress or severe payment defaults.',
    icon: Flame,
    color: 'border-red-300 bg-red-100 text-red-800',
    badgeVariant: 'danger',
    recommendation: 'Initiate collection agency proceedings or legal action',
    averageRisk: '95%',
    recentChanges: 'Severe defaults detected',
  },
  DECLINING: {
    name: 'Declining',
    description: 'Accounts showing deteriorating credit health and safety indicators.',
    icon: TrendingDown,
    color: 'border-red-100 bg-red-50/50 text-red-600',
    badgeVariant: 'danger',
    recommendation: 'Reduce credit limit exposure and set strict dunning triggers',
    averageRisk: '75%',
    recentChanges: 'Risk status downgrades',
  },
  OVERLEVERAGED: {
    name: 'Overleveraged',
    description: 'Accounts with credit utilization exceeding safe limits relative to trading volume.',
    icon: AlertTriangle,
    color: 'border-amber-200 bg-amber-50 text-amber-700',
    badgeVariant: 'warning',
    recommendation: 'Hold further credit extensions and request advance payment',
    averageRisk: '65%',
    recentChanges: 'Credit ceiling reached',
  },
  RECOVERING: {
    name: 'Recovering',
    description: 'Accounts displaying positive signs of repayment following a distressed period.',
    icon: RefreshCw,
    color: 'border-orange-200 bg-orange-50 text-orange-700',
    badgeVariant: 'warning',
    recommendation: 'Monitor payments closely, maintain current terms',
    averageRisk: '45%',
    recentChanges: 'Stabilizing payments',
  },
  DORMANT: {
    name: 'Dormant',
    description: 'Inactive trading accounts with minimal transaction or clearance activity.',
    icon: Clock,
    color: 'border-slate-200 bg-slate-50 text-slate-700',
    badgeVariant: 'primary',
    recommendation: 'Initiate reactivation outreach campaigns',
    averageRisk: '30%',
    recentChanges: 'Transaction frequency drop',
  },
  HEALTHY: {
    name: 'Healthy',
    description: 'Consistent payment cycles, stable risk profiles, and optimal transaction cadence.',
    icon: CheckCircle,
    color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    badgeVariant: 'accent',
    recommendation: 'Propose credit limit expansion & early payment discounts',
    averageRisk: '15%',
    recentChanges: 'Credit profile upgrades',
  },
  GROWING: {
    name: 'Growing',
    description: 'Accounts expanding transaction volume with solid repayment indicators.',
    icon: TrendingUp,
    color: 'border-teal-200 bg-teal-50 text-teal-700',
    badgeVariant: 'accent',
    recommendation: 'Offer incentive-based terms and expand limits',
    averageRisk: '10%',
    recentChanges: 'Expanding sales volumes',
  },
  EXPANDING: {
    name: 'Expanding',
    description: 'Accounts with rising credit capacity and transaction volume.',
    icon: ArrowRight,
    color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    badgeVariant: 'accent',
    recommendation: 'Strengthen partnership terms and optimize line capacity',
    averageRisk: '8%',
    recentChanges: 'Scaling credit capacity',
  },
};

const getSegmentConfig = (state: string) => {
  const key = state.toUpperCase();
  if (SEGMENT_CONFIGS[key]) return SEGMENT_CONFIGS[key];
  return {
    name: state.charAt(0).toUpperCase() + state.slice(1).toLowerCase(),
    description: `Accounts classified under ${state.toLowerCase()} segment.`,
    icon: CheckCircle,
    color: 'border-slate-200 bg-slate-50 text-slate-700',
    badgeVariant: 'primary' as const,
    recommendation: 'Maintain standard monitoring and credit terms',
    averageRisk: '—',
    recentChanges: 'Status updated',
  };
};

const statePriority: Record<string, number> = {
  DISTRESSED: 1,
  STRESSED: 2,
  DECLINING: 3,
  OVERLEVERAGED: 4,
  RECOVERING: 5,
  DORMANT: 6,
  HEALTHY: 7,
  GROWING: 8,
  EXPANDING: 9,
};

function SegmentsPageContent() {
  const router = useRouter();
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [sortBy, setSortBy] = useState<string>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dynamic segments data from backend
  const { data: segmentsData } = useSegments();

  // Automatically select the first segment once backend data loads
  React.useEffect(() => {
    if (segmentsData?.items && segmentsData.items.length > 0 && !selectedSegment) {
      const firstState = segmentsData.items[0].current_state || segmentsData.items[0].state;
      setSelectedSegment(firstState.toLowerCase());
    }
  }, [segmentsData, selectedSegment]);

  const { data, isLoading, isError } = useCustomers({
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
    current_state: selectedSegment || undefined,
  });

  const customers = data?.data?.customers || [];
  const pagination = data?.metadata?.pagination || {
    total_records: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  };

  const mappedSegments = useMemo(() => {
    const list = [...(segmentsData?.items || [])];
    list.sort((a, b) => {
      const aState = (a.current_state || a.state || '').toUpperCase();
      const bState = (b.current_state || b.state || '').toUpperCase();
      const aPriority = statePriority[aState] ?? 100;
      const bPriority = statePriority[bState] ?? 100;
      return aPriority - bPriority;
    });

    return list.map(backendItem => {
      const stateKey = backendItem.current_state || backendItem.state;
      const id = stateKey.toLowerCase();
      const config = getSegmentConfig(stateKey);

      const count = backendItem.count ?? 0;
      const exposureVal = backendItem.exposure || backendItem.outstanding || 0;
      const netChange = backendItem.net_change ?? backendItem.trend ?? 0;

      const trendText = netChange > 0 
        ? `↑ ${netChange} Account${netChange > 1 ? 's' : ''}` 
        : netChange < 0 
          ? `↓ ${Math.abs(netChange)} Account${Math.abs(netChange) > 1 ? 's' : ''}` 
          : 'Stable';

      return {
        id,
        name: config.name,
        description: config.description,
        icon: config.icon,
        color: config.color,
        badgeVariant: config.badgeVariant,
        accountsCount: `${count} Account${count !== 1 ? 's' : ''}`,
        exposure: formatCurrency(exposureVal),
        trend: trendText,
        rawCount: count,
        rawExposure: exposureVal,
        rawNetChange: netChange,
        rawIn: backendItem.movement_in || 0,
        rawOut: backendItem.movement_out || 0,
        recommendation: config.recommendation,
        averageRisk: config.averageRisk,
        recentChanges: config.recentChanges,
      };
    });
  }, [segmentsData]);

  const handleSort = (key: string) => {
    let backendKey = key;
    if (key === 'safety_score') {
      backendKey = 'risk_score';
    }
    const isAsc = sortBy === backendKey && sortOrder === 'asc';
    setSortBy(backendKey);
    setSortOrder(isAsc ? 'desc' : 'asc');
    setPage(1);
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      pinned: true,
      sortable: true,
      width: 250,
      render: (row) => (
        <div>
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
      align: 'right',
      sortable: true,
      width: 170,
      render: (row) => <span className="font-mono font-bold text-slate-900 text-sm">{formatCurrency(row.outstanding_current)}</span>
    },
    {
      key: 'recommended_action',
      header: 'Recommended Policy Action',
      width: 220,
      render: (row) => {
        const actionText = row.safety_score <= 0.4 ? 'TIGHTEN_PAYMENT_TERMS' : 'EXPAND_CREDIT_LIMIT';
        const isTighten = row.safety_score <= 0.4;
        return (
          <Link
            href={`/customer/${row.customer_id}?tab=recommendations`}
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase hover:underline ${
              isTighten ? 'text-red-600' : 'text-teal-600'
            }`}
          >
            {actionText.replace(/_/g, ' ')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        );
      }
    }
  ];

  return (
    <PageContent>
      <PageHeader
        title="Behavioral Customer Segments"
        subtitle="Manage stateful customer cohorts categorized automatically by commercial payment signals."
      />

      {/* Top Section: Analytical Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Behavioral Heatmap & Movement Stats */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-headline text-base font-bold text-slate-800 tracking-tight">Segment Heatmap</h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Distribution of accounts and active exposures.</p>
            </div>
          </div>

          {/* Segment Heatmap list representation */}
          <div className="space-y-4">
            {mappedSegments.map((item, idx) => {
              const totalExposure = mappedSegments.reduce((sum, s) => sum + s.rawExposure, 0) || 1;
              const pct = (item.rawExposure / totalExposure) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-semibold text-slate-700">{item.name}</span>
                    <span className="text-slate-400 font-mono text-[10px] font-semibold">{item.accountsCount} • {item.exposure}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${item.id === 'stressed' || item.id === 'distressed' || item.id === 'declining' ? 'bg-red-500' : item.id === 'overleveraged' || item.id === 'recovering' ? 'bg-amber-500' : item.id === 'healthy' || item.id === 'growing' || item.id === 'expanding' ? 'bg-emerald-500' : 'bg-blue-500'} h-full transition-all duration-300`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cohort Movement */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Cohort Movement (WoW)</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-red-50/50 border border-red-100 p-2.5 rounded-xl">
                <span className="text-[9px] uppercase text-red-500 font-bold block">Moved In</span>
                <strong className="text-red-700 font-headline font-bold text-sm block mt-0.5">
                  +{mappedSegments.reduce((sum, s) => sum + s.rawIn, 0)}
                </strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl">
                <span className="text-[9px] uppercase text-emerald-500 font-bold block">Moved Out</span>
                <strong className="text-emerald-700 font-headline font-bold text-sm block mt-0.5">
                  -{mappedSegments.reduce((sum, s) => sum + s.rawOut, 0)}
                </strong>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl">
                <span className="text-[9px] uppercase text-slate-400 font-bold block">Net Change</span>
                <strong className={`${mappedSegments.reduce((sum, s) => sum + s.rawNetChange, 0) >= 0 ? 'text-teal-700' : 'text-red-700'} font-headline font-bold text-sm block mt-0.5`}>
                  {mappedSegments.reduce((sum, s) => sum + s.rawNetChange, 0) >= 0 ? '+' : ''}{mappedSegments.reduce((sum, s) => sum + s.rawNetChange, 0)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Category Selector Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mappedSegments.map((seg) => {
            const isSelected = selectedSegment === seg.id;
            const Icon = seg.icon;
            const trendLabel = seg.trend;

            return (
              <div
                key={seg.id}
                onClick={() => {
                  setSelectedSegment(seg.id);
                  setPage(1);
                }}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                  isSelected 
                    ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className={`p-1.5 rounded-lg border ${seg.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant={seg.badgeVariant} size="sm">
                      {seg.averageRisk} Risk
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-slate-800 pt-1">{seg.name}</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 mt-0.5">{seg.description}</p>
                  </div>

                  {/* Intelligence Metrics */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 border-t border-slate-100/80 text-[11px] font-sans">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Accounts</span>
                      <strong className="text-slate-700">{seg.accountsCount}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Exposure</span>
                      <strong className="text-slate-700 font-mono">{seg.exposure}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Trend</span>
                      <strong className={`font-semibold ${trendLabel.startsWith('↑') ? 'text-red-500' : trendLabel.startsWith('↓') ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {trendLabel}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Recent Changes</span>
                      <span className="text-slate-500 text-[10px] block truncate">{seg.recentChanges}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-2.5 mt-3">
                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Recommendation</span>
                  <span className="font-semibold text-teal-600 text-[11px] block mt-0.5 leading-tight">
                    {seg.recommendation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Customers List */}
      <div className="space-y-3 pt-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <div>
            <h3 className="font-headline text-base font-bold text-slate-800 tracking-tight">
              Cohort Members ({pagination.total_records})
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live customer list filtered for segment: <span className="font-bold text-teal-600 uppercase">{selectedSegment.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm">
          <Table
            columns={columns}
            data={customers}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Could not retrieve segment customer records. Verify core API connection."
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            page={page}
            totalPages={pagination.total_pages}
            onPageChange={(p) => setPage(p)}
            hasPrevious={pagination.has_previous}
            hasNext={pagination.has_next}
            density="standard"
            emptyState={
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-3 font-sans text-xs max-w-sm mx-auto">
                <span className="material-symbols-outlined text-[24px] text-slate-400 font-bold">category</span>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider">No members found</h4>
                
                <div className="text-left text-slate-500 space-y-1 my-2">
                  <p className="font-medium text-[11px] text-slate-400">Possible reasons:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    <li>No matching customers</li>
                    <li>Filters exclude all records</li>
                    <li>Segment recalculation pending</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => router.push('/customers')}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg cursor-pointer transition-all uppercase text-[10px] border-0"
                  >
                    View All Customers
                  </button>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </PageContent>
  );
}

export default function SegmentsPage() {
  return (
    <RouteErrorBoundary routeName="Behavioral Customer Segments">
      <SegmentsPageContent />
    </RouteErrorBoundary>
  );
}
