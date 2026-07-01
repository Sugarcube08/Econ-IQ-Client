'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboardOverview, useDashboardQueues, useDashboardGraphs } from '@/hooks/useDashboard';
import { useAlerts } from '@/hooks/queries/useAlerts';
import { useAcknowledgeAlert } from '@/hooks/mutations/useAcknowledgeAlert';
import { useAlertsCount } from '@/hooks/queries/useAlertsCount';
import { useDecisionHistory } from '@/hooks/queries/useDecisionHistory';
import { useCollectionsActivities } from '@/hooks/queries/useCollectionsActivities';
import { usePaymentCommitments } from '@/hooks/queries/usePaymentCommitments';
import { useCustomers } from '@/hooks/queries/useCustomers';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageContent from '@/components/ui/PageContent';
import MetricCard from '@/components/ui/MetricCard';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import UnifiedBehaviorGraph from '@/components/ui/UnifiedBehaviorGraph';

import {
  ShieldAlert,
  AlertTriangle,
  Briefcase,
  Layers,
  Zap,
  RefreshCw,
  Sliders,
  History,
  Phone,
  Activity
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

  // Queries
  const { data: overview, isLoading: isOverviewLoading, isError: isOverviewError } = useDashboardOverview();
  const { data: alertsCount, isLoading: isAlertsCountLoading, isError: isAlertsCountError } = useAlertsCount();
  const { improving, isLoading: isQueuesLoading, isError: isQueuesError } = useDashboardQueues();
  const { data: alertsData, isLoading: isAlertsLoading, isError: isAlertsError } = useAlerts({ status: 'ACTIVE', limit: 5 });
  const alertsList = alertsData ? (Array.isArray(alertsData) ? alertsData : alertsData.items) : [];
  const { data: customersData, isLoading: isCustomersLoading, isError: isCustomersError } = useCustomers({ sort_by: 'collection_score', sort_order: 'desc', limit: 10 });
  const { data: decisionsData, isLoading: isDecisionsLoading, isError: isDecisionsError } = useDecisionHistory();
  const { data: outreachData, isLoading: isOutreachLoading, isError: isOutreachError } = useCollectionsActivities({ limit: 10 });
  const { data: commitmentsData, isLoading: isCommitmentsLoading } = usePaymentCommitments({ status: 'PENDING' });
  const { data: graphsTimeline, isLoading: isChartsLoading, isError: isChartsError } = useDashboardGraphs(365, 'monthly');

  const acknowledgeMutation = useAcknowledgeAlert();

  // 1. Outstanding Exposure
  const outstandingExposureValue = isOverviewError
    ? 'Capability unavailable in frozen backend'
    : isOverviewLoading
      ? 'Loading...'
      : overview?.outstanding_total !== undefined
        ? formatCurrency(overview.outstanding_total)
        : 'Capability unavailable in frozen backend';

  const outstandingExposureDelta = (overview?.outstanding_total && overview?.outstanding_previous)
    ? ((overview.outstanding_total - overview.outstanding_previous) / overview.outstanding_previous)
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
      : overview?.overdue_total !== undefined
        ? formatCurrency(overview.overdue_total)
        : 'Capability unavailable in frozen backend';

  const collectionBacklogDelta = (overview?.overdue_total && overview?.overdue_previous)
    ? ((overview.overdue_total - overview.overdue_previous) / overview.overdue_previous)
    : undefined;

  // 4. Recovery Candidates
  const recoveryCandidatesValue = isQueuesError
    ? 'Capability unavailable in frozen backend'
    : isQueuesLoading
      ? 'Loading...'
      : improving?.data?.length !== undefined
        ? `${improving.data.length} Accounts`
        : 'Capability unavailable in frozen backend';

  // 5. Commercial Performance Metrics
  const salesValue = isOverviewError
    ? 'Capability unavailable in frozen backend'
    : isOverviewLoading
      ? 'Loading...'
      : overview?.sales_total !== undefined
        ? formatCurrency(overview.sales_total)
        : 'Capability unavailable in frozen backend';

  const salesDelta = (overview?.sales_total && overview?.sales_previous)
    ? ((overview.sales_total - overview.sales_previous) / overview.sales_previous)
    : undefined;

  const collectionsValue = isOverviewError
    ? 'Capability unavailable in frozen backend'
    : isOverviewLoading
      ? 'Loading...'
      : overview?.collections_total !== undefined
        ? formatCurrency(overview.collections_total)
        : 'Capability unavailable in frozen backend';

  const collectionsDelta = (overview?.collections_total && overview?.collections_previous)
    ? ((overview.collections_total - overview.collections_previous) / overview.collections_previous)
    : undefined;

  const healthValue = isOverviewError
    ? 'Capability unavailable in frozen backend'
    : isOverviewLoading
      ? 'Loading...'
      : overview?.commercial_health_index !== undefined
        ? `${overview.commercial_health_index.toFixed(2)}%`
        : 'Capability unavailable in frozen backend';

  const healthDelta = (overview?.commercial_health_index && overview?.commercial_health_previous)
    ? ((overview.commercial_health_index - overview.commercial_health_previous) / overview.commercial_health_previous)
    : undefined;

  const activeCustomersValue = isOverviewError
    ? 'Capability unavailable in frozen backend'
    : isOverviewLoading
      ? 'Loading...'
      : overview?.active_customers !== undefined
        ? `${overview.active_customers} Accounts`
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
          icon={ShieldAlert}
        />
        <MetricCard
          label="Total Sales Volume"
          value={salesValue}
          delta={salesDelta}
          icon={Activity}
        />
        <MetricCard
          label="Total Collections Volume"
          value={collectionsValue}
          delta={collectionsDelta}
          icon={Briefcase}
          variant="success"
        />
        <MetricCard
          label="Commercial Health Index"
          value={healthValue}
          delta={healthDelta}
          icon={Layers}
        />
        <MetricCard
          label="Active Accounts"
          value={activeCustomersValue}
          icon={Zap}
        />
      </div>

      {/* Portfolio Behavior Timeline Graph */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" /> Portfolio Behavior Timeline
        </h3>
        <UnifiedBehaviorGraph
          timeline={graphsTimeline || []}
          isPortfolio={true}
          isLoading={isChartsLoading}
          isError={isChartsError}
          height={320}
        />
      </div>

      {/* Priority Alerts Table */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Priority Alerts</h3>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <Table
            columns={alertColumns}
            data={alertsList}
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
