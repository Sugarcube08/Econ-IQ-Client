'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboardOverview, useDashboardQueues } from '@/hooks/useDashboard';
import { useAlerts } from '@/hooks/queries/useAlerts';
import { useAcknowledgeAlert } from '@/hooks/mutations/useAcknowledgeAlert';
import { useAlertsCount } from '@/hooks/queries/useAlertsCount';
import { useDecisionHistory } from '@/hooks/queries/useDecisionHistory';
import { useCollectionsActivities } from '@/hooks/queries/useCollectionsActivities';
import { usePaymentCommitments } from '@/hooks/queries/usePaymentCommitments';
import { useCustomers } from '@/hooks/queries/useCustomers';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageContent from '@/components/ui/PageContent';
import MetricCard from '@/components/ui/MetricCard';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

import {
  ShieldAlert,
  AlertTriangle,
  Briefcase,
  Layers,
  Zap,
  RefreshCw,
  Sliders,
  History,
  Phone
} from 'lucide-react';
import { AlertData } from '@/services/alerts.service';
import { Customer } from '@/types/customer';
import { DecisionAuditData } from '@/services/decisions.service';
import { CollectionActivityData } from '@/services/collections.service';

function DashboardSkeleton() {
  return (
    <PageContent className="space-y-8 animate-pulse font-sans">
      <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 border border-slate-200/40 rounded-2xl"></div>
        ))}
      </div>
      <div className="space-y-6">
        <div className="h-64 bg-slate-100 border border-slate-200/40 rounded-2xl"></div>
        <div className="h-64 bg-slate-100 border border-slate-200/40 rounded-2xl"></div>
      </div>
    </PageContent>
  );
}

