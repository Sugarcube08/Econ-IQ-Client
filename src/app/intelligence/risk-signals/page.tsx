'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardQueues } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { ShieldAlert, ArrowRight, Flame, AlertTriangle } from 'lucide-react';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

function RiskSignalsPageContent() {
  const { deteriorating, highRisk, isLoading } = useDashboardQueues();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Profiling ledger risk scores...</p>
      </div>
    );
  }

  // Combine queues for full view
  const combinedRiskList = [
    ...(Array.isArray(highRisk?.data) ? highRisk.data : []).map(item => ({
      customer_id: item.customer_id,
      customer_name: item.customer_name || 'Corporate Debtor',
      city: item.city || 'National Account',
      risk_score: item.risk_score !== undefined ? item.risk_score : 0.82,
      delta: item.trust_delta !== undefined ? item.trust_delta : -0.15,
      outstanding: item.outstanding_current || 0,
      severity: 'CRITICAL_RISK' as const
    })),
    ...(Array.isArray(deteriorating?.data) ? deteriorating.data : []).map(item => ({
      customer_id: item.customer_id,
      customer_name: item.customer_name || 'Deteriorating Retailer',
      city: item.city || 'Regional Scope',
      risk_score: item.risk_score !== undefined ? item.risk_score : 0.58,
      delta: item.trust_delta !== undefined ? item.trust_delta : -0.08,
      outstanding: item.outstanding_current || 0,
      severity: 'DETERIORATING_TREND' as const
    }))
  ];

  const columns: TableColumn<typeof combinedRiskList[0]>[] = [
    {
      key: 'customer_name',
      header: 'Customer Account',
      sortable: true,
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
      header: 'Risk Score',
      sortable: true,
      width: 120,
      render: (row) => (
        <span className="font-mono font-bold text-error text-sm">
          {(row.risk_score * 100).toFixed(0)}%
        </span>
      )
    },
    {
      key: 'delta',
      header: 'Trust Score drop',
      sortable: true,
      width: 150,
      render: (row) => (
        <span className="font-mono font-semibold text-error text-xs">
          {row.delta < 0 ? '' : '-'}{(row.delta * 100).toFixed(1)}%
        </span>
      )
    },
    {
      key: 'outstanding',
      header: 'Exposure Balance',
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
      key: 'severity',
      header: 'Alert Class',
      width: 160,
      render: (row) => {
        const isCritical = row.severity === 'CRITICAL_RISK';
        return (
          <Badge variant={isCritical ? 'danger' : 'warning'} size="sm">
            {row.severity.replace('_', ' ')}
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

  const totalAtRiskVal = combinedRiskList.reduce((acc, curr) => acc + curr.outstanding, 0);

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
            <span className="font-headline text-3xl font-extrabold text-error">{combinedRiskList.length}</span>
          </div>
          <div className="p-3 bg-error/10 text-error rounded-lg border border-error/20">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Exposed Exposure at Risk</span>
            <span className="font-headline text-3xl font-extrabold text-primary">{formatCurrency(totalAtRiskVal)}</span>
          </div>
          <div className="p-3 bg-surface-container-high text-primary rounded-lg border border-outline-variant/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Risk Severity Trend</span>
            <span className="font-headline text-2xl font-extrabold text-brand-gold">HIGH_MONITOR</span>
          </div>
          <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg border border-brand-gold/25">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Stressed Accounts Queue</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={combinedRiskList}
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

export default function RiskSignalsPage() {
  return (
    <RouteErrorBoundary routeName="Risk Signals telemetry">
      <RiskSignalsPageContent />
    </RouteErrorBoundary>
  );
}

