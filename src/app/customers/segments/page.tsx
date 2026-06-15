'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCustomers } from '@/hooks/useCustomer';
import { formatCurrency } from '@/lib/utils';

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

export default function SegmentsPage() {
  const [selectedSegment, setSelectedSegment] = useState<string>('liquidity_stress');
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
      description: 'Accounts exhibiting delayed clearances, elevated DSO, and credit limit overages.',
      icon: Flame,
      color: 'border-red-200 bg-red-50 text-red-700',
      badgeVariant: 'danger' as const,
      recommendation: 'Tighten terms to Net-15 and freeze order dispatching.',
      averageRisk: '85%'
    },
    {
      id: 'monitor',
      name: 'Monitor',
      description: 'Showing minor settlement slowdowns or return inconsistencies; deserves proactive review.',
      icon: AlertTriangle,
      color: 'border-amber-200 bg-amber-50 text-amber-700',
      badgeVariant: 'warning' as const,
      recommendation: 'Send proactive payment alerts and limit credit extensions.',
      averageRisk: '62%'
    },
    {
      id: 'healthy',
      name: 'Healthy & Accelerating',
      description: 'Consistent payment cycles, expanding SKU counts, and accelerating sales volumes.',
      icon: TrendingUp,
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      badgeVariant: 'accent' as const,
      recommendation: 'Extend credit limits and propose early payment discounts.',
      averageRisk: '15%'
    },
    {
      id: 'active',
      name: 'Active Baseline',
      description: 'Accounts operating within their normal credit terms and transaction patterns.',
      icon: CheckCircle,
      color: 'border-blue-200 bg-blue-50 text-blue-700',
      badgeVariant: 'primary' as const,
      recommendation: 'Maintain standard billing parameters and monthly audits.',
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
          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">ID: {row.customer_id.slice(0, 8)}</span>
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
      key: 'risk_score',
      header: 'Risk Score',
      width: 140,
      render: (row) => <RiskIndicator score={row.risk_score} size="sm" />
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
        const actionText = row.risk_score >= 0.6 ? 'TIGHTEN_PAYMENT_TERMS' : 'EXPAND_CREDIT_LIMIT';
        const isTighten = row.risk_score >= 0.6;
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

      {/* Segment Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {segments.map((seg) => {
          const isSelected = selectedSegment === seg.id;
          const Icon = seg.icon;
          return (
            <div
              key={seg.id}
              onClick={() => {
                setSelectedSegment(seg.id);
                setPage(1);
              }}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-48 select-none ${
                isSelected 
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className={`p-1.5 rounded-lg border ${seg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant={seg.badgeVariant} size="sm">
                    Avg Risk: {seg.averageRisk}
                  </Badge>
                </div>
                <h4 className="font-headline font-bold text-sm text-slate-800 pt-1">{seg.name}</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{seg.description}</p>
              </div>
              
              <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between items-center text-[10px] text-slate-400">
                <span className="font-semibold text-teal-600 truncate max-w-[120px]">
                  {seg.recommendation}
                </span>
                {isSelected && <span className="font-bold text-teal-600 shrink-0">Active View</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Customers List */}
      <div className="space-y-3 pt-4">
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
          <div>
            <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">
              Cohort Members ({pagination.total_records})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live customer list filtered for segment: <span className="font-bold text-teal-600 uppercase">{selectedSegment.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
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
          />
        </div>
      </div>

    </PageContent>
  );
}
