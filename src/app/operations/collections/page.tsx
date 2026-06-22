'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePaymentCommitments } from '@/hooks/queries/usePaymentCommitments';
import { useLogCollectionActivity } from '@/hooks/mutations/useLogCollectionActivity';
import { useCreateCommitment } from '@/hooks/mutations/useCreateCommitment';
import { usePortfolioAnalytics } from '@/hooks/queries/usePortfolioAnalytics';
import { useCollectionQueue } from '@/hooks/queries/useCollectionQueue';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import {
  Phone,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  Activity,
  Users,
  TrendingDown,
  PlusCircle,
  Clock,
  ArrowRight,
  Search
} from 'lucide-react';

function OperationsCollectionsPageContent() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPromiseModal, setShowPromiseModal] = useState(false);

  // Form states
  const [actType, setActType] = useState('CALL');
  const [actOutcome, setActOutcome] = useState('CONTACTED');
  const [actNotes, setActNotes] = useState('');
  const [commitAmount, setCommitAmount] = useState('');
  const [commitDate, setCommitDate] = useState('');

  // Pagination, sorting, search states for Customers datatable (Overdue Queue)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('priority_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, [search]);

  // Queries
  const { data: portfolioData, refetch: refetchPortfolio } = usePortfolioAnalytics();

  const { data: queueData, isLoading: isQueueLoading, refetch: refetchQueue } = useCollectionQueue({
    page,
    limit,
    sort_by: sortBy === 'customer_name' ? 'customer_name' : sortBy,
    sort_order: sortOrder,
    search: debouncedSearch || undefined,
  });

  const { data: commitmentsData, isLoading: isCommitmentsLoading, refetch: refetchCommitments } = usePaymentCommitments({
    status: 'PENDING',
  });

  // Mutations
  const logActivityMutation = useLogCollectionActivity();
  const createCommitmentMutation = useCreateCommitment();

  const handleLogActionClick = (customerId: string, type: 'CALL' | 'EMAIL' | 'LETTER') => {
    setSelectedCustomerId(customerId);
    setActType(type);
    setActOutcome(type === 'CALL' ? 'CONTACTED' : type === 'EMAIL' ? 'EMAIL_SENT' : 'CONTACTED');
    setActNotes('');
    setShowLogModal(true);
  };

  const handlePromiseClick = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setCommitAmount('');
    setCommitDate('');
    setShowPromiseModal(true);
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !actNotes.trim()) return;
    try {
      await logActivityMutation.mutateAsync({
        customer_id: selectedCustomerId,
        activity_type: actType,
        notes: actNotes,
        outcome: actOutcome,
      });
      setShowLogModal(false);
      setSelectedCustomerId(null);
      refetchQueue();
      refetchPortfolio();
    } catch (err) {
      console.error('Failed to log dunning action:', err);
    }
  };

  const handlePromiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(commitAmount);
    if (!selectedCustomerId || isNaN(parsedAmount) || !commitDate) return;
    try {
      await createCommitmentMutation.mutateAsync({
        customer_id: selectedCustomerId,
        amount: parsedAmount,
        promised_date: commitDate,
      });
      setShowPromiseModal(false);
      setSelectedCustomerId(null);
      refetchCommitments();
      refetchQueue();
      refetchPortfolio();
    } catch (err) {
      console.error('Failed to register payment promise:', err);
    }
  };

  // Process customer rows from backend collection-queue
  const overdueQueueList = useMemo(() => {
    const list = queueData?.items || [];
    return list.map((c) => ({
      customer_id: c.customer_id,
      customer_name: c.customer_name || 'Wholesale Debtor Account',
      outstanding: c.outstanding ?? 0,
      recovered_ytd: c.recovered_ytd ?? 0,
      priority_score: c.priority_score ?? 0,
      priority_level: c.priority_level || 'LOW',
      primary_dunning_reason: c.primary_dunning_reason || 'DPD Threshold Exceeded',
      last_outreach_date: c.last_outreach_date,
    }));
  }, [queueData]);

  const pagination = useMemo(() => {
    const pageVal = queueData?.pagination?.page || 1;
    const totalPagesVal = queueData?.pagination?.total_pages || 0;
    const totalVal = queueData?.pagination?.total || 0;
    const limitVal = queueData?.pagination?.limit || 10;

    return {
      page: pageVal,
      limit: limitVal,
      total_records: totalVal,
      total_pages: totalPagesVal,
      has_next: pageVal < totalPagesVal,
      has_previous: pageVal > 1,
    };
  }, [queueData]);

  const handleSort = (field: string) => {
    // Only sort by fields supported in /analytics/collection-queue parameter spec
    if (field !== 'customer_name' && field !== 'priority_score' && field !== 'outstanding') return;

    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const overdueColumns: TableColumn<any>[] = [
    {
      key: 'customer_name',
      header: 'Customer Account',
      sortable: true,
      pinned: true,
      width: 200,
      render: (row) => (
        <div>
          <Link href={`/customer/${row.customer_id}`} className="font-semibold text-brand-accent hover:underline text-xs block">
            {row.customer_name}
          </Link>
        </div>
      )
    },
    {
      key: 'priority_score',
      header: 'CPI Score',
      sortable: true,
      width: 90,
      render: (row) => (
        <span className="font-mono font-bold text-red-600 text-sm">
          {row.priority_score.toFixed(1)}
        </span>
      )
    },
    {
      key: 'priority_level',
      header: 'Priority',
      sortable: false,
      width: 110,
      render: (row) => {
        const variants: Record<string, 'danger' | 'warning' | 'info'> = {
          CRITICAL: 'danger',
          HIGH: 'warning',
          MEDIUM: 'warning',
          LOW: 'info',
        };
        const isCritical = row.priority_level === 'CRITICAL';
        const isHigh = row.priority_level === 'HIGH';
        const isMedium = row.priority_level === 'MEDIUM';

        let customClasses = '';
        if (isCritical) {
          customClasses = 'animate-pulse border-red-500/50 text-red-600 bg-red-50 font-extrabold';
        } else if (isHigh) {
          customClasses = 'border-amber-500/55 text-amber-700 bg-amber-50 font-extrabold';
        } else if (isMedium) {
          customClasses = 'border-yellow-400/50 text-yellow-750 bg-yellow-50 font-bold';
        } else {
          customClasses = 'border-slate-200 text-slate-500 bg-slate-50 font-normal normal-case';
        }

        return (
          <Badge variant={variants[row.priority_level] || 'info'} size="sm" className={customClasses}>
            <span className="flex items-center gap-1">
              {isCritical && <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>}
              {row.priority_level}
            </span>
          </Badge>
        );
      }
    },
    {
      key: 'primary_dunning_reason',
      header: 'Primary Reason',
      sortable: false,
      width: 180,
      render: (row) => (
        <span className="font-semibold text-slate-700 text-xs truncate block max-w-[170px]" title={row.primary_dunning_reason}>
          {row.primary_dunning_reason}
        </span>
      )
    },
    {
      key: 'outstanding',
      header: 'Outstanding Exposure',
      sortable: true,
      align: 'right',
      width: 150,
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {formatCurrency(row.outstanding)}
        </span>
      )
    },
    {
      key: 'recovered_ytd',
      header: 'Recovered YTD',
      sortable: false,
      align: 'right',
      width: 130,
      render: (row) => (
        <span className="font-mono text-slate-600 text-xs">
          {formatCurrency(row.recovered_ytd)}
        </span>
      )
    },
    {
      key: 'last_outreach_date',
      header: 'Last Outreach',
      sortable: false,
      width: 140,
      render: (row) => (
        <span className="font-mono text-slate-500 text-[11px]">
          {row.last_outreach_date ? formatDateTime(row.last_outreach_date) : <span className="text-slate-400 italic">No recent outreach</span>}
        </span>
      )
    },
    {
      key: 'workflow_actions',
      header: 'Outreach Outreach Logger',
      width: 160,
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleLogActionClick(row.customer_id, 'CALL')}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Log Phone Call"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleLogActionClick(row.customer_id, 'EMAIL')}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Log Email Note"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleLogActionClick(row.customer_id, 'LETTER')}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Issue Formal demand letter"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handlePromiseClick(row.customer_id)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-accent transition-colors cursor-pointer"
            title="Register Payment Commitment"
          >
            <PlusCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Workspace',
      align: 'center',
      width: 90,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent uppercase hover:underline"
        >
          Dossier <ArrowRight className="w-3 h-3" />
        </Link>
      )
    }
  ];

  const commitmentsList = commitmentsData || [];

  const commitmentColumns: TableColumn<any>[] = [
    {
      key: 'customer_name',
      header: 'Customer Name',
      sortable: true,
      width: 185,
      render: (row) => (
        <Link href={`/customer/${row.customer_id}`} className="font-bold text-brand-accent hover:underline text-xs block">
          {row.customer_name || row.customer_id}
        </Link>
      )
    },
    {
      key: 'amount',
      header: 'Promised Amount',
      sortable: true,
      align: 'right',
      width: 150,
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      key: 'promised_date',
      header: 'Expected Date',
      sortable: true,
      width: 150,
      render: (row) => (
        <span className="font-mono text-slate-600 text-xs">
          {formatDate(row.promised_date)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: 120,
      render: (row) => (
        <Badge variant={row.status === 'PENDING' ? 'warning' : row.status === 'KEPT' ? 'accent' : 'danger'} size="sm">
          {row.status}
        </Badge>
      )
    },
    {
      key: 'days_remaining',
      header: 'Days Remaining',
      width: 150,
      render: (row) => {
        const remaining = Math.ceil((new Date(row.promised_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return (
          <span className={`font-semibold text-xs ${remaining < 0 ? 'text-red-600' : 'text-slate-500'}`}>
            {remaining < 0 ? `${Math.abs(remaining)} days overdue` : `${remaining} days left`}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-8 font-sans">

      {/* Header */}
      <div>
        <h2 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">Collections Command Center</h2>
        <p className="font-sans text-sm text-slate-500 mt-1 leading-relaxed">
          Consolidated portfolio dunning execution panel. Log collector communications and track debtor commitments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Outstanding Receivables */}
        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Outstanding Exposure</span>
            <span className="font-headline text-3xl font-extrabold text-slate-900">
              {formatCurrency(portfolioData?.summary?.total_outstanding ?? 0)}
            </span>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-lg border border-red-200">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Recovered Past 30d */}
        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Recovered (Past 30d)</span>
            <span className="font-headline text-3xl font-extrabold text-slate-900">
              {formatCurrency(portfolioData?.summary?.total_recovered_30d ?? 0)}
            </span>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Active Promises Count */}
        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Active Promises</span>
            <span className="font-headline text-3xl font-extrabold text-slate-900">
              {portfolioData?.summary?.active_commitments_count ?? 0}
            </span>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg border border-amber-200">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* YTD Recovery Rate */}
        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">YTD Recovery Rate</span>
            <span className="font-headline text-3xl font-extrabold text-[#c8a96b]">
              {portfolioData?.summary?.recovery_rate_ytd !== undefined
                ? `${(portfolioData.summary.recovery_rate_ytd * 100).toFixed(0)}%`
                : '—'}
            </span>
          </div>
          <div className="p-3 bg-teal-100 text-teal-600 rounded-lg border border-teal-200">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Priority and Aging Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Inventory Card */}
        <div className="bg-surface border border-outline-variant p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-headline text-xs font-bold text-slate-500 uppercase tracking-wider">
              Queue Priority Inventory
            </h4>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              CPI SCORE DISTRIBUTION
            </span>
          </div>
          {portfolioData?.priority_distribution ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-red-50/50 border border-red-100 p-3 rounded-lg text-center relative overflow-hidden group hover:shadow-md transition-shadow">
                <span className="text-[9px] font-bold text-red-500 block mb-1">CRITICAL</span>
                <span className="font-headline text-2xl font-extrabold text-red-600 block animate-pulse">
                  {portfolioData.priority_distribution.critical_count}
                </span>
                <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg text-center hover:shadow-md transition-shadow">
                <span className="text-[9px] font-bold text-amber-600 block mb-1">HIGH</span>
                <span className="font-headline text-2xl font-extrabold text-amber-700 block">
                  {portfolioData.priority_distribution.high_count}
                </span>
              </div>
              <div className="bg-yellow-50/50 border border-yellow-100 p-3 rounded-lg text-center hover:shadow-md transition-shadow">
                <span className="text-[9px] font-bold text-yellow-600 block mb-1">MEDIUM</span>
                <span className="font-headline text-2xl font-extrabold text-yellow-700 block">
                  {portfolioData.priority_distribution.medium_count}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center hover:shadow-md transition-shadow">
                <span className="text-[9px] font-bold text-slate-500 block mb-1">LOW</span>
                <span className="font-headline text-2xl font-extrabold text-slate-700 block">
                  {portfolioData.priority_distribution.low_count}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 text-xs">No priority telemetry available</div>
          )}
        </div>

        {/* Aging Distribution Card */}
        <div className="bg-surface border border-outline-variant p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-headline text-xs font-bold text-slate-500 uppercase tracking-wider">
              Receivables Aging Distribution
            </h4>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              OUTSTANDING BY DPD
            </span>
          </div>
          {portfolioData?.aging_distribution ? (
            <div className="space-y-4">
              {/* Stacked bar representation */}
              {(() => {
                const agingDist = portfolioData.aging_distribution;
                const totalAging = (
                  (agingDist.current || 0) +
                  (agingDist['1_30_days'] || 0) +
                  (agingDist['31_60_days'] || 0) +
                  (agingDist['61_90_days'] || 0) +
                  (agingDist['90_plus_days'] || 0)
                ) || 1;

                const currentPct = ((agingDist.current || 0) / totalAging) * 100;
                const d1_30Pct = ((agingDist['1_30_days'] || 0) / totalAging) * 100;
                const d31_60Pct = ((agingDist['31_60_days'] || 0) / totalAging) * 100;
                const d61_90Pct = ((agingDist['61_90_days'] || 0) / totalAging) * 100;
                const d90PlusPct = ((agingDist['90_plus_days'] || 0) / totalAging) * 100;

                return (
                  <div className="space-y-3">
                    {/* The Stacked Bar */}
                    <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-inner">
                      {agingDist.current > 0 && (
                        <div
                          style={{ width: `${currentPct}%` }}
                          className="bg-emerald-500 transition-all duration-500 hover:opacity-90"
                          title={`Current: ${formatCurrency(agingDist.current)} (${currentPct.toFixed(1)}%)`}
                        />
                      )}
                      {agingDist['1_30_days'] > 0 && (
                        <div
                          style={{ width: `${d1_30Pct}%` }}
                          className="bg-sky-400 transition-all duration-500 hover:opacity-90"
                          title={`1-30 Days: ${formatCurrency(agingDist['1_30_days'])} (${d1_30Pct.toFixed(1)}%)`}
                        />
                      )}
                      {agingDist['31_60_days'] > 0 && (
                        <div
                          style={{ width: `${d31_60Pct}%` }}
                          className="bg-amber-400 transition-all duration-500 hover:opacity-90"
                          title={`31-60 Days: ${formatCurrency(agingDist['31_60_days'])} (${d31_60Pct.toFixed(1)}%)`}
                        />
                      )}
                      {agingDist['61_90_days'] > 0 && (
                        <div
                          style={{ width: `${d61_90Pct}%` }}
                          className="bg-orange-500 transition-all duration-500 hover:opacity-90"
                          title={`61-90 Days: ${formatCurrency(agingDist['61_90_days'])} (${d61_90Pct.toFixed(1)}%)`}
                        />
                      )}
                      {agingDist['90_plus_days'] > 0 && (
                        <div
                          style={{ width: `${d90PlusPct}%` }}
                          className="bg-rose-650 transition-all duration-500 hover:opacity-90 animate-pulse"
                          title={`90+ Days: ${formatCurrency(agingDist['90_plus_days'])} (${d90PlusPct.toFixed(1)}%)`}
                        />
                      )}
                    </div>

                    {/* Compact Custom Legend Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-semibold">
                      <div className="flex items-center gap-1.5 min-w-[70px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        <div className="leading-tight">
                          <span className="text-slate-400 block font-normal">Current</span>
                          <span className="text-slate-900">{formatCurrency(agingDist.current)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-[70px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 flex-shrink-0" />
                        <div className="leading-tight">
                          <span className="text-slate-400 block font-normal">1-30 Days</span>
                          <span className="text-slate-900">{formatCurrency(agingDist['1_30_days'])}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-[70px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                        <div className="leading-tight">
                          <span className="text-slate-400 block font-normal">31-60 Days</span>
                          <span className="text-slate-900">{formatCurrency(agingDist['31_60_days'])}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-[70px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                        <div className="leading-tight">
                          <span className="text-slate-400 block font-normal">61-90 Days</span>
                          <span className="text-slate-900">{formatCurrency(agingDist['61_90_days'])}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-[70px] col-span-2 sm:col-span-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-650 flex-shrink-0" />
                        <div className="leading-tight">
                          <span className="text-slate-400 block font-normal">90+ Days</span>
                          <span className="text-slate-900 text-red-600 font-extrabold">{formatCurrency(agingDist['90_plus_days'])}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 text-xs">No aging distribution data available</div>
          )}
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex gap-2 max-w-md bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search stressed accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent bg-white text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        {search && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch('');
              setPage(1);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Overdue Queue */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-600" /> Overdue Receivables Queue
        </h3>
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <Table
            columns={overdueColumns}
            data={overdueQueueList}
            isLoading={isQueueLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            page={page}
            totalPages={pagination.total_pages}
            onPageChange={setPage}
            hasPrevious={pagination.has_previous}
            hasNext={pagination.has_next}
            density="standard"
          />
        </div>
      </div>

      {/* Promises List */}
      <div className="space-y-3 pt-4">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-500" /> Active Payment Promises
        </h3>
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <Table
            columns={commitmentColumns}
            data={commitmentsList}
            isLoading={isCommitmentsLoading}
            density="compact"
          />
        </div>
      </div>

      {/* --- OUTREACH LOGGER DIALOG MODAL --- */}
      {showLogModal && selectedCustomerId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2">
              <h3 className="font-headline text-lg font-bold text-slate-800">Log Outreach Communication</h3>
              <button onClick={() => { setShowLogModal(false); setSelectedCustomerId(null); }} className="text-slate-400 hover:text-slate-600 text-lg font-bold border-0 bg-transparent cursor-pointer">×</button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Channel</label>
                  <select
                    value={actType}
                    onChange={(e) => setActType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800"
                  >
                    <option value="CALL">Phone Call</option>
                    <option value="EMAIL">Email Note</option>
                    <option value="LETTER">Demand Letter</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider block">Outcome</label>
                  <select
                    value={actOutcome}
                    onChange={(e) => setActOutcome(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800"
                  >
                    <option value="CONTACTED">Contact Established</option>
                    <option value="LEFT_VM">Left Voicemail</option>
                    <option value="NO_ANSWER">No Answer</option>
                    <option value="EMAIL_SENT">Email Transmitted</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Communication Notes Summary</label>
                <textarea
                  required
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  placeholder="Summarize discussion details, verbal promises, or dunning reasons..."
                  className="w-full p-3 h-24 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <Button type="button" onClick={() => { setShowLogModal(false); setSelectedCustomerId(null); }} variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm" isLoading={logActivityMutation.isPending}>
                  Log Activity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PROMISE REGISTRATION DIALOG MODAL --- */}
      {showPromiseModal && selectedCustomerId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2">
              <h3 className="font-headline text-lg font-bold text-slate-800">Secure Payment Commitment</h3>
              <button onClick={() => { setShowPromiseModal(false); setSelectedCustomerId(null); }} className="text-slate-400 hover:text-slate-600 text-lg font-bold border-0 bg-transparent cursor-pointer">×</button>
            </div>

            <form onSubmit={handlePromiseSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Promised Recovery Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="Expected settlement amount"
                  value={commitAmount}
                  onChange={(e) => setCommitAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Target Settlement Date</label>
                <input
                  type="date"
                  required
                  value={commitDate}
                  onChange={(e) => setCommitDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <Button type="button" onClick={() => { setShowPromiseModal(false); setSelectedCustomerId(null); }} variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm" isLoading={createCommitmentMutation.isPending}>
                  Register Promise
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function OperationsCollectionsPage() {
  return (
    <RouteErrorBoundary routeName="Operations Collections Dashboard">
      <OperationsCollectionsPageContent />
    </RouteErrorBoundary>
  );
}
