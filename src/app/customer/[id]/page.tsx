'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomerProfile } from '@/hooks/queries/useCustomerProfile';
import { useCustomerPredictions } from '@/hooks/queries/useCustomerPredictions';
import { useCustomerRecommendations } from '@/hooks/queries/useCustomerRecommendations';
import { useCustomerGraphs } from '@/hooks/queries/useCustomerGraphs';
import { useAlerts } from '@/hooks/queries/useAlerts';
import { useCollectionsActivities } from '@/hooks/queries/useCollectionsActivities';
import { usePaymentCommitments } from '@/hooks/queries/usePaymentCommitments';
import { useDecisionHistory } from '@/hooks/queries/useDecisionHistory';

import { useAcknowledgeAlert } from '@/hooks/mutations/useAcknowledgeAlert';
import { useLogCollectionActivity } from '@/hooks/mutations/useLogCollectionActivity';
import { useCreateCommitment } from '@/hooks/mutations/useCreateCommitment';
import { useRecordDecision } from '@/hooks/mutations/useRecordDecision';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';
import { GraphPoint } from '@/types/customer';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageToolbar from '@/components/ui/PageToolbar';
import PageContent from '@/components/ui/PageContent';
import ScoreCard from '@/components/ui/ScoreCard';
import Timeline from '@/components/ui/Timeline';
import HealthIndicator from '@/components/ui/HealthIndicator';
import RiskIndicator from '@/components/ui/RiskIndicator';
import TrendIndicator from '@/components/ui/TrendIndicator';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Chart from '@/components/ui/Chart';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';

