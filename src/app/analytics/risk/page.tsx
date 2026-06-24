'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardCharts } from '@/hooks/useDashboard';
import { usePortfolioAnalytics } from '@/hooks/queries/usePortfolioAnalytics';
import { useRiskSignals } from '@/hooks/queries/useRiskSignals';
import { formatCurrency, formatPercent } from '@/lib/utils';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { ShieldAlert, ArrowRight, PieChart } from 'lucide-react';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import LoadingState from '@/components/ui/LoadingState';

function RiskAnalyticsPageContent() {
  const { stateDistribution, isLoading: isChartsLoading } = useDashboardCharts();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = usePortfolioAnalytics();
  const { data: riskSignalsData, isLoading: isQueuesLoading } = useRiskSignals({
    page: 1,
    limit: 10,
    sort_by: 'outstanding_current',
    sort_order: 'desc'
  });

  const isLoading = isChartsLoading || isAnalyticsLoading || isQueuesLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingState message="Compiling risk telemetry..." />
      </div>
    );
  }

  const stateData = stateDistribution?.data || {};

  // Risk distribution points from backend
  const riskList = (riskSignalsData?.items || []).map(item => ({
    customer_id: item.customer_id,
    customer_name: item.customer_name || 'Wholesale Client',
    safety_score: item.safety_score,
    outstanding: item.outstanding_current || 0,
    state: item.state || 'MONITOR'
  }));

  const columns: TableColumn<typeof riskList[0]>[] = [
    {
      key: 'customer_name',
      header: 'Customer Account',
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
      key: 'safety_score',
      header: 'Safety Score',
      sortable: true,
      width: 150,
      render: (row) => {
        const score = row.safety_score;
        let scoreColor = 'text-brand-accent';
        if (score <= 0.4) {
          scoreColor = 'text-error';
        } else if (score < 0.7) {
          scoreColor = 'text-brand-gold';
        }
        return (
          <span className={`font-mono font-bold text-sm ${scoreColor}`}>
            {(score * 100).toFixed(0)}%
          </span>
        );
      }
    },
    {
      key: 'outstanding',
      header: 'Balance Exposure',
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
      key: 'state',
      header: 'Segment',
      width: 150,
      render: (row) => {
        const stateStr = (row.state || 'MONITOR').toUpperCase();
        let variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'info';
        if (stateStr === 'LIQUIDITY_STRESS' || stateStr === 'STRESSED') {
          variant = 'danger';
        } else if (stateStr === 'MONITOR' || stateStr === 'CONTRACT') {
          variant = 'warning';
        } else if (stateStr === 'HEALTHY') {
          variant = 'success';
        }
        return (
          <Badge variant={variant} size="sm">
            {stateStr.replace('_', ' ')}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      header: 'Detail',
      align: 'center',
      width: 120,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent uppercase hover:underline"
        >
          Workspace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )
    }
  ];

  const avgRisk = analyticsData?.risk_analytics?.average_risk_score || 0.35;
  const avgSafety = analyticsData?.risk_analytics?.average_safety_score || 0.65;
  const highRiskExposure = analyticsData?.risk_analytics?.high_risk_exposure_pct || 0.0;
  
  let riskLevel = 'LOW';
  let badgeVariant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'success';
  if (avgRisk > 0.6) {
    riskLevel = 'HIGH';
    badgeVariant = 'danger';
  } else if (avgRisk > 0.3) {
    riskLevel = 'MEDIUM';
    badgeVariant = 'warning';
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/25 pb-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Risk Analytics Center</h2>
          <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
            Longitudinal distribution of customer default risk metrics and stateful segments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* State Distributions */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="border-b border-outline-variant/20 pb-3">
            <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Behavioral Segment Spread</h3>
          </div>
          <div className="space-y-4">
            {Object.keys(stateData).length > 0 ? (
              Object.entries(stateData).map(([state, val]: [string, any]) => {
                const percentage = val.percentage;
                let colorClass = 'bg-brand-accent';
                if (state.toLowerCase() === 'monitor') colorClass = 'bg-[#c8a96b]';
                if (state.toLowerCase() === 'contract') colorClass = 'bg-secondary';
                if (state.toLowerCase() === 'liquidity_stress' || state.toLowerCase() === 'declining') colorClass = 'bg-error';

                return (
                  <div key={state} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold font-sans">
                      <span className="uppercase tracking-wider text-primary">{state.replace('_', ' ')}</span>
                      <span className="text-outline">{val.count} accounts ({formatPercent(percentage / 100)})</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden border border-outline-variant/10">
                      <div className={`${colorClass} h-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-outline text-center py-8">No accounts recorded.</div>
            )}
          </div>
        </div>

        {/* Aggregate Risk Vitals */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="border-b border-outline-variant/20 pb-3 flex items-center justify-between">
            <h3 className="font-headline text-lg font-bold text-primary tracking-tight">Risk Index Status</h3>
            <PieChart className="w-5 h-5 text-outline" />
          </div>
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Active Monitor Share:</span>
              <span className="font-bold text-brand-gold">{(stateData.monitor?.percentage || 0).toFixed(0)}% of accounts</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">High Risk Exposure:</span>
              <span className="font-bold text-error">{highRiskExposure.toFixed(1)}% of exposure</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
              <span className="text-outline uppercase">Aggregate Risk Level:</span>
              <span className={`font-bold uppercase ${avgRisk > 0.6 ? 'text-error' : avgRisk > 0.3 ? 'text-brand-gold' : 'text-brand-accent'}`}>{riskLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline uppercase">Risk Severity SLA:</span>
              <Badge variant={badgeVariant} size="sm">{avgRisk > 0.3 ? 'TIGHTEN_CREDIT_POLICY' : 'MAINTAIN_CURRENT_POLICY'}</Badge>
            </div>
          </div>
        </div>

      </div>

      {/* Stressed Accounts table */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-primary tracking-tight">Stressed Accounts Queue</h3>
        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Table
            columns={columns}
            data={riskList}
            isLoading={false}
            sortBy="outstanding"
            sortOrder="desc"
            density="standard"
          />
        </div>
      </div>
    </div>
  );
}

export default function RiskAnalyticsPage() {
  return (
    <RouteErrorBoundary routeName="Risk Analytics telemetry">
      <RiskAnalyticsPageContent />
    </RouteErrorBoundary>
  );
}
