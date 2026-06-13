'use client';

import React, { useState } from 'react';
import { ReportService } from '@/services/report.service';

export default function ReportsPage() {
  const [segment, setSegment] = useState('');
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setExportMessage(null);
    try {
      const blob = await ReportService.downloadCustomersCsv({
        current_state: segment || undefined,
        search: search || undefined,
      });
      ReportService.triggerDownload(blob, `econiq_commercial_intelligence_${segment || 'all'}_export.csv`);
      setExportMessage('Report generated and downloaded successfully.');
    } catch (err) {
      console.error('CSV download error:', err);
      setExportMessage('Error exporting report. Check network credentials.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-xl max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-headline font-semibold text-primary">Intelligence Reports</h2>
        <p className="text-sm font-sans text-outline mt-1">
          Export canonical customer scoring matrices, behavior states, and overdue aging data.
        </p>
      </div>

      <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm space-y-md">
        <h3 className="font-headline text-base font-bold text-primary">Export Custom Ledger Matrix</h3>
        
        {exportMessage && (
          <div className={`p-md rounded text-xs font-semibold ${
            exportMessage.includes('Error') ? 'bg-error-container/20 border border-error/50 text-error' : 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent'
          }`}>
            {exportMessage}
          </div>
        )}

        <form onSubmit={handleExport} className="space-y-md">
          {/* Segment Selector */}
          <div className="space-y-xs">
            <label className="font-sans text-xs font-semibold text-outline uppercase">Target Behavioral Segment</label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-accent"
            >
              <option value="">All Segment States</option>
              <option value="active">Active</option>
              <option value="declining">Declining</option>
              <option value="healthy">Healthy</option>
              <option value="monitor">Monitor</option>
              <option value="contract">Contract</option>
              <option value="liquidity_stress">Liquidity Stress</option>
            </select>
          </div>

          {/* Search Scope */}
          <div className="space-y-xs">
            <label className="font-sans text-xs font-semibold text-outline uppercase">Fuzzy Search Filter (Optional)</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. city names or business aliases..."
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isExporting}
            className="w-full h-12 bg-[#0F766E] text-white font-sans font-bold text-xs rounded hover:bg-[#0F766E]/90 transition-colors shadow-sm flex items-center justify-center gap-xs cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_download</span>
            {isExporting ? 'Compiling CSV Stream...' : 'Compile & Export Ledger'}
          </button>
        </form>
      </div>
    </div>
  );
}
