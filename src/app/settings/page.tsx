'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageContent from '@/components/ui/PageContent';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

import {
  Settings,
  Users as UsersIcon,
  Network,
  ShieldAlert,
  Key,
  Activity,
  Check,
  RefreshCw,
  Server,
  Lock,
  Globe,
  Sliders
} from 'lucide-react';

interface HealthStatus {
  status: string;
  environment?: string;
  version?: string;
  error?: string;
}

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
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
    checkHealth();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg('Preferences updated successfully.');
    setTimeout(() => setSaveMsg(null), 3000);
  };

  return (
    <PageContent className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Settings & System Configurations"
        subtitle="Manage console parameters, user lists, API connections, and heartbeat telemetry."
      />

      {saveMsg && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-xl animate-fade-in flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 shrink-0" /> {saveMsg}
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {/* Category 1: Workspace */}
        <Card className="hover:shadow-md transition-shadow border-slate-200 bg-white">
          <CardHeader
            title="Workspace"
            subtitle="Tenant profiles & billing defaults"
            action={<Settings className="w-4 h-4 text-slate-400" />}
          />
          <CardContent className="space-y-4 pt-1 text-slate-600 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Workspace Name</label>
              <input
                type="text"
                defaultValue="Econ-IQ Primary Org"
                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Default Timeline Window</label>
              <select
                value={defaultWindow}
                onChange={(e) => setDefaultWindow(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20"
              >
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">365 Days (Default)</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-3">
            <Button onClick={handleSave} variant="accent" size="sm">
              Save Workspace
            </Button>
          </CardFooter>
        </Card>

        {/* Category 2: Users */}
        <Card className="hover:shadow-md transition-shadow border-slate-200 bg-white">
          <CardHeader
            title="Users & Access"
            subtitle="Control analyst roles & permissions"
            action={<UsersIcon className="w-4 h-4 text-slate-400" />}
          />
          <CardContent className="space-y-3 pt-1 text-slate-500 text-xs leading-relaxed">
            <p>
              Manage system permissions, invite credit analysts, and configure Role-Based Access Control (RBAC) levels for security compliance.
            </p>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs">
              <span className="text-slate-400 uppercase font-bold text-[9px] tracking-widest">Active seats:</span>
              <span className="font-bold text-slate-800">5 Occupied</span>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-3">
            <Button onClick={() => window.location.href = '/users'} variant="secondary" size="sm">
              Manage Directory
            </Button>
          </CardFooter>
        </Card>

        {/* Category 3: Integrations */}
        <Card className="hover:shadow-md transition-shadow border-slate-200 bg-white">
          <CardHeader
            title="Integrations"
            subtitle="Ledger sync & ERP feeds"
            action={<Network className="w-4 h-4 text-slate-400" />}
          />
          <CardContent className="space-y-4 pt-1 text-slate-500 text-xs">
            <p className="leading-relaxed">
              Configure webhook endpoints and ledger connections to sync NetSuite, SAP, or Sage Intacct transactions.
            </p>
            <div className="space-y-2 font-medium">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700">SAP Ledger API Sync</span>
                <Badge variant="success" size="sm">CONNECTED</Badge>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700">NetSuite Webhook Ingest</span>
                <Badge variant="info" size="sm">INACTIVE</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-3">
            <Button onClick={() => window.location.href = '/organization'} variant="secondary" size="sm">
              Configure ERP Links
            </Button>
          </CardFooter>
        </Card>

        {/* Category 4: Security */}
        <Card className="hover:shadow-md transition-shadow border-slate-200 bg-white">
          <CardHeader
            title="Security"
            subtitle="MFA & single sign-on parameters"
            action={<ShieldAlert className="w-4 h-4 text-slate-400" />}
          />
          <CardContent className="space-y-3 pt-1 text-slate-700 text-xs font-semibold">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 w-4 h-4"
              />
              <span>Enforce Single Sign-On (SSO)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 w-4 h-4"
              />
              <span>Enforce Multi-Factor (MFA)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={false}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 w-4 h-4"
              />
              <span>Audit logs export webhook</span>
            </label>
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-3">
            <Button onClick={handleSave} variant="accent" size="sm">
              Save Security
            </Button>
          </CardFooter>
        </Card>

        {/* Category 5: Developer */}
        <Card className="hover:shadow-md transition-shadow border-slate-200 bg-white">
          <CardHeader
            title="Developer"
            subtitle="API tokens & webhook keys"
            action={<Key className="w-4 h-4 text-slate-400" />}
          />
          <CardContent className="space-y-3 pt-1 text-slate-500 text-xs leading-relaxed">
            <p>
              Generate token identifiers, access keys, and secure endpoints to query Econiq commercial scores programmatically.
            </p>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs font-mono">
              <span className="text-slate-400 font-sans uppercase font-bold text-[9px] tracking-widest">Active Keys:</span>
              <span className="font-bold text-slate-800">2 API Keys</span>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-3">
            <Button onClick={() => window.location.href = '/api-keys'} variant="secondary" size="sm">
              Manage API Keys
            </Button>
          </CardFooter>
        </Card>

        {/* Category 6: System */}
        <Card className="hover:shadow-md transition-shadow border-slate-200 bg-white">
          <CardHeader
            title="System Heartbeat"
            subtitle="API logs & telemetry stats"
            action={<Activity className="w-4 h-4 text-slate-400" />}
          />
          <CardContent className="space-y-3 pt-1 text-slate-500 text-xs">
            {health ? (
              <div className="space-y-2 font-medium">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Core Link:</span>
                  <span className={`font-bold uppercase ${health.status === 'healthy' ? 'text-teal-600' : 'text-red-600'}`}>
                    {health.status}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Environment:</span>
                  <span className="font-bold text-slate-800 uppercase">{health.environment || 'PRODUCTION'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Version:</span>
                  <span className="font-bold text-slate-800 font-mono">{health.version || '2.0.0'}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Querying core health status...</p>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-3">
            <Button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              variant="secondary"
              size="sm"
              icon={RefreshCw}
            >
              {isCheckingHealth ? 'Checking...' : 'Heartbeat Recheck'}
            </Button>
          </CardFooter>
        </Card>

      </div>
    </PageContent>
  );
}