function DashboardPageContent() {
  const router = useRouter();

  // Onboarding store states
  const {
    checklist,
    orgProfile,
    updateChecklistItem,
  } = useOnboardingStore();

  // Queries
  const { data: overview, isLoading: isOverviewLoading, isError: isOverviewError } = useDashboardOverview();
  const { data: alertsCount, isLoading: isAlertsCountLoading, isError: isAlertsCountError } = useAlertsCount();
  const { improving, isLoading: isQueuesLoading, isError: isQueuesError } = useDashboardQueues();
  const { data: alertsData, isLoading: isAlertsLoading, isError: isAlertsError } = useAlerts({ status: 'ACTIVE', limit: 5 });
  const { data: customersData, isLoading: isCustomersLoading, isError: isCustomersError } = useCustomers({ sort_by: 'collection_score', sort_order: 'desc', limit: 10 });
  const { data: decisionsData, isLoading: isDecisionsLoading, isError: isDecisionsError } = useDecisionHistory();
  const { data: outreachData, isLoading: isOutreachLoading, isError: isOutreachError } = useCollectionsActivities({ limit: 10 });
  const { data: commitmentsData, isLoading: isCommitmentsLoading } = usePaymentCommitments({ status: 'PENDING' });

  const acknowledgeMutation = useAcknowledgeAlert();

  const handleSyncDataSimulated = async () => {
    updateChecklistItem('firstSync', true);
    updateChecklistItem('firstRun', true);
  };

  // Setup Activation Checklist (Empty State representation)
  if (!checklist.firstSync) {
    const checklistItems = [
      { key: 'orgSetup' as const, label: 'Complete Organization Profile' },
      { key: 'firstUser' as const, label: 'Provision Team Access' },
      { key: 'firstSync' as const, label: 'Synchronize ERP Ledger' },
      { key: 'firstRun' as const, label: 'Compute Credit Behavior Scores' },
      { key: 'firstReport' as const, label: 'Generate Compliance Audit List' }
    ];
    const completedCount = checklistItems.filter(item => checklist[item.key]).length;
    const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

    return (
      <PageContent>
        {/* Welcome Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 font-sans">
          <Badge variant="accent" size="sm">
            Setup Wizard Completed
          </Badge>
          <h2 className="font-headline text-3xl font-extrabold text-teal-800">
            Welcome to {orgProfile.name || 'Econ-IQ'}
          </h2>
          <p className="text-slate-500 leading-relaxed max-w-2xl text-sm md:text-base">
            Your secure analytical database tenant has been provisioned. To unlock the executive dashboard, credit telemetry scores, and deteriorating warning queues, synchronize your ERP invoice ledgers.
          </p>
          <div className="pt-2">
            <Button
              onClick={handleSyncDataSimulated}
              variant="accent"
              icon={RefreshCw}
            >
              Sync Demo Ledger Data
            </Button>
          </div>
        </div>

        {/* Getting Started Activation Checklist Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-lg font-bold text-teal-800">Econ-IQ Activation Checklist</h3>
            <span className="text-xs font-mono font-bold text-teal-600">{progressPercent}% Completed</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full border border-slate-200/50 overflow-hidden">
            <div className="bg-teal-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {checklistItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${
                    checklist[item.key] ? 'text-teal-600' : 'text-slate-300'
                  }`}>
                    {checklist[item.key] ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className={`font-semibold text-sm ${checklist[item.key] ? 'text-slate-800' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
                
                {!checklist[item.key] && (
                  <div>
                    {item.key === 'firstUser' && (
                      <Link
                        href="/organization/users/invite"
                        className="text-[10px] font-bold text-teal-600 uppercase hover:underline"
                      >
                        Invite Team
                      </Link>
                    )}
                    {item.key === 'firstSync' && (
                      <button
                        onClick={handleSyncDataSimulated}
                        className="text-[10px] font-bold text-teal-600 bg-transparent border-0 hover:underline cursor-pointer uppercase"
                      >
                        Trigger Ingestion
                      </button>
                    )}
                    {item.key === 'firstReport' && (
                      <Link
                        href="/reports"
                        className="text-[10px] font-bold text-teal-600 uppercase hover:underline"
                      >
                        Go to Exporter
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    );
  }

  // 1. Outstanding Exposure
  const outstandingExposureValue = isOverviewError
    ? 'Capability unavailable in frozen backend'
    : isOverviewLoading
    ? 'Loading...'
    : overview?.outstanding_exposure !== undefined
    ? formatCurrency(overview.outstanding_exposure)
    : 'Capability unavailable in frozen backend';

  const outstandingExposureDelta = overview?.comparison_deltas?.outstanding_exposure
    ? overview.comparison_deltas.outstanding_exposure / 100
    : undefined;

  // 2. Critical Alerts
  const criticalAlertsValue = isAlertsCountError
    ? 'Capability unavailable in frozen backend'
    : isAlertsCountLoading
    ? 'Loading...'
    : alertsCount?.critical !== undefined
    ? `${alertsCount.critical} Critical`
    : 'Capability unavailable in frozen backend';

  // 3. Collection Backlog
  const collectionBacklogValue = isOverviewError
    ? 'Capability unavailable in frozen backend'
    : isOverviewLoading
    ? 'Loading...'
    : overview?.overdue_exposure !== undefined
    ? formatCurrency(overview.overdue_exposure)
    : 'Capability unavailable in frozen backend';

  const collectionBacklogDelta = overview?.comparison_deltas?.collections_total
    ? overview.comparison_deltas.collections_total / -100
    : undefined;

  // 4. Recovery Candidates
  const recoveryCandidatesValue = isQueuesError
    ? 'Capability unavailable in frozen backend'
    : isQueuesLoading
    ? 'Loading...'
    : improving?.data?.length !== undefined
    ? `${improving.data.length} Accounts`
    : 'Capability unavailable in frozen backend';

  // Columns for tables
  const alertColumns: TableColumn<AlertData>[] = [
    {
      key: 'customer_name',
      header: 'Customer Name',
      sortable: true,
      render: (row) => (
        <Link href={`/customer/${row.customer_id}`} className="font-semibold text-teal-700 hover:underline">
          {row.customer_name || 'Unnamed Account'}
        </Link>
      )
    },
    {
      key: 'description',
      header: 'Reason',
      render: (row) => <span>{row.title}: {row.description}</span>
    },
    {
      key: 'alert_severity',
      header: 'Severity',
      sortable: true,
      render: (row) => (
        <Badge variant={row.alert_severity === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
          {row.alert_severity}
        </Badge>
      )
    },
    {
      key: 'created_at',
      header: 'Age',
      sortable: true,
      render: (row) => <span>{formatDate(row.created_at)}</span>
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (row) => (
        <Button
          onClick={() => acknowledgeMutation.mutate(row.id)}
          variant="secondary"
          size="sm"
          isLoading={acknowledgeMutation.isPending && acknowledgeMutation.variables === row.id}
        >
          Acknowledge
        </Button>
      )
    }
  ];

  const collectionCustomers = Array.isArray(customersData?.data?.customers) ? customersData.data.customers : [];

  const collectionsColumns: TableColumn<Customer>[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      render: (row) => (
        <div>
          <Link href={`/customer/${row.customer_id}`} className="font-semibold text-teal-700 hover:underline block text-sm">
            {row.customer_name || 'Unnamed Account'}
          </Link>
        </div>
      )
    },
    {
      key: 'outstanding_current',
      header: 'Outstanding',
      align: 'right',
      render: (row) => <span>{formatCurrency(row.outstanding_current)}</span>
    },
    {
      key: 'delay',
      header: 'Delay',
      render: () => (
        <span className="text-slate-400 italic text-[11px]">
          Capability unavailable in frozen backend
        </span>
      )
    },
    {
      key: 'commitment',
      header: 'Commitment',
      render: (row) => {
        const comm = commitmentsData?.find(c => c.customer_id === row.customer_id);
        if (isCommitmentsLoading) return <span className="text-slate-400">Loading...</span>;
        if (comm) {
          return (
            <span className="text-teal-600 font-semibold font-mono text-[11px]">
              {formatCurrency(comm.amount)} ({formatDate(comm.promised_date)})
            </span>
          );
        }
        return <span className="text-slate-400">None</span>;
      }
    },
    {
      key: 'collection_score',
      header: 'Collection Score',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-slate-800">
          {(row.collection_score * 100).toFixed(0)}%
        </span>
      )
    }
  ];

  const decisionsColumns: TableColumn<DecisionAuditData>[] = [
    {
      key: 'customer_name',
      header: 'Customer Name',
      render: (row) => (
        <Link href={`/customer/${row.customer_id}`} className="font-semibold text-teal-700 hover:underline">
          {row.customer_name || 'Unnamed Account'}
        </Link>
      )
    },
    {
      key: 'action_taken',
      header: 'Action Taken',
      render: (row) => (
        <Badge variant={row.action_taken === 'APPROVED' ? 'success' : row.action_taken === 'REJECTED' ? 'danger' : 'warning'} size="sm">
          {row.action_taken}
        </Badge>
      )
    },
    {
      key: 'performed_by',
      header: 'Performed By',
      render: (row) => <span className="font-mono text-slate-700">{row.performed_by || 'System'}</span>
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span className="text-slate-600 truncate max-w-xs block">{row.reason}</span>
    },
    {
      key: 'timestamp',
      header: 'Date',
      render: (row) => <span>{formatDate(row.timestamp)}</span>
    }
  ];

  const outreachColumns: TableColumn<CollectionActivityData>[] = [
    {
      key: 'customer_name',
      header: 'Customer Name',
      render: (row) => (
        <Link href={`/customer/${row.customer_id}`} className="font-semibold text-teal-700 hover:underline">
          {row.customer_name || 'Unnamed Account'}
        </Link>
      )
    },
    {
      key: 'activity_type',
      header: 'Activity Type',
      render: (row) => (
        <Badge variant="secondary" size="sm">
          {row.activity_type}
        </Badge>
      )
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (row) => <span className="text-slate-600 truncate max-w-xs block">{row.notes}</span>
    },
    {
      key: 'outcome',
      header: 'Outcome',
      render: (row) => (
        <Badge variant={row.outcome === 'CONTACTED' || row.outcome === 'EMAIL_SENT' ? 'success' : 'warning'} size="sm">
          {row.outcome.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      key: 'created_at',
      header: 'Time',
      render: (row) => <span>{formatDate(row.created_at)}</span>
    }
  ];

  const dashboardActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => router.push('/customers')}
        variant="accent"
        icon={Layers}
      >
        Customer Matrix
      </Button>
    </div>
  );

  return (
    <PageContent className="space-y-8 font-sans">
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1.5 bg-teal-900 rounded-lg text-teal-300 font-extrabold text-xs uppercase tracking-wider font-headline leading-none shadow-md">
            EconIQ
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Portfolio Inbox & Operational Surface
          </span>
        </div>
      </div>

      {/* Header */}
      <PageHeader
        title="Commercial Command Center"
        subtitle="Operational inbox mapping risk prioritization feed and active receivables monitoring queues."
        actions={dashboardActions}
      />

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Outstanding Exposure"
          value={outstandingExposureValue}
          delta={outstandingExposureDelta}
          deltaLabel={outstandingExposureDelta !== undefined ? "Active Exposure delta" : undefined}
          icon={ShieldAlert}
        />
        <MetricCard
          label="Critical Alerts"
          value={criticalAlertsValue}
          icon={AlertTriangle}
          variant={alertsCount?.critical ? 'error' : 'default'}
        />
        <MetricCard
          label="Collection Backlog"
          value={collectionBacklogValue}
          delta={collectionBacklogDelta}
          deltaLabel={collectionBacklogDelta !== undefined ? "Backlog delta" : undefined}
          icon={Briefcase}
          variant="warning"
        />
        <MetricCard
          label="Recovery Candidates"
          value={recoveryCandidatesValue}
          icon={Zap}
          variant="success"
        />
      </div>

      {/* Priority Alerts Table */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Priority Alerts</h3>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <Table
            columns={alertColumns}
            data={alertsData || []}
            isLoading={isAlertsLoading}
            isError={isAlertsError}
            errorMessage={isAlertsError ? "Priority alerts feed is unavailable in frozen backend" : undefined}
            emptyState={<span>No active alerts.</span>}
            density="compact"
          />
        </div>
      </div>

      {/* Collection Queue Table */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Collection Queue</h3>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <Table
            columns={collectionsColumns}
            data={collectionCustomers}
            isLoading={isCustomersLoading}
            isError={isCustomersError}
            errorMessage={isCustomersError ? "Collection queue data is unavailable in frozen backend" : undefined}
            emptyState={<span>No collection records.</span>}
            density="compact"
          />
        </div>
      </div>

      {/* Recent Decisions Table */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-600" /> Recent Decisions
        </h3>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <Table
            columns={decisionsColumns}
            data={decisionsData || []}
            isLoading={isDecisionsLoading}
            isError={isDecisionsError}
            errorMessage={isDecisionsError ? "Decision history is unavailable in frozen backend" : undefined}
            emptyState={<span>No decision records recorded.</span>}
            density="compact"
          />
        </div>
      </div>

      {/* Recent Outreach Table */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <History className="w-4 h-4 text-teal-600" /> Recent Outreach
        </h3>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <Table
            columns={outreachColumns}
            data={outreachData || []}
            isLoading={isOutreachLoading}
            isError={isOutreachError}
            errorMessage={isOutreachError ? "Outreach history is unavailable in frozen backend" : undefined}
            emptyState={<span>No outreach records recorded.</span>}
            density="compact"
          />
        </div>
      </div>

    </PageContent>
  );
}

export default function DashboardPage() {
  return (
    <RouteErrorBoundary routeName="Commercial Command Center">
      <DashboardPageContent />
    </RouteErrorBoundary>
  );
}
