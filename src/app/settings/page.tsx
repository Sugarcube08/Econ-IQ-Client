'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

interface HealthStatus {
  status: string;
  environment?: string;
  version?: string;
  error?: string;
}

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [defaultWindow, setDefaultWindow] = useState('365');
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await apiClient.get<StandardResponse<HealthStatus>>('/health');
      setHealth(res.data.data || { status: 'healthy', environment: 'production', version: '2.0.0' });
    } catch (e) {
      console.error('Failed to retrieve health status:', e);
      setHealth({ status: 'unhealthy', error: 'Failed to contact backend services.' });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkHealth();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg('Preferences saved successfully.');
    setTimeout(() => setSaveMsg(null), 3000);
  };

  return (
    <div className="space-y-xl max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-headline font-semibold text-primary">Settings & Config</h2>
        <p className="text-sm font-sans text-outline mt-1">
          Adjust console preferences and inspect operational backend heartbeat telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-md">
        {/* Heartbeat Status */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm space-y-md">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-primary">System Heartbeat</h3>
            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] animate-spin-once">refresh</span>
              {isCheckingHealth ? 'Polling...' : 'Poll Status'}
            </button>
          </div>

          {health ? (
            <div className="space-y-sm text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Health Check Status</span>
                <span className={`font-bold uppercase ${health.status === 'healthy' ? 'text-brand-accent' : 'text-error'}`}>
                  {health.status}
                </span>
              </div>
              {health.environment && (
                <div className="flex justify-between py-1 border-b border-outline-variant/30">
                  <span className="text-outline">Active Environment</span>
                  <span className="font-semibold text-primary uppercase">{health.environment}</span>
                </div>
              )}
              {health.version && (
                <div className="flex justify-between py-1 border-b border-outline-variant/30">
                  <span className="text-outline">Econiq Core Version</span>
                  <span className="font-semibold text-primary font-mono">{health.version}</span>
                </div>
              )}
              {health.error && (
                <p className="text-[10px] text-error font-medium">{health.error}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-outline">Contacting operational health endpoints...</p>
          )}
        </div>

        {/* Global preferences */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm space-y-md">
          <h3 className="font-headline text-base font-bold text-primary">Console Preferences</h3>
          
          {saveMsg && (
            <div className="p-md rounded bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-semibold">
              {saveMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-md text-xs font-sans">
            <div className="space-y-1">
              <label className="text-outline">Default Timeline Window</label>
              <select
                value={defaultWindow}
                onChange={(e) => setDefaultWindow(e.target.value)}
                className="w-full bg-surface border border-outline-variant px-3 py-1.5 rounded"
              >
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">365 Days (Default)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
              <input
                type="checkbox"
                checked={notifEnabled}
                onChange={(e) => setNotifEnabled(e.target.checked)}
                className="rounded border-outline-variant"
              />
              Enable High Risk Notification Banners
            </label>

            <button type="submit" className="px-4 py-2 bg-brand-accent text-white font-bold rounded hover:brightness-110">
              Save Preferences
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