import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Activity,
  Zap,
  Clock,
  Sparkles,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Check,
  TrendingUp,
  TrendingDown,
  Layers,
  ShoppingBag,
  Hourglass,
  PhoneCall,
  User,
  PlusCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function CustomerDetailPageContent({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  // Override Decision State
  const [selectedRec, setSelectedRec] = useState<{ id: string; type: string } | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [decisionAction, setDecisionAction] = useState<'APPROVED' | 'REJECTED' | 'OVERRIDDEN'>('APPROVED');

  // Collections Activity Form State
  const [actType, setActType] = useState('CALL');
  const [actOutcome, setActOutcome] = useState('CONTACTED');
  const [actNotes, setActNotes] = useState('');

  // Payment Commitment Form State
  const [commitAmount, setCommitAmount] = useState('');
  const [commitDate, setCommitDate] = useState('');

  // Queries
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useCustomerProfile(id);
  const { data: predictions, isLoading: isPredictionsLoading } = useCustomerPredictions(id);
  const { data: recommendations, isLoading: isRecsLoading } = useCustomerRecommendations(id);
  const graphs = useCustomerGraphs(id);

  // Operations Queries
  const { data: activeAlerts, isLoading: isAlertsLoading } = useAlerts({ customer_id: id, status: 'ACTIVE' });
  const { data: dbActivities, isLoading: isActivitiesLoading } = useCollectionsActivities({ customer_id: id });
  const { data: dbCommitments, isLoading: isCommitmentsLoading } = usePaymentCommitments({ customer_id: id });
  const { data: dbHistory, isLoading: isHistoryLoading } = useDecisionHistory({ customer_id: id });

  // Mutations
  const acknowledgeMutation = useAcknowledgeAlert();
  const logActivityMutation = useLogCollectionActivity();
  const logCommitmentMutation = useCreateCommitment();
  const recordDecisionMutation = useRecordDecision();

  if (
    isProfileLoading ||
    isPredictionsLoading ||
    isRecsLoading ||
    graphs.isLoading ||
    isAlertsLoading ||
    isActivitiesLoading ||
    isCommitmentsLoading ||
    isHistoryLoading
  ) {
    return <LoadingState message="Reconstructing customer account intelligence dossier..." />;
  }

  if (isProfileError || !profile) {
    return (
      <div className="py-12">
        <ErrorState
          title="Analytical Profile Error"
          message="Secure connection to Econiq core analytical engines could not be established. Verify host connection."
          onRetry={refetchProfile}
        />
      </div>
    );
  }

  const scores = profile.scores;
  const deltas = profile.deltas;
  const healthScore = scores.health_score;
  const riskScore = scores.risk_score;
  const totalOutstanding = scores.outstanding_current;
  const creditUtilization = Math.round(scores.credit_score * 100);
  const trendVal = deltas.health_score || 0.05;

  const mapGraphPoints = (points: GraphPoint[] = [], type: 'purchase' | 'payment' | 'rg' | 'outstanding') => {
    return (Array.isArray(points) ? points : []).map((p) => {
      let value = 0;
      if (type === 'purchase') value = p.purchase_amount ?? p.amount ?? 0;
      else if (type === 'payment') value = p.payment_amount ?? p.amount ?? 0;
      else if (type === 'rg') value = p.rg_amount ?? p.amount ?? 0;
      else if (type === 'outstanding') value = p.outstanding ?? p.closing_outstanding ?? p.amount ?? 0;

      return {
        date: p.period_start || p.date || '',
        value: Math.abs(value),
      };
    });
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await acknowledgeMutation.mutateAsync(alertId);
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleLogActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actNotes.trim()) return;
    try {
      await logActivityMutation.mutateAsync({
        customer_id: id,
        activity_type: actType,
        notes: actNotes,
        outcome: actOutcome,
      });
      setActNotes('');
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  };

  const handleLogCommitmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(commitAmount);
    if (isNaN(parsedAmount) || !commitDate) return;
    try {
      await logCommitmentMutation.mutateAsync({
        customer_id: id,
        amount: parsedAmount,
        promised_date: commitDate,
      });
      setCommitAmount('');
      setCommitDate('');
    } catch (err) {
      console.error('Failed to log payment commitment:', err);
    }
  };

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRec) return;
    try {
      await recordDecisionMutation.mutateAsync({
        customer_id: id,
        recommendation_id: selectedRec.id,
        action_taken: decisionAction,
        reason: overrideReason,
      });
      setSelectedRec(null);
      setOverrideReason('');
    } catch (err) {
      console.error('Failed to submit decision:', err);
    }
  };

  // Build a timeline combining backend ledger events, dunning actions, and payment promises
  const timelineEvents = [
    ...(dbActivities || []).map((act: any) => ({
      date: formatDate(act.created_at.split('T')[0]),
      title: `${act.activity_type.toUpperCase()} Outreach Logged`,
      description: `Outcome: ${act.outcome.replace('_', ' ')} | Notes: ${act.notes}`,
      type: 'neutral' as const,
    })),
    ...(dbCommitments || []).map((comm: any) => ({
      date: formatDate(comm.created_at.split('T')[0]),
      title: 'Payment Promise Logged',
      description: `Promised ${formatCurrency(comm.amount)} to settle on ${formatDate(comm.promised_date)} | Status: ${comm.status}`,
      type: comm.status === 'PENDING' ? ('warning' as const) : comm.status === 'KEPT' ? ('success' as const) : ('danger' as const),
    })),
    {
      date: formatDate(profile.last_purchased_at),
      title: 'Last Purchased Activity',
      description: `Last invoice generated for this customer account. Active balance currently at ${formatCurrency(totalOutstanding)}.`,
      type: 'success' as const,
    },
  ];

  const headerActions = (
    <Button
      onClick={() => router.push('/customers')}
      variant="secondary"
      icon={ArrowLeft}
    >
      Back to Matrix
    </Button>
  );

  return (
    <PageContent>
      {/* Header Profile */}
      <PageHeader
        title={profile.customer_name || 'Anonymous Account'}
        subtitle={`ID: ${profile.customer_id}  •  Location: ${profile.city || 'National Scope'}  •  Last Order: ${formatDate(profile.last_purchased_at)}`}
        actions={headerActions}
      />

      {/* Header Vitals Ribbon */}
      <PageToolbar>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full divide-y sm:divide-y-0 lg:divide-x divide-slate-200 pt-2 lg:pt-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Health Score</span>
            <HealthIndicator score={healthScore} label={profile.behavior_state} />
          </div>

          <div className="space-y-1 sm:pl-4 lg:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Score</span>
            <RiskIndicator score={riskScore} />
          </div>

          <div className="space-y-1 sm:pl-4 lg:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Exposure</span>
            <span className="font-headline text-lg font-extrabold text-slate-900 block">{formatCurrency(totalOutstanding)}</span>
          </div>

          <div className="space-y-1 sm:pl-4 lg:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credit Utilization</span>
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-extrabold text-slate-900">{creditUtilization}%</span>
              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                <div className="bg-teal-600 h-full" style={{ width: `${creditUtilization}%` }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-1 sm:pl-4 lg:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trend Direction</span>
            <TrendIndicator value={trendVal} />
          </div>
        </div>
      </PageToolbar>

      {/* --- Bloomberg-Grade Operational Workspace Layout --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Customer Overview & Scores */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Scorecard grids: 8 Score Blocks */}
          <div className="space-y-3">
            <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight">Consolidated Credit Scorecard</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard label="Health Index" score={scores.health_score} delta={deltas.health_score} description="Aggregate ledger status" />
              <ScoreCard label="Risk Index" score={scores.risk_score} delta={deltas.risk_score} description="Default probability risk" />
              <ScoreCard label="Purchase Volume" score={scores.growth_score} delta={deltas.growth_score} description="Frequency and value trends" />
              <ScoreCard label="Behavior Trust" score={scores.trust_score} delta={deltas.trust_score} description="Repayment trust factor" />
              <ScoreCard label="Expansion Opportunity" score={scores.opportunity_score} delta={deltas.opportunity_score} description="Limit upsell triggers" />
              <ScoreCard label="Credit Policy Safety" score={scores.credit_score} delta={deltas.credit_score} description="Compliance threshold" />
              <ScoreCard label="Collection Urgency" score={scores.collection_score} delta={deltas.collection_score} description="Action timeline queue" />
              <ScoreCard label="Trade Relationship" score={scores.relationship_score} delta={deltas.relationship_score} description="Loyalty longevity score" />
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" /> Live Priority Alerts
            </h3>
            {activeAlerts && activeAlerts.length > 0 ? (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border border-red-100 bg-red-50/50 rounded-xl flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="danger" size="sm">{alert.alert_type}</Badge>
                        <span className="text-xs font-bold text-slate-800">{alert.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                    </div>
                    <Button
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      variant="secondary"
                      size="sm"
                      isLoading={acknowledgeMutation.isPending}
                    >
                      Acknowledge
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No active Priority Alerts for this account.
              </div>
            )}
          </div>

          {/* Recommendations Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" /> Next-Best-Action Policy Queue
              </h3>
              <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Policy Rules Engine
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {recommendations && Array.isArray(recommendations.recommendations) && recommendations.recommendations.length > 0 ? (
                recommendations.recommendations.map((r, idx) => {
                  let badgeClass = 'text-teal-600 bg-teal-50 border-teal-200';
                  if (r.priority === 'HIGH' || r.priority === 'CRITICAL') {
                    badgeClass = 'text-red-600 bg-red-50 border-red-200';
                  } else if (r.priority === 'MEDIUM') {
                    badgeClass = 'text-amber-600 bg-amber-50 border-amber-200';
                  }

                  const mappedId = (recommendations as any).id || '';

                  return (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-500 shrink-0 mt-1">
                          {r.type === 'CREDIT_LIMIT' ? <Sliders className="w-4 h-4" /> : r.type === 'PAYMENT_TERMS' ? <Clock className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-xs font-bold text-slate-800">{r.action_category.replace(/_/g, ' ')}</span>
                            <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full border uppercase tracking-wider ${badgeClass}`}>
                              {r.priority}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-slate-500 leading-normal max-w-lg">{r.reason}</p>
                          <div className="flex gap-4 text-[9px] text-slate-400 font-semibold">
                            <span>Adjust: {r.value}</span>
                            <span>•</span>
                            <span>Confidence: {formatPercent(r.confidence)}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedRec({ id: mappedId, type: r.action_category })}
                        variant="accent"
                        size="sm"
                      >
                        Override/Approve
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-xs text-slate-400 text-center">No active credit recommendations triggered.</div>
              )}
            </div>
          </div>

          {/* Decision Override History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-headline text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" /> Decision Audit Trail & Overrides History
            </h3>
            {dbHistory && dbHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2">Timestamp</th>
                      <th className="py-2">Analyst</th>
                      <th className="py-2">Action</th>
                      <th className="py-2">Audit Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {dbHistory.map((hist) => (
                      <tr key={hist.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 text-slate-500">{new Date(hist.timestamp).toLocaleString()}</td>
                        <td className="py-2.5 text-slate-700 font-bold">{hist.performed_by}</td>
                        <td className="py-2.5">
                          <Badge variant={hist.action_taken === 'OVERRIDDEN' ? 'warning' : 'accent'} size="sm">
                            {hist.action_taken}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-slate-600">{hist.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No past overrides or approval history.
              </div>
            )}
          </div>

          {/* Interactive SVG Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-sm">
              <h4 className="font-headline text-sm font-bold text-slate-800">Billing History (Sales)</h4>
              <Chart
                data={mapGraphPoints(graphs.purchase.data || [], 'purchase')}
                type="purchase"
                title=""
                isLoading={graphs.purchase.isLoading}
                height={160}
              />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-sm">
              <h4 className="font-headline text-sm font-bold text-slate-800">Payment Settlements History</h4>
              <Chart
                data={mapGraphPoints(graphs.payment.data || [], 'payment')}
                type="payment"
                title=""
                isLoading={graphs.payment.isLoading}
                height={160}
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Action panels (Outreach Logger, Commitment Creator, Timeline) */}
        <div className="space-y-8">
          
          {/* Collections Outreach Logger Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-headline text-md font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <PhoneCall className="w-4 h-4 text-brand-accent" /> Log Outreach Activity
            </h3>
            <form onSubmit={handleLogActivitySubmit} className="space-y-3 text-xs">
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
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Action Notes</label>
                <textarea
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  placeholder="Record summary details..."
                  className="w-full p-3 h-20 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800 font-semibold resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full"
                isLoading={logActivityMutation.isPending}
              >
                Log Outreach Note
              </Button>
            </form>
          </div>

          {/* Promise-to-Pay Commitment Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-headline text-md font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-brand-accent" /> Log Payment Commitment
            </h3>
            <form onSubmit={handleLogCommitmentSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Promised Amount ($)</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={commitAmount}
                  onChange={(e) => setCommitAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:border-brand-accent text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Expected Date</label>
                <input
                  type="date"
                  value={commitDate}
                  onChange={(e) => setCommitDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:border-brand-accent text-slate-800"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full"
                isLoading={logCommitmentMutation.isPending}
              >
                Register Payment Promise
              </Button>
            </form>
          </div>

          {/* Unified timeline component */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-headline text-md font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-slate-500" /> Behavioral Memory timeline
            </h3>
            <Timeline events={timelineEvents} />
          </div>

        </div>

      </div>

      {/* --- OVERRIDE/APPROVAL DIALOG MODAL --- */}
      {selectedRec && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2">
              <h3 className="font-headline text-lg font-bold text-slate-800">Execute Credit Decision</h3>
              <button onClick={() => setSelectedRec(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer border-0 bg-transparent">×</button>
            </div>
            
            <form onSubmit={handleDecisionSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Select Decision Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['APPROVED', 'REJECTED', 'OVERRIDDEN'] as const).map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setDecisionAction(act)}
                      className={`h-10 rounded-lg border font-semibold cursor-pointer uppercase transition-colors ${
                        decisionAction === act
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
                <label className="font-bold text-slate-500 uppercase tracking-wider block">Rationale / Justification Notes</label>
                <textarea
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Provide detailed analytical reasoning for this decision..."
                  className="w-full p-3 h-24 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-accent text-slate-800 font-semibold resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <Button type="button" onClick={() => setSelectedRec(null)} variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm" isLoading={recordDecisionMutation.isPending}>
                  Submit Decision Action
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageContent>
  );
}

export default function CustomerDetailPage({ params }: PageProps) {
  return (
    <RouteErrorBoundary routeName="Customer Detail dossier">
      <CustomerDetailPageContent params={params} />
    </RouteErrorBoundary>
  );
}
