'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomers } from '@/hooks/useCustomer';
import { ReportService } from '@/services/report.service';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { SectionHeader, CaseStudyCards, CTASection } from '@/components/marketing/MarketingComponents';

// --- AUTHENTICATED B2B CREDIT ANALYSIS MATRIX ---
function AuthenticatedCustomers() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('trust_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const params = {
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(stateFilter ? { current_state: stateFilter } : {}),
  };

  const { data, isLoading, isError } = useCustomers(params);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await ReportService.downloadCustomersCsv({
        search: debouncedSearch,
        current_state: stateFilter,
      });
      ReportService.triggerDownload(blob);
    } catch (e) {
      console.error('Failed to export CSV:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const customers = data?.data?.customers || [];
  const pagination = data?.metadata?.pagination || {
    page: 1,
    limit: 10,
    total_records: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  };

  return (
    <div className="space-y-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-semibold text-primary">Customer Intelligence</h2>
          <p className="text-sm font-sans text-outline mt-1">
            Stateful B2B credit analysis matrix. Click on any row to open account detail scorecards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-secondary border border-outline-variant bg-surface rounded hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            {isExporting ? 'Exporting...' : 'Export Filtered CSV'}
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="p-md border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row items-center gap-md justify-between">
          <div className="flex flex-1 items-center gap-md w-full">
            <div className="relative flex-1 max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface pl-10 pr-4 py-1.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 text-xs text-on-surface placeholder:text-outline"
                placeholder="Search by ID, name, or city..."
              />
            </div>

            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setPage(1);
              }}
              className="bg-surface border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20"
            >
              <option value="">All Segment States</option>
              <option value="active">Active</option>
              <option value="declining">Declining</option>
              <option value="healthy">Healthy</option>
              <option value="monitor">Monitor</option>
              <option value="contract">Contract</option>
              <option value="liquidity_stress">Liquidity Stress</option>
            </select>

            {stateFilter || debouncedSearch ? (
              <button
                onClick={() => {
                  setSearch('');
                  setStateFilter('');
                  setPage(1);
                }}
                className="text-xs font-semibold text-brand-accent hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            ) : null}
          </div>

          <div className="text-xs text-outline font-sans">
            Showing {Math.min(pagination.total_records, (page - 1) * limit + 1)}-
            {Math.min(pagination.total_records, page * limit)} of {pagination.total_records} records
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 bg-surface">
              <div className="w-8 h-8 border-3 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-outline font-sans">Fetching customer index...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-error font-sans text-xs bg-surface">
              Could not retrieve customer records. Ensure the backend is active.
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-16 text-outline font-sans text-xs bg-surface">
              No commercial accounts matched your search queries.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-surface-container-low border-b border-outline-variant font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                <tr>
                  <th className="p-md cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('customer_name')}>
                    <div className="flex items-center gap-1">
                      Customer Name
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'customer_name' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('city')}>
                    <div className="flex items-center gap-1">
                      City
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'city' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('trust_score')}>
                    <div className="flex items-center gap-1">
                      Trust Score
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'trust_score' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('growth_score')}>
                    <div className="flex items-center gap-1">
                      Purchase Score
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'growth_score' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('collection_score')}>
                    <div className="flex items-center gap-1">
                      Payment Score
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'collection_score' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('relationship_score')}>
                    <div className="flex items-center gap-1">
                      RG Score
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'relationship_score' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('state')}>
                    <div className="flex items-center gap-1">
                      State
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'state' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('outstanding_current')}>
                    <div className="flex items-center gap-1 justify-end">
                      Outstanding
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'outstanding_current' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('contribution_current')}>
                    <div className="flex items-center gap-1 justify-end">
                      Contribution
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'contribution_current' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                  <th className="p-md cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('last_purchase_date')}>
                    <div className="flex items-center gap-1">
                      Last Order
                      <span className="material-symbols-outlined text-[14px]">
                        {sortBy === 'last_purchase_date' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs font-sans text-[#243447] bg-white">
                {customers.map((c) => {
                  const stateClass =
                    c.state.toLowerCase() === 'active' || c.state.toLowerCase() === 'healthy'
                      ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30'
                      : c.state.toLowerCase() === 'monitor'
                      ? 'bg-brand-gold/10 text-[#c8a96b] border-brand-gold/30'
                      : 'bg-error/10 text-error border-error/30';

                  return (
                    <tr
                      key={c.customer_id}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                      onClick={() => router.push(`/customer/${c.customer_id}`)}
                    >
                      <td className="p-md font-semibold text-[#0F766E]">
                        {c.customer_name || 'Anonymous Customer'}
                        <div className="text-[10px] text-outline font-mono mt-0.5">ID: {c.customer_id.slice(0, 8)}</div>
                      </td>
                      <td className="p-md text-outline">{c.city || 'N/A'}</td>
                      <td className="p-md font-bold">{(c.trust_score * 100).toFixed(0)}%</td>
                      <td className="p-md font-bold">{(c.growth_score * 100).toFixed(0)}%</td>
                      <td className="p-md font-bold">{(c.collection_score * 100).toFixed(0)}%</td>
                      <td className="p-md font-bold">{(c.relationship_score * 100).toFixed(0)}%</td>
                      <td className="p-md">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase ${stateClass}`}>
                          {c.state.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-md text-right font-bold">{formatCurrency(c.outstanding_current)}</td>
                      <td className="p-md text-right font-semibold">{formatPercent(c.contribution_current)}</td>
                      <td className="p-md text-outline">{formatDate(c.last_purchase_date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-md border-t border-outline-variant bg-surface flex justify-between items-center text-xs">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.has_previous || isLoading}
            className="px-3 py-1.5 border border-outline-variant rounded bg-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[#243447] cursor-pointer"
          >
            Previous
          </button>
          <span className="font-sans text-outline">
            Page <strong className="text-primary">{page}</strong> of <strong className="text-primary">{pagination.total_pages}</strong>
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.has_next || isLoading}
            className="px-3 py-1.5 border border-outline-variant rounded bg-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[#243447] cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// --- PUBLIC ENTERPRISE CASE STUDIES PAGE ---
function PublicCustomers() {
  const caseStudies = [
    {
      company: 'Standard Steel Castings Ltd.',
      initials: 'SC',
      industry: 'Heavy Manufacturing & Distribution',
      metric: 'DSO -18.4 Days',
      metricLabel: 'Working Capital Cycle Acceleration',
      description: 'Econ-IQ synchronized our ERP ledgers and highlighted payment delays before our quarterly close, saving us millions in working capital by active automated credit terms adaptation.',
      challenge: 'Average DSO exceeded 58 days. credit exposures across 120 regional distributor accounts were completely unmonitored.',
      solution: 'Automated ledger analysis computes continuous payment scores, triggering proactive term modifications.',
    },
    {
      company: 'Apex Logistics & Wholesale Supply',
      initials: 'AL',
      industry: 'Industrial Supply & Wholesale',
      metric: '-32.5%',
      metricLabel: 'Reduction in Credit Delinquency',
      description: 'We replaced outdated manual credit checks with Econ-IQs live behavioral intelligence scores, dramatically dropping default rates in our wholesale channels.',
      challenge: 'Manual credit reports were compiled monthly and missed live order surges and regional payment delays.',
      solution: 'Real-time ingestion of invoice data updates customer trust and payment profiles on every order execution.',
    },
    {
      company: 'Vohra-Dugal FMCG Corporation',
      initials: 'VD',
      industry: 'FMCG Distribution Network',
      metric: '2.8x',
      metricLabel: 'Increase in Collections Efficiency',
      description: 'By prioritizing high-risk, high-exposure accounts based on active risk buckets rather than nominal invoice age, we maximized cash flow recovery rates.',
      challenge: 'Our collections staff spent 80% of their time chasing small, low-risk invoices while massive exposures aged silently.',
      solution: 'Stateful customer segmentation automatically queues outstanding accounts based on live liquidity stress flags.',
    },
    {
      company: 'Metals Trading Alliance',
      initials: 'MT',
      industry: 'Commodities Trading & Logistics',
      metric: '$4.2M',
      metricLabel: 'Released Working Capital',
      description: 'Within 90 days of deploying Econ-IQ, we identified and resolved hidden bottlenecks in our billing and dispute management workflows.',
      challenge: 'Disputes over freight charges lingered for months, stalling payments and bloating total outstanding balances.',
      solution: 'Consolidated commercial analytics matches invoices with delivery signals, raising dispute alerts instantly.',
    }
  ];

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-[#FAF9F6] text-[#243447]">
      {/* Header */}
      <SectionHeader
        tag="Case Studies"
        title="Validated Business Outcomes"
        description="Explore how leading industrial enterprise manufacturers, distributors, and wholesalers convert ledger signals into stateful liquidity improvements."
      />

      {/* Case Study Grid */}
      <div className="max-w-[1280px] mx-auto">
        <CaseStudyCards studies={caseStudies} />
      </div>

      {/* Business Transformation Summary */}
      <section className="bg-white border border-[#E3E2DF] rounded-xl p-8 md:p-12 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">Methodology</span>
          <h3 className="font-headline text-lg font-bold text-[#243447]">No Estimates, Just Ledgers</h3>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            Econ-IQ does not rely on generic market indices or external credit databases. We perform transactional audit verification on your historical and current invoice registers to calculate precise behavioral indicators.
          </p>
        </div>
        
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">Integrations</span>
          <h3 className="font-headline text-lg font-bold text-[#243447]">Zero-Disruption Deployment</h3>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            Our API connections connect with modern ERP platforms (SAP, Oracle, NetSuite) and flat-file exports in less than 72 hours, extracting data safely without impacting operational performance.
          </p>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">Security</span>
          <h3 className="font-headline text-lg font-bold text-[#243447]">Enterprise Grade Security</h3>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            Econ-IQ encrypts and hashes all ledger records at rest and in transit. Your proprietary commercial histories remain private to your organizational tenant and are never shared.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <CTASection
        title="Begin your cash flow optimization journey"
        subtitle="Schedule an assessment session with our risk engineers to see how Econ-IQ can profile your outstanding exposures."
        primaryText="Request Live Demo"
        primaryLink="/contact?type=demo"
        secondaryText="View Platform Specifications"
        secondaryLink="/platform"
      />
    </div>
  );
}

// --- MAIN WRAPPER COMPONENT ---
export default function CustomersPage() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-8 h-8 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedCustomers /> : <PublicCustomers />;
}
