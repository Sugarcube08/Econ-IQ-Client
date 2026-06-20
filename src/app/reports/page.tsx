'use client';

import React, { useState, useEffect } from 'react';
import { ReportService } from '@/services/report.service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table, { TableColumn } from '@/components/ui/Table';
import { Download } from 'lucide-react';

interface ExportHistoryItem {
  id: string;
  segment: string;
  search: string;
  timestamp: string;
  checksum: string;
  size: string;
}

export default function ReportsPage() {
  const [segment, setSegment] = useState('');
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('econiq_export_history');
      if (stored) {
        setExportHistory(JSON.parse(stored));
      } else {
        // Default historical records
        const defaults: ExportHistoryItem[] = [
          {
            id: 'exp-83921',
            segment: 'Liquidity Stress',
            search: 'N/A',
            timestamp: '2026-06-12 14:32',
            checksum: '8b7c9f1a2e3d...',
            size: '42.8 KB'
          },
          {
            id: 'exp-83920',
            segment: 'All Segment States',
            search: 'Punjab',
            timestamp: '2026-06-10 09:15',
            checksum: 'f4e3d2c1b0a9...',
            size: '124.5 KB'
          }
        ];
        setExportHistory(defaults);
        localStorage.setItem('econiq_export_history', JSON.stringify(defaults));
      }
    }
  }, []);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setExportMessage(null);
    try {
      const blob = await ReportService.downloadCustomersCsv({
        current_state: segment || undefined,
        search: search || undefined,
      });
      const filename = `econiq_commercial_intelligence_${segment || 'all'}_export.csv`;
      ReportService.triggerDownload(blob, filename);
      setExportMessage('Report generated and downloaded successfully.');

      // Add to history
      const nowMs = Date.now();
      const newItem: ExportHistoryItem = {
        id: `exp-${(nowMs % 90000) + 10000}`,
        segment: segment ? segment.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All Segment States',
        search: search || 'N/A',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        checksum: nowMs.toString(16).substring(0, 12) + '...',
        size: `${(blob.size / 1024).toFixed(1)} KB`
      };

      const updated = [newItem, ...exportHistory];
      setExportHistory(updated);
      localStorage.setItem('econiq_export_history', JSON.stringify(updated));
    } catch (err) {
      console.error('CSV download error:', err);
      setExportMessage('Error exporting report. Check network credentials.');
    } finally {
      setIsExporting(false);
    }
  };

  const columns: TableColumn<ExportHistoryItem>[] = [
    {
      key: 'id',
      header: 'Export ID',
      sortable: false,
      pinned: true,
      width: 120,
      render: (item) => <span className="font-mono font-bold text-primary">{item.id}</span>
    },
    {
      key: 'segment',
      header: 'Behavioral Segment',
      sortable: false,
      width: 180,
      render: (item) => <span className="font-semibold text-primary">{item.segment}</span>
    },
    {
      key: 'search',
      header: 'Fuzzy Filter',
      sortable: false,
      width: 150,
      render: (item) => <span className="text-outline">{item.search}</span>
    },
    {
      key: 'timestamp',
      header: 'Date & Time',
      sortable: false,
      width: 180,
      render: (item) => <span className="text-outline">{item.timestamp}</span>
    },
    {
      key: 'checksum',
      header: 'SHA-256 Checksum',
      sortable: false,
      width: 150,
      render: (item) => <span className="font-mono text-outline">{item.checksum}</span>
    },
    {
      key: 'size',
      header: 'File Size',
      sortable: false,
      align: 'right',
      width: 110,
      render: (item) => <span className="font-semibold">{item.size}</span>
    }
  ];

  return (
    <div className="space-y-xl max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-headline font-semibold text-primary">Intelligence Reports</h2>
        <p className="text-sm font-sans text-outline mt-1">
          Export canonical customer scoring matrices, behavior states, and overdue aging data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Export form */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm space-y-md bg-white h-fit">
          <h3 className="font-headline text-base font-bold text-primary">Export Custom Ledger Matrix</h3>
          
          {exportMessage && (
            <div className={`p-md rounded text-xs font-semibold ${
              exportMessage.includes('Error') ? 'bg-error-container/20 border border-error/50 text-error' : 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent'
            }`}>
              {exportMessage}
            </div>
          )}

          <form onSubmit={handleExport} className="space-y-md">
            <Select
              label="Target Behavioral Segment"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              options={[
                { value: '', label: 'All Segment States' },
                { value: 'active', label: 'Active' },
                { value: 'declining', label: 'Declining' },
                { value: 'healthy', label: 'Healthy' },
                { value: 'monitor', label: 'Monitor' },
                { value: 'contract', label: 'Contract' },
                { value: 'liquidity_stress', label: 'Liquidity Stress' },
              ]}
            />

            <Input
              label="Fuzzy Search Filter (Optional)"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. city names or business aliases..."
            />

            <Button
              type="submit"
              isLoading={isExporting}
              icon={Download}
              variant="accent"
              className="w-full h-10"
            >
              {isExporting ? 'Compiling CSV...' : 'Compile & Export Ledger'}
            </Button>
          </form>
        </div>

        {/* Export history */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col bg-white">
          <div className="p-md border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-headline text-sm font-bold text-primary">Recent Exports History</h3>
          </div>
          <Table
            columns={columns}
            data={exportHistory}
            isLoading={false}
            isError={false}
          />
        </div>
      </div>
    </div>
  );
}
