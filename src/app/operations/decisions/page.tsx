'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRecommendations } from '@/hooks/queries/useRecommendations';
import { useDecisionHistory } from '@/hooks/queries/useDecisionHistory';
import { useRecordDecision } from '@/hooks/mutations/useRecordDecision';
import { formatPercent } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import {
  Sparkles,
  Clock,
  Check,
  X,
  Sliders,
  ShieldAlert,
  Activity,
  AlertCircle
} from 'lucide-react';

function OperationsDecisionsPageContent() {
  const [selectedRec, setSelectedRec] = useState<{ id: string; customerId: string; type: string } | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [decisionAction, setDecisionAction] = useState<'APPROVED' | 'REJECTED' | 'OVERRIDDEN'>('APPROVED');
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  // Queries
  const { data: recommendationsData, isLoading: isRecsLoading } = useRecommendations({
    status: 'ACTIVE',
  });

  const { data: historyData, isLoading: isHistoryLoading } = useDecisionHistory();

  // Mutations
  const recordDecisionMutation = useRecordDecision();

  const handleApprove = async (id: string, customerId: string) => {
    try {
      await recordDecisionMutation.mutateAsync({
        customer_id: customerId,
        recommendation_id: id,
        action_taken: 'APPROVED',
        reason: 'Approved via global decisions manager',
      });
    } catch (err) {
      console.error('Failed to approve recommendation:', err);
    }
  };

  const handleReject = async (id: string, customerId: string) => {
    try {
      await recordDecisionMutation.mutateAsync({
        customer_id: customerId,
        recommendation_id: id,
        action_taken: 'REJECTED',
        reason: 'Rejected via global decisions manager',
      });
    } catch (err) {
      console.error('Failed to reject recommendation:', err);
    }
  };

  const handleOverrideClick = (id: string, customerId: string, type: string) => {
    setSelectedRec({ id, customerId, type });
    setDecisionAction('OVERRIDDEN');
    setOverrideReason('');
    setShowOverrideModal(true);
  };

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRec || !overrideReason.trim()) return;
    try {
      await recordDecisionMutation.mutateAsync({
        customer_id: selectedRec.customerId,
        recommendation_id: selectedRec.id,
        action_taken: decisionAction,
        reason: overrideReason,
      });
      setShowOverrideModal(false);
      setSelectedRec(null);
    } catch (err) {
      console.error('Failed to submit decision override:', err);
    }
  };

  // Recommendations mapping
  const recommendationsList = useMemo(() => {
    return Array.isArray(recommendationsData) ? recommendationsData : [];
  }, [recommendationsData]);

  const recColumns: TableColumn<any>[] = [
    {
      key: 'customer_id',
      header: 'Customer Account',
      sortable: true,
      pinned: true,
      width: 150,
      render: (row) => (
        <div>
          <Link href={`/customer/${row.customer_id}`} className="font-bold text-brand-accent hover:underline text-xs block">
            {row.customer_id}
          </Link>
        </div>
      )
    },
    {
      key: 'recommendation_type',
      header: 'Recommendation Type',
      sortable: true,
      width: 160,
      render: (row) => (
        <span className="font-semibold text-xs text-slate-700">
          {row.recommendation_type.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      key: 'severity',
      header: 'Priority',
      sortable: true,
      width: 120,
      render: (row) => {
        let variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'info';
        if (row.severity === 'CRITICAL' || row.severity === 'HIGH') variant = 'danger';
        else if (row.severity === 'MEDIUM') variant = 'warning';
        return (
          <Badge variant={variant} size="sm">
            {row.severity}
          </Badge>
        );
      }
    },
    {
      key: 'reason',
      header: 'Policy Trigger Rationale',
      width: 320,
      render: (row) => (
        <p className="text-xs text-slate-500 leading-normal max-w-sm">
          {row.reason}
        </p>
      )
    },
    {
      key: 'confidence',
      header: 'Confidence',
      sortable: true,
      align: 'right',
      width: 120,
      render: (row) => (
        <span className="font-mono text-xs text-slate-600">
          {formatPercent(row.confidence * 100)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Decision Actions',
      width: 250,
      align: 'center',
      render: (row) => (
        <div className="flex gap-1.5 justify-center">
          <Button
            onClick={() => handleApprove(row.id, row.customer_id)}
            variant="accent"
            size="sm"
            className="flex items-center gap-1"
            isLoading={recordDecisionMutation.isPending && selectedRec?.id === row.id && decisionAction === 'APPROVED'}
          >
            <Check className="w-3 h-3" /> Approve
          </Button>
          <Button
            onClick={() => handleReject(row.id, row.customer_id)}
            variant="danger"
            size="sm"
            className="flex items-center gap-1"
            isLoading={recordDecisionMutation.isPending && selectedRec?.id === row.id && decisionAction === 'REJECTED'}
          >
            <X className="w-3 h-3" /> Reject
          </Button>
          <Button
            onClick={() => handleOverrideClick(row.id, row.customer_id, row.recommendation_type)}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" /> Override
          </Button>
        </div>
      )
    }
  ];

  // History mapping
  const historyList = useMemo(() => {
    return Array.isArray(historyData) ? historyData : [];
  }, [historyData]);

  const historyColumns: TableColumn<any>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      width: 180,
      render: (row) => (
        <span className="font-mono text-slate-500 text-xs">
          {new Date(row.timestamp).toLocaleString()}
        </span>
      )
    },
    {
      key: 'customer_id',
      header: 'Customer',
      sortable: true,
      width: 130,
      render: (row) => (
        <Link href={`/customer/${row.customer_id}`} className="font-bold text-brand-accent hover:underline text-xs">
          {row.customer_id}
        </Link>
      )
    },
    {
      key: 'performed_by',
      header: 'Analyst',
      width: 130,
      render: (row) => (
        <span className="font-semibold text-xs text-slate-700">
          {row.performed_by}
        </span>
      )
    },
    {
      key: 'action_taken',
      header: 'Action Taken',
      width: 120,
      render: (row) => (
        <Badge variant={row.action_taken === 'OVERRIDDEN' ? 'warning' : row.action_taken === 'APPROVED' ? 'accent' : 'danger'} size="sm">
          {row.action_taken}
        </Badge>
      )
    },
    {
      key: 'reason',
      header: 'Override Justification',
      width: 320,
      render: (row) => (
        <p className="text-xs text-slate-600 leading-normal max-w-sm">
          {row.reason}
        </p>
      )
    }
  ];

  return (
    <div className="space-y-8 font-sans">

      {/* Header */}
      <div>
        <h2 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">Decisions Command Center</h2>
        <p className="font-sans text-sm text-slate-500 mt-1 leading-relaxed">
          Credit policy queue manager dashboard. Review system credit recommendations, adjust terms, and execute overrides.
        </p>
      </div>

      {/* Recommendations Queue */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" /> Active Policy Recommendations
        </h3>
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <Table
            columns={recColumns}
            data={recommendationsList}
            isLoading={isRecsLoading}
            sortBy="severity"
            sortOrder="desc"
            density="compact"
          />
        </div>
      </div>

      {/* Audit History */}
      <div className="space-y-3 pt-4">
        <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-500" /> Decision Audit History
        </h3>
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <Table
            columns={historyColumns}
            data={historyList}
            isLoading={isHistoryLoading}
            sortBy="timestamp"
            sortOrder="desc"
            density="compact"
          />
        </div>
      </div>

      {/* --- OVERRIDE JUSTIFICATION DIALOG MODAL --- */}
      {showOverrideModal && selectedRec && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2">
              <h3 className="font-headline text-lg font-bold text-slate-800">Execute Credit Decision</h3>
              <button onClick={() => { setShowOverrideModal(false); setSelectedRec(null); }} className="text-slate-400 hover:text-slate-600 text-lg font-bold border-0 bg-transparent cursor-pointer">×</button>
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Decision Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['APPROVED', 'REJECTED', 'OVERRIDDEN'] as const).map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setDecisionAction(act)}
                      className={`h-10 rounded-lg border font-semibold cursor-pointer uppercase transition-colors ${decisionAction === act
                          ? 'bg-brand-accent border-brand-accent text-white font-extrabold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Override Justification Notes</label>
                <textarea
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Provide detailed analytical reasoning for this decision override..."
                  className="w-full p-3 h-24 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800 font-semibold resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <Button type="button" onClick={() => { setShowOverrideModal(false); setSelectedRec(null); }} variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm" isLoading={recordDecisionMutation.isPending}>
                  Submit Action
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function OperationsDecisionsPage() {
  return (
    <RouteErrorBoundary routeName="Operations Decisions Dashboard">
      <OperationsDecisionsPageContent />
    </RouteErrorBoundary>
  );
}
