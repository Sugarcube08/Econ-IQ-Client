'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardQueues, useTopContributors } from '@/hooks/useDashboard';
import { formatCurrency, formatPercent } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { Zap, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

function OpportunitiesPageContent() {
  const { improving, isLoading: isQueuesLoading } = useDashboardQueues();
  const { data: topContributors, isLoading: isContributorsLoading } = useTopContributors();

  const isLoading = isQueuesLoading || isContributorsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Identifying credit expansion targets...</p>
      </div>
    );
  }

  // Map to unified list of opportunities
  const opportunitiesList = (Array.isArray(improving?.data) ? improving.data : []).map(item => {
    // Find contribution if available
    const contributor = (Array.isArray(topContributors) ? topContributors : []).find(c => c.customer_id === item.customer_id);
    const contribution = contributor ? contributor.contribution_percent : (item.outstanding_current ? (item.outstanding_current / 100000) * 0.05 : 0.02);
    
    return {
      customer_id: item.customer_id,
      customer_name: item.customer_name || 'Strategic Wholesale Client',
      city: item.city || 'National Scope',
      health_score: item.health_score !== undefined ? item.health_score : 0.76,
      trust_delta: item.trust_delta !== undefined ? item.trust_delta : 0.15,
      outstanding: item.outstanding_current || 0,
      contribution: contribution,
      tier: (item.health_score !== undefined && item.health_score >= 0.8) ? 'PRIME_PARTNER' as const : 'GROWING_CLIENT' as const
    };
  });

  const columns: TableColumn<typeof opportunitiesList[0]>[] = [
    {
      key: 'customer_name',
      header: 'Customer Partner',
      sortable: true,
      pinned: true,
      width: 250,
      render: (row) => (
        <div>
          <Link href={`/customer/${row.customer_id}`} className="font-semibold text-brand-accent hover:underline text-sm block">
            {row.customer_name}
          </Link>
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
      key: 'health_score',
      header: 'Health Score',
      sortable: true,
      width: 120,
      render: (row) => (
        <span className="font-mono font-bold text-brand-accent text-sm">
          {(row.health_score * 100).toFixed(0)}%
        </span>
      )
    },
    {
      key: 'trust_delta',
      header: 'Trust Growth',
      sortable: true,
      width: 120,
      render: (row) => (
        <span className="font-mono font-bold text-brand-accent text-xs">
          +{Math.abs(row.trust_delta * 100).toFixed(0)}%
        </span>
      )
    },
    {
      key: 'contribution',
      header: 'Total Contribution',
      sortable: true,
      align: 'right',
      width: 150,
      render: (row) => (
        <span className="font-mono font-bold text-primary text-xs">
          {formatPercent(row.contribution)}
        </span>
      )
    },
    {
      key: 'tier',
      header: 'Opportunity Class',
      width: 160,
      render: (row) => {
        const isPrime = row.tier === 'PRIME_PARTNER';
        return (
          <Badge variant={isPrime ? 'accent' : 'warning'} size="sm">
            {row.tier.replace('_', ' ')}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      width: 140,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}?tab=growth`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent uppercase hover:underline"
        >
          Expand Credit <ArrowRight className="w-3 h-3" />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/25 pb-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Growth Opportunities Center</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Targeted credit limit expansions and partnership incentives for low-risk accounts showing stable payment indicators.
          </p>
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Expanding Accounts</span>
            <span className="font-headline text-3xl font-extrabold text-brand-accent">{opportunitiesList.length}</span>
          </div>
          <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-lg border border-brand-accent/20">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Upsell Pool Capacity</span>
            <span className="font-headline text-3xl font-extrabold text-primary">{formatCurrency(opportunitiesList.length * 48000)}</span>
          </div>
          <div className="p-3 bg-surface-container-high text-primary rounded-lg border border-outline-variant/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Target Conversion Index</span>
            <span className="font-headline text-2xl font-extrabold text-brand-gold">ACCELERATING</span>
          </div>
          <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg border border-brand-gold/25">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Expandable Credit Limits Queue</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={opportunitiesList}
            isLoading={false}
            sortBy="health_score"
            sortOrder="desc"
            density="standard"
          />
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <RouteErrorBoundary routeName="Growth Opportunities telemetry">
      <OpportunitiesPageContent />
    </RouteErrorBoundary>
  );
}

