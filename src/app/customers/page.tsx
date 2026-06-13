'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomers } from '@/hooks/useCustomer';
import { ReportService } from '@/services/report.service';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils';

export default function CustomersPage() {
  const router = useRouter();
  // States for server sorting, searching, pagination, filtering
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('trust_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to first page on search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Query customers with active server modifiers
  const params = {
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(stateFilter ? { current_state: stateFilter } : {}),
  };

  const { data, isLoading, isError, refetch } = useCustomers(params);

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
      {/* Header */}
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

      {/* Advanced Filter Bar */}
      <div className="bg-surface rounded-lg border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="p-md border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row items-center gap-md justify-between">
          <div className="flex flex-1 items-center gap-md w-full">
            {/* Search Input */}
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

            {/* State Filter Dropdown */}
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

        {/* Datatable Scroll Container */}
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
              <tbody className="divide-y divide-outline-variant/30 text-xs font-sans text-on-surface bg-surface">
                {customers.map((c) => {
                  const stateClass =
                    c.state.toLowerCase() === 'active' || c.state.toLowerCase() === 'healthy'
                      ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30'
                      : c.state.toLowerCase() === 'monitor'
                      ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/30'
                      : 'bg-error/10 text-error border-error/30';

                  return (
                    <tr
                      key={c.customer_id}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                      onClick={() => router.push(`/customer/${c.customer_id}`)}
                    >
                      <td className="p-md font-semibold text-primary">
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

        {/* Server Pagination Panel */}
        <div className="p-md border-t border-outline-variant bg-surface flex justify-between items-center text-xs">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.has_previous || isLoading}
            className="px-3 py-1.5 border border-outline-variant rounded bg-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-secondary cursor-pointer"
          >
            Previous
          </button>
          <span className="font-sans text-outline">
            Page <strong className="text-primary">{page}</strong> of <strong className="text-primary">{pagination.total_pages}</strong>
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.has_next || isLoading}
            className="px-3 py-1.5 border border-outline-variant rounded bg-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-secondary cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
