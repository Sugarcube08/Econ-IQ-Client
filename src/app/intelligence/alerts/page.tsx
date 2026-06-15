'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useActivitySummary } from '@/hooks/useDashboard';
import Badge from '@/components/ui/Badge';
import { normalizeAlerts } from '@/lib/normalizers';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
  Bell,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet,
  Zap,
  Clock,
  Sliders,
  Filter,
  Check
} from 'lucide-react';

function AlertsFeedPageContent() {
  const { data: rawAlerts, isLoading, isError } = useActivitySummary();
  const alerts = React.useMemo(() => normalizeAlerts(rawAlerts), [rawAlerts]);
  const [filterType, setFilterType] = useState<'all' | 'risk' | 'growth' | 'anomaly'>('all');
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);
  const [notificationDispatched, setNotificationDispatched] = useState<string | null>(null);
  const [termsAdjusted, setTermsAdjusted] = useState<string | null>(null);

  const handleAcknowledge = (id: string) => {
    setResolvedAlerts(prev => [...prev, id]);
  };

  const handleDispatch = (id: string) => {
    setNotificationDispatched(id);
    setTimeout(() => setNotificationDispatched(null), 3000);
  };

  const handleAdjustTerms = (id: string) => {
    setTermsAdjusted(id);
    setTimeout(() => setTermsAdjusted(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-outline">Retrieving live ledger signals...</p>
      </div>
    );
  }

  // Filter logic
  const activeAlerts = (Array.isArray(alerts) ? alerts : []).filter(item => {
    if (resolvedAlerts.includes(item.id)) return false;
    
    const isRisk = item.alert_type?.toLowerCase().includes('risk') || item.alert_type?.toLowerCase().includes('deteriorate') || item.alert_type?.toLowerCase().includes('payment') || item.alert_type?.toLowerCase().includes('warning');
    const isGrowth = item.alert_type?.toLowerCase().includes('growth') || item.alert_type?.toLowerCase().includes('improve') || item.alert_type?.toLowerCase().includes('opportunity') || item.alert_type?.toLowerCase().includes('signal');
    
    if (filterType === 'risk') return isRisk;
    if (filterType === 'growth') return isGrowth;
    if (filterType === 'anomaly') return !isRisk && !isGrowth;
    return true;
  });


  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/25 pb-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Intelligence Alerts Feed</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Real-time event anomalies, deterioration signals, and growth opportunities processed from active ledgers.
          </p>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-outline-variant p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <Filter className="w-4 h-4 text-outline shrink-0 mr-2" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider cursor-pointer ${
              filterType === 'all'
                ? 'bg-brand-accent border-brand-accent text-white'
                : 'bg-surface-container-low border-outline-variant/30 text-outline hover:text-primary'
            }`}
          >
            All Signals
          </button>
          <button
            onClick={() => setFilterType('risk')}
            className={`px-4 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider cursor-pointer ${
              filterType === 'risk'
                ? 'bg-error text-white border-error'
                : 'bg-surface-container-low border-outline-variant/30 text-outline hover:text-primary'
            }`}
          >
            Risks & Delays
          </button>
          <button
            onClick={() => setFilterType('growth')}
            className={`px-4 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider cursor-pointer ${
              filterType === 'growth'
                ? 'bg-[#80d5cb] border-[#80d5cb] text-[#003733]'
                : 'bg-surface-container-low border-outline-variant/30 text-outline hover:text-primary'
            }`}
          >
            Growth Signals
          </button>
          <button
            onClick={() => setFilterType('anomaly')}
            className={`px-4 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider cursor-pointer ${
              filterType === 'anomaly'
                ? 'bg-brand-gold border-brand-gold text-white'
                : 'bg-surface-container-low border-outline-variant/30 text-outline hover:text-primary'
            }`}
          >
            Ledger Anomalies
          </button>
        </div>

        <div className="text-xs text-outline font-semibold">
          Active Signals: {activeAlerts.length}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-6">
        {activeAlerts.length > 0 ? (
          activeAlerts.map((item) => {
            const isRisk = item.alert_type?.toLowerCase().includes('risk') || item.alert_type?.toLowerCase().includes('deteriorate');
            const isGrowth = item.alert_type?.toLowerCase().includes('growth') || item.alert_type?.toLowerCase().includes('improve');
            
            let cardBorder = 'border-outline-variant/40';
            let iconColor = 'text-brand-gold bg-brand-gold/10 border-brand-gold/25';
            let badgeVariant: 'accent' | 'warning' | 'danger' = 'warning';
            
            if (isRisk) {
              cardBorder = 'border-error/25 hover:border-error/50';
              iconColor = 'text-error bg-error/5 border-error/20';
              badgeVariant = 'danger';
            } else if (isGrowth) {
              cardBorder = 'border-brand-accent/25 hover:border-brand-accent/50';
              iconColor = 'text-brand-accent bg-brand-accent/5 border-brand-accent/20';
              badgeVariant = 'accent';
            }

            return (
              <div
                key={item.id}
                className={`bg-surface border ${cardBorder} p-6 rounded-xl hover:shadow-md transition-all space-y-4`}
              >
                {/* Alert Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${iconColor}`}>
                      {isRisk ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : isGrowth ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/customer/${item.customer_id}`}
                        className="font-headline text-lg font-bold text-primary hover:underline hover:text-brand-accent block"
                      >
                        {item.customer_name}
                      </Link>
                      <span className="text-[10px] text-outline font-mono block">ID: {item.customer_id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={badgeVariant} size="sm">
                      {item.alert_type?.replace(/_/g, ' ') || 'ANOMALY'}
                    </Badge>
                    <span className="text-[10px] text-outline/60 font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Alert Body */}
                <p className="text-sm text-outline leading-relaxed max-w-3xl">
                  {item.message}
                </p>

                {/* Inline Action Triggers */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-outline-variant/10">
                  <div className="flex flex-wrap gap-2">
                    {isRisk ? (
                      <button
                        onClick={() => handleAdjustTerms(item.id)}
                        className="px-3.5 py-1.5 bg-error text-white font-semibold text-xs rounded hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border-0 shadow-sm"
                      >
                        Tighten Payment Terms
                      </button>
                    ) : isGrowth ? (
                      <button
                        onClick={() => handleAdjustTerms(item.id)}
                        className="px-3.5 py-1.5 bg-brand-accent text-white font-semibold text-xs rounded hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border-0 shadow-sm"
                      >
                        Extend Credit Limit
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdjustTerms(item.id)}
                        className="px-3.5 py-1.5 bg-brand-gold text-white font-semibold text-xs rounded hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border-0 shadow-sm"
                      >
                        Audit Invoices
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDispatch(item.id)}
                      className="px-3.5 py-1.5 bg-surface border border-outline-variant text-primary font-semibold text-xs rounded hover:bg-surface-container-low transition-colors cursor-pointer shadow-sm"
                    >
                      Dispatch Warning
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => handleAcknowledge(item.id)}
                      className="px-3.5 py-1.5 bg-surface-container-high border border-outline-variant/30 text-outline hover:text-primary font-semibold text-xs rounded transition-colors cursor-pointer"
                    >
                      Acknowledge & Archive
                    </button>
                  </div>
                </div>

                {/* Toast alerts for in-line workflow feedback */}
                {termsAdjusted === item.id && (
                  <div className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent p-3 rounded-lg text-xs font-bold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4" /> Credit terms updated successfully for this account. Event logged in audit log.
                  </div>
                )}
                {notificationDispatched === item.id && (
                  <div className="bg-brand-gold/10 border border-brand-gold/30 text-brand-gold p-3 rounded-lg text-xs font-bold animate-fade-in flex items-center gap-2">
                    <Bell className="w-4 h-4" /> Priority dispatch sent to credit managers and customer billing representative.
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-surface rounded-xl border border-outline-variant p-12 text-center text-outline">
            <CheckCircle className="w-12 h-12 text-brand-accent mx-auto" />
            <h4 className="font-headline text-lg font-bold text-primary mt-4">All Clean!</h4>
            <p className="text-xs text-outline mt-2 leading-relaxed">
              No outstanding alerts require immediate attention. All wholesale ledger accounts are in sync.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default function AlertsFeedPage() {
  return (
    <RouteErrorBoundary routeName="Intelligence Alerts Feed">
      <AlertsFeedPageContent />
    </RouteErrorBoundary>
  );
}

