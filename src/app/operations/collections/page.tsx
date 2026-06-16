'use client';

import React, { useState, useMemo } from 'react';
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
  ArrowRight 
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

  // Queries
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    current_state: 'liquidity_stress,monitor',
    limit: 100,
  });

  const { data: commitmentsData, isLoading: isCommitmentsLoading } = usePaymentCommitments({
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
      aging_bucket: c.outstanding_current > 100000 ? '90+ Days' : '30-60 Days',
      state: c.state,
    }));
  }, [customersData]);

  const totalOverdueVal = useMemo(() => {
    return overdueQueueList.reduce((acc, curr) => acc + curr.outstanding, 0);
  }, [overdueQueueList]);

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
          <span className="text-[10px] text-slate-400 font-mono block">ID: {row.customer_id}</span>
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
      key: 'customer_id',
      header: 'Customer ID',
      sortable: true,
      width: 150,
      render: (row) => (
        <Link href={`/customer/${row.customer_id}`} className="font-bold text-brand-accent hover:underline text-xs block">
          {row.customer_id}
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
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overdue Accounts</span>
            <span className="font-headline text-3xl font-extrabold text-red-600">{overdueQueueList.length}</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Overdue Receivables</span>
            <span className="font-headline text-3xl font-extrabold text-slate-900">{formatCurrency(totalOverdueVal)}</span>
          </div>
          <div className="p-3 bg-slate-50 text-slate-700 rounded-lg border border-slate-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commitment Rate (SLA)</span>
            <span className="font-headline text-2xl font-extrabold text-teal-600">96.8% Clear</span>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-lg border border-teal-100">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Overdue Queue */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-500" /> Overdue Outreach Queue
        </h3>
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <Table
            columns={overdueColumns}
            data={overdueQueueList}
            isLoading={isCustomersLoading}
            sortBy="collection_score"
            sortOrder="desc"
            density="compact"
          />
        </div>
      </div>

      {/* Payment Commitments */}
      <div className="space-y-3 pt-4">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" /> Payment Commitments Monitoring
        </h3>
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <Table
            columns={commitmentColumns}
            data={commitmentsList}
            isLoading={isCommitmentsLoading}
            sortBy="promised_date"
            sortOrder="asc"
            density="compact"
          />
        </div>
      </div>

      {/* --- LOG OUTREACH ACTIVITY MODAL --- */}
      {showLogModal && selectedCustomerId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2">
              <h3 className="font-headline text-lg font-bold text-slate-800">Log Outreach Activity</h3>
              <button onClick={() => { setShowLogModal(false); setSelectedCustomerId(null); }} className="text-slate-400 hover:text-slate-600 text-lg font-bold border-0 bg-transparent cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Activity Type</label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:border-brand-accent text-slate-800"
                >
                  <option value="CALL">Phone Call</option>
                  <option value="EMAIL">Email Note</option>
                  <option value="LETTER">Formal demand letter</option>
                  <option value="OTHER">Other action</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Outreach Outcome</label>
                <select
                  value={actOutcome}
                  onChange={(e) => setActOutcome(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:border-brand-accent text-slate-800"
                >
                  <option value="CONTACTED">Client Contacted</option>
                  <option value="LEFT_VM">Voice Mail Left</option>
                  <option value="NO_ANSWER">No Answer</option>
                  <option value="EMAIL_SENT">Billing Email Dispatched</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Notes</label>
                <textarea
                  required
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  placeholder="Provide communication summary..."
                  className="w-full p-3 h-24 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800 font-semibold resize-none"
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

      {/* --- REGISTER PAYMENT PROMISE MODAL --- */}
      {showPromiseModal && selectedCustomerId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2">
              <h3 className="font-headline text-lg font-bold text-slate-800">Log Payment Commitment</h3>
              <button onClick={() => { setShowPromiseModal(false); setSelectedCustomerId(null); }} className="text-slate-400 hover:text-slate-600 text-lg font-bold border-0 bg-transparent cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handlePromiseSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Promised Amount ($)</label>
                <input
                  type="number"
                  required
                  placeholder="Amount to settle"
                  value={commitAmount}
                  onChange={(e) => setCommitAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:border-brand-accent text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Expected Date</label>
                <input
                  type="date"
                  required
                  value={commitDate}
                  onChange={(e) => setCommitDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:border-brand-accent text-slate-800"
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
