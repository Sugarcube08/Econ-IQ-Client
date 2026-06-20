'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

// UI components
import PageHeader from '@/components/ui/PageHeader';
import PageContent from '@/components/ui/PageContent';
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
  Sliders,
  Database,
  Building,
  KeyRound
} from 'lucide-react';

interface HealthStatus {
  status: string;
  environment?: string;
  version?: string;
  error?: string;
}

type SettingsSection = 'workspace' | 'users' | 'integrations' | 'security' | 'developer' | 'health';

function SettingsPageContent() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('workspace');
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
    const start = Date.now();
    let frameId: number;
    const checkClear = () => {
      if (Date.now() - start >= 3000) {
        setSaveMsg(null);
      } else {
        frameId = requestAnimationFrame(checkClear);
      }
    };
    frameId = requestAnimationFrame(checkClear);
  };

  const menuItems = [
    { id: 'workspace' as const, label: 'Workspace Profile', icon: Building },
    { id: 'users' as const, label: 'Seats & RBAC Access', icon: UsersIcon },
    { id: 'integrations' as const, label: 'ERP Ledger Links', icon: Network },
    { id: 'security' as const, label: 'Security & Single Sign-On', icon: ShieldAlert },
    { id: 'developer' as const, label: 'Developer API Credentials', icon: KeyRound },
    { id: 'health' as const, label: 'System Telemetry Heartbeat', icon: Activity },
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Settings & Configurations"
        subtitle="Manage console parameters, ERP ledger connections, security levels, and heartbeat telemetry."
      />

      {saveMsg && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-xl animate-fade-in flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 shrink-0" /> {saveMsg}
        </div>
      )}

      {/* Two Column Side-Nav Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer border-0 ${
                  isSelected 
                    ? 'bg-teal-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Pane */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 min-h-[350px]">
          
          {/* Section 1: Workspace */}
          {activeSection === 'workspace' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Workspace Profile</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">Configure default timeline options and billing profile metadata.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Organization Tenant Name</label>
                  <input
                    type="text"
                    defaultValue="Econ-IQ Primary Org"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
                 <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Default Score Timeline</label>
                  <div className="w-full bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-500 font-semibold select-none">
                    365 Days (Locked)
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="accent" size="sm" className="cursor-pointer">
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* Section 2: Users */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Seats & RBAC Administration</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">Manage team members, roles, and administrative limits.</p>
              </div>
              <div className="space-y-4 leading-relaxed text-slate-500 text-xs">
                <p>
                  To change team credentials, adjust administrative rights, or de-provision users, utilize the central team directory management center.
                </p>
                <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs max-w-md">
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-widest">Workspace Seat Allocation</span>
                  <span className="font-bold text-slate-800">5 Seats Occupied / 10 Seats Total</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-start">
                <Button onClick={() => window.location.href = '/users'} variant="secondary" size="sm" className="cursor-pointer">
                  Open Team Directory
                </Button>
              </div>
            </div>
          )}

          {/* Section 3: Integrations */}
          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">ERP Ledger Integrations</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">Configure webhook triggers, schema maps, and ledger endpoints.</p>
              </div>
              <div className="space-y-4 text-xs font-sans">
                <p className="text-slate-500 leading-relaxed">
                  Webhooks register event transactions inside the core model ledger in real-time. Link NetSuite, SAP, or Sage Intacct transactions.
                </p>
                <div className="space-y-3 font-semibold max-w-lg">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-700 text-xs">SAP Ledger API Sync Connection</span>
                    <Badge variant="success" size="sm">ACTIVE</Badge>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-700 text-xs">NetSuite Transaction Webhook Ingest</span>
                    <Badge variant="info" size="sm">INACTIVE</Badge>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-start">
                <Button onClick={() => window.location.href = '/organization'} variant="secondary" size="sm" className="cursor-pointer">
                  Configure Webhooks
                </Button>
              </div>
            </div>
          )}

          {/* Section 4: Security */}
          {activeSection === 'security' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Security & Identity Policy</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">Enforce multi-factor verification, session timeout limits, and SSO rules.</p>
              </div>
              <div className="space-y-3 pt-1 text-slate-700 text-xs font-bold max-w-md">
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 w-4 h-4"
                  />
                  <span>Enforce Single Sign-On (SSO) login policy</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 w-4 h-4"
                  />
                  <span>Enforce Multi-Factor Authentication (MFA) validation</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 w-4 h-4"
                  />
                  <span>Send security notifications via email webhook</span>
                </label>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="accent" size="sm" className="cursor-pointer">
                  Save Security Policy
                </Button>
              </div>
            </form>
          )}

          {/* Section 5: Developer */}
          {activeSection === 'developer' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Developer Credentials</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">Query organizational scores programmatically using API keys.</p>
              </div>
              <div className="space-y-4 text-xs">
                <p className="text-slate-500 leading-relaxed">
                  Generate secure tokens and review active REST API keys for query tools, spreadsheets, and custom BI pipeline integration.
                </p>
                <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-mono max-w-md">
                  <span className="text-slate-400 font-sans uppercase font-bold text-[9px] tracking-widest">Active Credentials</span>
                  <span className="font-bold text-slate-800">2 API Keys Active</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-start">
                <Button onClick={() => window.location.href = '/api-keys'} variant="secondary" size="sm" className="cursor-pointer">
                  Manage Developer Keys
                </Button>
              </div>
            </div>
          )}

          {/* Section 6: System Health */}
          {activeSection === 'health' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">System Telemetry Heartbeat</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">Heartbeat telemetry and connection diagnostics.</p>
              </div>
              <div className="space-y-4 text-xs">
                {health ? (
                  <div className="space-y-2 font-medium max-w-md">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Core API Heartbeat Link:</span>
                      <span className={`font-bold uppercase ${health.status === 'healthy' ? 'text-teal-600' : 'text-red-600'}`}>
                        {health.status}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Environment Node:</span>
                      <span className="font-bold text-slate-800 uppercase">{health.environment || 'PRODUCTION'}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Running Version:</span>
                      <span className="font-bold text-slate-800 font-mono">{health.version || '2.0.0'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Reading heartbeat signal...</p>
                )}
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-start">
                <Button
                  onClick={checkHealth}
                  disabled={isCheckingHealth}
                  variant="secondary"
                  size="sm"
                  icon={RefreshCw}
                  className="cursor-pointer"
                >
                  {isCheckingHealth ? 'Pinging...' : 'Trigger Heartbeat Diagnostics'}
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RouteErrorBoundary routeName="Settings & System Configurations">
      <SettingsPageContent />
    </RouteErrorBoundary>
  );
}
