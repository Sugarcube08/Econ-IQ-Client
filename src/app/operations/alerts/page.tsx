'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAlerts } from '@/hooks/queries/useAlerts';
import { useAcknowledgeAlert } from '@/hooks/mutations/useAcknowledgeAlert';
import Table, { TableColumn } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { ShieldAlert, AlertTriangle, AlertCircle, Filter, Search, CheckSquare, Square } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

function OperationsAlertsPageContent() {
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [severityFilter, setSeverityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAcknowledging, setBulkAcknowledging] = useState(false);

  // Queries
  const { data: alertsData, isLoading, refetch } = useAlerts({
    status: statusFilter || undefined,
    severity: severityFilter || undefined,
    limit: 100,
  });

  // Mutations
  const acknowledgeMutation = useAcknowledgeAlert();

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeMutation.mutateAsync(id);
      setSelectedIds(prev => prev.filter(item => item !== id));
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

  const toggleSelectAll = (filteredAlerts: any[]) => {
    if (selectedIds.length === filteredAlerts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAlerts.map(a => a.id));
    }
  };

  // Client-side search filtering
  const filteredAlerts = useMemo(() => {
    const list = Array.isArray(alertsData) ? alertsData : [];
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(
      (a: any) =>
        a.customer_id.toLowerCase().includes(query) ||
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
    );
  }, [alertsData, searchQuery]);

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
      key: 'customer_id',
      header: 'Customer ID',
      sortable: true,
      width: 150,
      render: (row) => (
        <Link
          href={`/customer/${row.customer_id}`}
          className="font-bold text-brand-accent hover:underline text-xs block"
        >
          {row.customer_id}
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
                onClick={() => { setStatusFilter(st); setSelectedIds([]); }}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer border-0 transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setSelectedIds([]); }}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:border-brand-accent text-slate-700"
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="WARNING">Warning Only</option>
            </select>
          </div>

        </div>

        {/* Search */}
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-brand-accent text-slate-800 placeholder-slate-400 bg-slate-50"
          />
        </div>
      </div>

      {/* Bulk actions ribbon */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs font-bold text-teal-800 animate-fade-in shadow-sm">
          <span>Selected {selectedIds.length} alerts for bulk action</span>
          <Button
            onClick={handleBulkAcknowledge}
            variant="accent"
            size="sm"
            isLoading={bulkAcknowledging}
          >
            Acknowledge Selected
          </Button>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <Table
          columns={columns}
          data={filteredAlerts}
          isLoading={isLoading}
          sortBy="created_at"
          sortOrder="desc"
          density="compact"
        />
      </div>

    </div>
  );
}

export default function OperationsAlertsPage() {
  return (
    <RouteErrorBoundary routeName="Operations Alerts feed">
      <OperationsAlertsPageContent />
    </RouteErrorBoundary>
  );
}
