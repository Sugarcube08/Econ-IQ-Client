'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDashboardQueues } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { Briefcase, ArrowRight, Phone, Mail, FileText, Check } from 'lucide-react';

export default function CollectionsQueuePage() {
  const { highRisk, isLoading } = useDashboardQueues();
  const [loggedActions, setLoggedActions] = useState<Record<string, 'call' | 'mail' | 'dunning'>>({});

  const handleAction = (id: string, type: 'call' | 'mail' | 'dunning') => {
    setLoggedActions(prev => ({ ...prev, [id]: type }));
    setTimeout(() => {
      // Clear success state after 3 seconds
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Loading collections priority list...</p>
      </div>
    );
  }

  const collectionsList = (highRisk.data || []).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Wholesale Debtor Account',
    city: item.city || 'Regional Scope',
    collection_score: item.trust_score !== undefined ? (1 - item.trust_score) * 100 : 75,
    outstanding: item.outstanding_current || 0,
    aging_bucket: item.outstanding_current && item.outstanding_current > 100000 ? '90+ Days' : '30-60 Days',
    state: item.state || 'LIQUIDITY_STRESS'
  }));

  const columns: TableColumn<typeof collectionsList[0]>[] = [
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
      key: 'collection_score',
      header: 'Urgency Index',
      sortable: true,
      width: 130,
      render: (row) => (
        <span className="font-mono font-bold text-error text-sm">
          {row.collection_score.toFixed(0)}%
        </span>
      )
    },
    {
      key: 'outstanding',
      header: 'Overdue Amount',
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
      key: 'aging_bucket',
      header: 'Aging Category',
      width: 150,
      render: (row) => {
        const is90 = row.aging_bucket.startsWith('90');
        return (
          <Badge variant={is90 ? 'danger' : 'warning'} size="sm">
            {row.aging_bucket}
          </Badge>
        );
      }
    },
    {
      key: 'workflow_actions',
      header: 'Dunning Actions',
      width: 200,
      render: (row) => {
        const action = loggedActions[row.customer_id];
        
        if (action) {
          return (
            <div className="flex items-center gap-1.5 text-brand-accent text-xs font-bold font-sans">
              <Check className="w-4 h-4 shrink-0" />
              {action === 'call' ? 'Call Logged' : action === 'mail' ? 'Warning Sent' : 'Dunning Issued'}
            </div>
          );
        }

        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(row.customer_id, 'call')}
              className="p-1.5 bg-surface border border-outline-variant/60 rounded hover:bg-surface-container text-outline hover:text-primary transition-colors cursor-pointer"
              title="Log collection call"
            >
              <Phone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleAction(row.customer_id, 'mail')}
              className="p-1.5 bg-surface border border-outline-variant/60 rounded hover:bg-surface-container text-outline hover:text-primary transition-colors cursor-pointer"
              title="Send billing reminder"
            >
              <Mail className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleAction(row.customer_id, 'dunning')}
              className="p-1.5 bg-surface border border-outline-variant/60 rounded hover:bg-surface-container text-outline hover:text-primary transition-colors cursor-pointer"
              title="Issue formal demand letter"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: 'Workspace',
      align: 'center',
      width: 130,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}?tab=recommendations`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent uppercase hover:underline"
        >
          View Recommendations <ArrowRight className="w-3 h-3" />
        </Link>
      )
    }
  ];

  const totalOutstandingVal = collectionsList.reduce((acc, curr) => acc + curr.outstanding, 0);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/25 pb-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Collections Priority Queue</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Invoice balances and aging receivables structured for immediate dunning workflow execution.
          </p>
        </div>
      </div>

      {/* Summary Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Accounts in Queue</span>
            <span className="font-headline text-3xl font-extrabold text-error">{collectionsList.length}</span>
          </div>
          <div className="p-3 bg-error/10 text-error rounded-lg border border-error/20">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Total Outstanding Balance</span>
            <span className="font-headline text-3xl font-extrabold text-primary">{formatCurrency(totalOutstandingVal)}</span>
          </div>
          <div className="p-3 bg-surface-container-high text-primary rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-[28px]">payments</span>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Queue Resolution SLA</span>
            <span className="font-headline text-2xl font-extrabold text-brand-accent">96.8% CLEAR</span>
          </div>
          <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-lg border border-brand-accent/20">
            <span className="material-symbols-outlined text-[28px]">speed</span>
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Active Collections Queue</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={collectionsList}
            isLoading={false}
            sortBy="collection_score"
            sortOrder="desc"
            density="standard"
          />
        </div>
      </div>

    </div>
  );
}
