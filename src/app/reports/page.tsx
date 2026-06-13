'use client';

import React, { useState } from 'react';
import { ReportService } from '@/services/report.service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Download } from 'lucide-react';

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

      <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm space-y-md bg-white">
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
            size="lg"
            className="w-full"
          >
            {isExporting ? 'Compiling CSV Stream...' : 'Compile & Export Ledger'}
          </Button>
        </form>
      </div>
    </div>
  );
}
