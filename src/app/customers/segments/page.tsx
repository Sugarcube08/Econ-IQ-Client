'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomers } from '@/hooks/queries/useCustomers';
import { formatCurrency } from '@/lib/utils';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageToolbar from '@/components/ui/PageToolbar';
import PageContent from '@/components/ui/PageContent';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import HealthIndicator from '@/components/ui/HealthIndicator';
import RiskIndicator from '@/components/ui/RiskIndicator';
import TrendIndicator from '@/components/ui/TrendIndicator';

import { 
  ShieldAlert, 
  Clock, 
  Zap, 
  TrendingUp, 
  ArrowRight,
  Layers,
  Flame,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

function SegmentsPageContent() {
  const router = useRouter();
  const [selectedSegment, setSelectedSegment] = useState<string>('liquidity_stress');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('30d');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useCustomers({
    page,
    limit,
    sort_by: 'risk_score',
    sort_order: 'desc',
    current_state: selectedSegment,
  });

  const customers = data?.data?.customers || [];
  const pagination = data?.metadata?.pagination || {
    total_records: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  };

  const segments = [
    {
      id: 'liquidity_stress',
      name: 'Liquidity Stress',
      description: 'Accounts exhibiting delayed clearances, elevated DSO, and limit overages.',
      icon: Flame,
      color: 'border-red-200 bg-red-50 text-red-700',
      badgeVariant: 'danger' as const,
      accountsCount: '49 Accounts',
      exposure: '₹12.4M',
      trend: '↑ 6 Accounts',
      recentChanges: 'Liquidity contraction',
      recommendation: 'Tighten payment terms to Net-15 immediately',
      averageRisk: '85%'
    },
    {
      id: 'monitor',
      name: 'Monitor',
      description: 'Minor settlement slowdowns or return inconsistencies; deserves proactive review.',
      icon: AlertTriangle,
      color: 'border-amber-200 bg-amber-50 text-amber-700',
      badgeVariant: 'warning' as const,
      accountsCount: '18 Accounts',
      exposure: '₹4.2M',
      trend: '↓ 2 Accounts',
      recentChanges: 'Risk status stabilized',
      recommendation: 'Send proactive payment notifications & warnings',
      averageRisk: '62%'
    },
    {
      id: 'healthy',
      name: 'Healthy & Accelerating',
      description: 'Consistent payment cycles, expanding volumes, and stable trust indicators.',
      icon: TrendingUp,
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      badgeVariant: 'accent' as const,
      accountsCount: '152 Accounts',
      exposure: '₹28.1M',
      trend: '↑ 14 Accounts',
      recentChanges: 'Credit profile upgrades',
      recommendation: 'Extend credit limits and propose early payment discounts',
      averageRisk: '15%'
    },
    {
      id: 'active',
      name: 'Active Baseline',
      description: 'Accounts operating within their normal credit terms and transaction patterns.',
      icon: CheckCircle,
      color: 'border-blue-200 bg-blue-50 text-blue-700',
      badgeVariant: 'primary' as const,
      accountsCount: '88 Accounts',
      exposure: '₹15.6M',
      trend: 'Stable',
      recentChanges: 'Standard operations',
      recommendation: 'Maintain standard billing parameters and monthly audits',
      averageRisk: '34%'
    }
  ];


  const columns: TableColumn<any>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      pinned: true,
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
      width: 140,
      render: (row) => <HealthIndicator score={row.health_score} size="sm" />
    },
    {
      key: 'safety_score',
      header: 'Safety Score',
      width: 140,
      render: (row) => <RiskIndicator score={row.safety_score} size="sm" />
    },
    {
      key: 'outstanding_current',
      header: 'Outstanding Exposure',
      align: 'right',
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
            
            {/* Time Range Filter (Trend Evolution) */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 font-sans text-[10px] font-bold">
              <button 
                onClick={() => setTimeRange('7d')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer border-0 ${timeRange === '7d' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 bg-transparent'}`}
              >
                7D
              </button>
              <button 
                onClick={() => setTimeRange('30d')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer border-0 ${timeRange === '30d' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 bg-transparent'}`}
              >
                30D
              </button>
            </div>
          </div>

          {/* Segment Heatmap list representation */}
          <div className="space-y-4">
            {[
              { label: 'Liquidity Stress', count: 49, exposure: '₹12.4M', pct: 49 / 152 * 100, color: 'bg-red-500' },
              { label: 'Monitor', count: 18, exposure: '₹4.2M', pct: 18 / 152 * 100, color: 'bg-amber-500' },
              { label: 'Healthy & Accelerating', count: 152, exposure: '₹28.1M', pct: 100, color: 'bg-emerald-500' },
              { label: 'Active Baseline', count: 88, exposure: '₹15.6M', pct: 88 / 152 * 100, color: 'bg-blue-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans font-semibold text-slate-700">{item.label}</span>
                  <span className="text-slate-400 font-mono text-[10px] font-semibold">{item.count} accts • {item.exposure}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full transition-all duration-300`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Cohort Movement */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Cohort Movement ({timeRange === '7d' ? '7 Days' : '30 Days'})</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-red-50/50 border border-red-100 p-2.5 rounded-xl">
                <span className="text-[9px] uppercase text-red-500 font-bold block">Moved In</span>
                <strong className="text-red-700 font-headline font-bold text-sm block mt-0.5">
                  {timeRange === '7d' ? '+3' : '+14'}
                </strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl">
                <span className="text-[9px] uppercase text-emerald-500 font-bold block">Moved Out</span>
                <strong className="text-emerald-700 font-headline font-bold text-sm block mt-0.5">
                  {timeRange === '7d' ? '-2' : '-8'}
                </strong>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl">
                <span className="text-[9px] uppercase text-slate-400 font-bold block">Net Change</span>
                <strong className="text-slate-700 font-headline font-bold text-sm block mt-0.5">
                  {timeRange === '7d' ? '+1' : '+6'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Category Selector Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {segments.map((seg) => {
            const isSelected = selectedSegment === seg.id;
            const Icon = seg.icon;
            
            // Adjust segment trends according to selected range
            let trendLabel = seg.trend;
            if (timeRange === '7d') {
              if (seg.id === 'liquidity_stress') trendLabel = '↑ 1 Account';
              if (seg.id === 'monitor') trendLabel = 'Stable';
              if (seg.id === 'healthy') trendLabel = '↑ 3 Accounts';
              if (seg.id === 'active') trendLabel = '↓ 1 Account';
            }

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
                    onClick={() => alert('Recalculating behavioral segments...')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/85 text-slate-700 font-bold rounded-lg cursor-pointer transition-all uppercase text-[10px]"
                  >
                    Recalculate Segment
                  </button>
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

