'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAlerts } from '@/hooks/queries/useAlerts';
import { useAcknowledgeAlert } from '@/hooks/mutations/useAcknowledgeAlert';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { Filter, Search, CheckSquare, Square } from 'lucide-react';

function OperationsAlertsPageContent() {
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [severityFilter, setSeverityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAcknowledging, setBulkAcknowledging] = useState(false);

  useEffect(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, [search]);

  // Queries
  const { data: alertsData, isLoading, refetch } = useAlerts({
    page,
    limit,
    status: statusFilter || undefined,
    severity: severityFilter || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    search: debouncedSearch || undefined,
  });

  // Mutations
  const acknowledgeMutation = useAcknowledgeAlert();

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeMutation.mutateAsync(id);
      setSelectedIds(prev => prev.filter(item => item !== id));
      refetch();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleBulkAcknowledge = async () => {
    if (selectedIds.length === 0) return;
    setBulkAcknowledging(true);
    try {
      await Promise.all(selectedIds.map(id => acknowledgeMutation.mutateAsync(id)));
      setSelectedIds([]);
      refetch();
    } catch (err) {
      console.error('Failed in bulk acknowledgment:', err);
    } finally {
      setBulkAcknowledging(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const items = useMemo(() => {
    if (!alertsData) return [];
    if (Array.isArray(alertsData)) return alertsData;
    if ('items' in alertsData) return alertsData.items;
    return [];
  }, [alertsData]);

  const totalPages = (alertsData && 'total_pages' in alertsData) ? (alertsData.total_pages as number) : 1;

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((a: any) => a.id));
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'select',
      header: '',
      width: 50,
      align: 'center',
      render: (row) => {
        const isSelected = selectedIds.includes(row.id);
        return (
          <button
            onClick={() => toggleSelect(row.id)}
            className="p-1 text-slate-400 hover:text-brand-accent cursor-pointer bg-transparent border-0"
          >
            {isSelected ? (
              <CheckSquare className="w-4 h-4 text-brand-accent" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        );
      },
    },
    {
      key: 'customer_name',
      header: 'Customer Name',
      sortable: true,
      width: 180,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}`}
          className="font-bold text-brand-accent hover:underline text-xs block"
        >
          {row.customer_name || row.customer_id}
        </Link>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      width: 120,
      render: (row) => (
        <Badge variant={row.alert_severity === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
          {row.alert_severity}
        </Badge>
      ),
    },
    {
      key: 'alert_type',
      header: 'Type',
      sortable: true,
      width: 150,
      render: (row) => <span className="font-semibold text-xs text-slate-700">{row.alert_type}</span>,
    },
    {
      key: 'title',
      header: 'Alert Title',
      width: 200,
      render: (row) => <span className="font-bold text-xs text-slate-800">{row.title}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      width: 320,
      render: (row) => <p className="text-xs text-slate-500 leading-normal">{row.description}</p>,
    },
    {
      key: 'created_at',
      header: 'Triggered At',
      sortable: true,
      width: 150,
      render: (row) => <span className="font-mono text-xs text-slate-500">{new Date(row.created_at).toLocaleString()}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 120,
      align: 'center',
      render: (row) =>
        row.status === 'ACTIVE' ? (
          <Button
            onClick={() => handleAcknowledge(row.id)}
            variant="secondary"
            size="sm"
            isLoading={acknowledgeMutation.isPending}
          >
            Acknowledge
          </Button>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold uppercase">Acknowledged</span>
        ),
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Priority Alerts Inbox</h2>
        <p className="font-sans text-sm text-outline mt-1 leading-relaxed">
          Operational workspace for credit risk alerts, dunning trigger metrics, and segment downgrades.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto text-xs font-bold">
          
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            <span className="text-slate-400 uppercase">Status:</span>
          </div>
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {['ACTIVE', 'ACKNOWLEDGED'].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setSelectedIds([]); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer border-0 transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden lg:block"></div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 uppercase">Severity:</span>
          </div>
          <select
            value={severityFilter}
            onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-lg h-9 px-3 focus:outline-none focus:border-brand-accent text-slate-700"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="MAJOR">Major & Above</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Information</option>
          </select>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
          {/* Fuzzy Search */}
          <div className="relative w-full lg:w-72">
            <input
              type="text"
              placeholder="Fuzzy search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-accent bg-white text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Bulk action */}
          {statusFilter === 'ACTIVE' && (
            <Button
              onClick={handleBulkAcknowledge}
              disabled={selectedIds.length === 0 || bulkAcknowledging}
              variant="accent"
              size="sm"
              className="w-full sm:w-auto"
            >
              Acknowledge ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Grid Datatable */}
      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <Table
          columns={columns}
          data={items}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          hasPrevious={page > 1}
          hasNext={page < totalPages}
          density="compact"
          emptyState={
            <div className="py-8 text-center text-slate-400">
              No matching alerts found in active workspace queue.
            </div>
          }
        />
      </div>

    </div>
  );
}

export default function OperationsAlertsPage() {
  return (
    <RouteErrorBoundary routeName="Operations Alerts Command Center">
      <OperationsAlertsPageContent />
    </RouteErrorBoundary>
  );
}
