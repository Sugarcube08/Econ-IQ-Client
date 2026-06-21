'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useCustomers } from '@/hooks/queries/useCustomers';
import { usePaymentCommitments } from '@/hooks/queries/usePaymentCommitments';
import { useLogCollectionActivity } from '@/hooks/mutations/useLogCollectionActivity';
import { useCreateCommitment } from '@/hooks/mutations/useCreateCommitment';
import { formatCurrency, formatDate } from '@/lib/utils';
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
  const [sortBy, setSortBy] = useState('collection_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, [search]);

  // Queries
  const { data: customersData, isLoading: isCustomersLoading, refetch: refetchCustomers } = useCustomers({
    current_state: 'liquidity_stress,monitor',
    page,
    limit,
    sort_by: sortBy,
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
      refetchCustomers();
    } catch (err) {
      console.error('Failed to log activity:', err);
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
    } catch (err) {
      console.error('Failed to register payment promise:', err);
    }
  };

  // Process customer rows
  const overdueQueueList = useMemo(() => {
    const list = customersData?.data?.customers || [];
    return list.map((c) => ({
      customer_id: c.customer_id,
      customer_name: c.customer_name || 'Wholesale Debtor Account',
      city: c.city || 'Regional Scope',
      collection_score: c.collection_score * 100,
      outstanding: c.outstanding_current,
      state: c.state,
    }));
  }, [customersData]);

  const pagination = customersData?.metadata?.pagination || {
    page: 1,
    limit: 10,
    total_records: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  };

  const totalOverdueVal = useMemo(() => {
    return overdueQueueList.reduce((acc, curr) => acc + curr.outstanding, 0);
  }, [overdueQueueList]);

  const handleSort = (field: string) => {
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
      key: 'collection_score',
      header: 'Urgency Index',
      sortable: true,
      width: 130,
      render: (row) => (
        <span className="font-mono font-bold text-red-600 text-sm">
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
        <span className="font-mono font-bold text-slate-900 text-sm">
          {formatCurrency(row.outstanding)}
        </span>
      )
    },
    {
      key: 'workflow_actions',
      header: 'Outreach Outreach Logger',
      width: 200,
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
      width: 130,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Stressed Accounts</span>
            <span className="font-headline text-3xl font-extrabold text-slate-900">{pagination.total_records}</span>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-lg border border-red-200">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Total Stressed Receivables</span>
            <span className="font-headline text-3xl font-extrabold text-slate-900">{formatCurrency(totalOverdueVal)}</span>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg border border-amber-200">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Active Promises Kept Rate</span>
            <span className="font-headline text-3xl font-extrabold text-[#c8a96b]">88%</span>
          </div>
          <div className="p-3 bg-teal-100 text-teal-600 rounded-lg border border-teal-200">
            <TrendingDown className="w-6 h-6" />
          </div>
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
            isLoading={isCustomersLoading}
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
