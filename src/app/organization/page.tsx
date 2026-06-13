'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

type SettingsTab = 'general' | 'commercial' | 'users' | 'security' | 'integrations';

export default function OrganizationSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    orgProfile,
    commercialConfig,
    dataReadiness,
    securitySetup,
    updateOrgProfile,
    updateCommercialConfig,
    updateSecuritySetup,
    updateDataReadiness,
    resetOnboarding
  } = useOnboardingStore();

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'general', label: 'General Info', icon: 'corporate_fare' },
    { id: 'commercial', label: 'Commercial Parameters', icon: 'payments' },
    { id: 'users', label: 'User Directory', icon: 'person' },
    { id: 'security', label: 'Security & Access', icon: 'security' },
    { id: 'integrations', label: 'ERP Integrations', icon: 'database' },
  ];

  return (
    <div className="space-y-xl text-[#243447] font-sans">
      <div>
        <h2 className="font-headline text-3xl font-semibold text-primary">Organization Settings</h2>
        <p className="text-sm text-outline mt-1">
          Manage workspace settings, commercial preferences, team access scopes, and database connections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Tab Selector Left Column */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-4 rounded-lg text-left border flex items-center gap-3 transition-all cursor-pointer border-0 bg-transparent ${
                  isActive
                    ? 'bg-white border-[#0F766E] text-[#0F766E] font-bold shadow-sm'
                    : 'text-[#5E6266] hover:bg-white/40 hover:text-[#243447]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#0F766E]' : 'text-outline'}`}>
                  {tab.icon}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Pane Right Column */}
        <div className="lg:col-span-9 bg-white border border-[#E3E2DF] rounded-xl p-6 md:p-8 shadow-sm min-h-[440px] flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* 1. GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in text-xs">
                <div className="space-y-1 border-b border-[#E3E2DF]/60 pb-3">
                  <h3 className="font-headline text-base font-bold text-primary">General Information</h3>
                  <p className="text-outline">Configure corporate profile data and regional HQ references.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="font-bold text-[#5E6266] uppercase block">Organization Name</label>
                    <input
                      type="text"
                      value={orgProfile.name}
                      onChange={(e) => updateOrgProfile({ name: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">HQ Country</label>
                    <input
                      type="text"
                      value={orgProfile.country}
                      onChange={(e) => updateOrgProfile({ country: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">HQ State / Region</label>
                    <input
                      type="text"
                      value={orgProfile.state}
                      onChange={(e) => updateOrgProfile({ state: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">Primary Contact</label>
                    <input
                      type="text"
                      value={orgProfile.primaryContact}
                      onChange={(e) => updateOrgProfile({ primaryContact: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">Company Size</label>
                    <select
                      value={orgProfile.companySize}
                      onChange={(e) => updateOrgProfile({ companySize: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none"
                    >
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1,000 employees</option>
                      <option value="1000+">1,000+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. COMMERCIAL TAB */}
            {activeTab === 'commercial' && (
              <div className="space-y-6 animate-fade-in text-xs">
                <div className="space-y-1 border-b border-[#E3E2DF]/60 pb-3">
                  <h3 className="font-headline text-base font-bold text-primary">Commercial Parameters</h3>
                  <p className="text-outline">Set terms analysis spans, system currency, and reporting scopes.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">Default Analysis Window</label>
                    <select
                      value={commercialConfig.windowDays}
                      onChange={(e) => updateCommercialConfig({ windowDays: parseInt(e.target.value) })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none"
                    >
                      <option value="90">90 Days (Quarterly Pulse)</option>
                      <option value="180">180 Days (Half-Year)</option>
                      <option value="365">365 Days (Longitudinal Year)</option>
                      <option value="730">730 Days (Dual-Year)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">System Currency</label>
                    <select
                      value={commercialConfig.currency}
                      onChange={(e) => updateCommercialConfig({ currency: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">Reporting Prefs</label>
                    <select
                      value={commercialConfig.reportingPref}
                      onChange={(e) => updateCommercialConfig({ reportingPref: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none"
                    >
                      <option value="standard">Standard digests</option>
                      <option value="detailed">Detailed logs</option>
                      <option value="executive">Executive notifications only</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">Operational Calendar</label>
                    <select
                      value={commercialConfig.calendar}
                      onChange={(e) => updateCommercialConfig({ calendar: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none"
                    >
                      <option value="gregorian">Gregorian (Jan-Dec)</option>
                      <option value="fiscal_april">Fiscal Year (April-March)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. USERS TAB */}
            {activeTab === 'users' && (
              <div className="space-y-6 animate-fade-in text-xs">
                <div className="space-y-1 border-b border-[#E3E2DF]/60 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-headline text-base font-bold text-primary">User Directory</h3>
                    <p className="text-outline">Invite colleagues and control authority levels.</p>
                  </div>
                  <Link
                    href="/organization/users/invite"
                    className="px-3 py-1.5 bg-[#0F766E] text-white text-[10px] font-bold uppercase rounded hover:brightness-110"
                  >
                    Invite User
                  </Link>
                </div>

                <div className="divide-y divide-[#E3E2DF]/40">
                  <div className="py-3 flex justify-between items-center">
                    <div>
                      <strong className="block font-bold">Primary Administrator (You)</strong>
                      <span className="text-[10px] text-outline">admin@standardsteel.com</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border bg-brand-accent/10 border-brand-accent/30 text-brand-accent">
                      SUPER ADMIN
                    </span>
                  </div>
                  <div className="py-3 flex justify-between items-center text-outline">
                    <div>
                      <strong className="block font-bold">Credit Risk Ops</strong>
                      <span className="text-[10px] text-outline">creditoops@standardsteel.com</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border bg-brand-gold/10 border-brand-gold/30 text-[#c8a96b]">
                      MANAGER (PENDING)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in text-xs">
                <div className="space-y-1 border-b border-[#E3E2DF]/60 pb-3">
                  <h3 className="font-headline text-base font-bold text-primary">Security & Access Controls</h3>
                  <p className="text-outline">Configure audit logs and rotations.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#5E6266] uppercase block">Admin Contact Email</label>
                    <input
                      type="email"
                      value={securitySetup.adminContact || 'admin@standardsteel.com'}
                      onChange={(e) => updateSecuritySetup({ adminContact: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none focus:border-[#0F766E]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#FAF9F6] border border-[#E3E2DF] rounded">
                    <div>
                      <strong className="block">Developer Endpoints Access</strong>
                      <span className="text-[10px] text-outline">Exposes JSON payload feeds to customer databases.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySetup.apiAccess}
                      onChange={(e) => updateSecuritySetup({ apiAccess: e.target.checked })}
                      className="w-10 h-6 accent-[#0F766E] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. INTEGRATIONS TAB */}
            {activeTab === 'integrations' && (
              <div className="space-y-6 animate-fade-in text-xs">
                <div className="space-y-1 border-b border-[#E3E2DF]/60 pb-3">
                  <h3 className="font-headline text-base font-bold text-primary">ERP Ledger Connections</h3>
                  <p className="text-outline">Sync database connections and manual ledger registries.</p>
                </div>

                <div className="space-y-4 font-sans">
                  <div className="flex justify-between items-center p-4 bg-[#FAF9F6] border border-[#E3E2DF] rounded">
                    <div>
                      <strong className="block">ERP Database Link (SAP / Oracle)</strong>
                      <span className="text-[10px] text-outline">
                        Status: <strong className={dataReadiness.erp === 'connected' ? 'text-brand-accent' : 'text-outline'}>
                          {dataReadiness.erp === 'connected' ? 'Connected' : 'Not Connected'}
                        </strong>
                      </span>
                    </div>
                    {dataReadiness.erp !== 'connected' && (
                      <button
                        onClick={() => updateDataReadiness({ erp: 'connected', sync: 'connected' })}
                        className="px-3 py-1 bg-[#0F766E] text-white text-[10px] font-bold uppercase rounded hover:brightness-110"
                      >
                        Link Database
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center p-4 bg-[#FAF9F6] border border-[#E3E2DF] rounded">
                    <div>
                      <strong className="block">Historical Ledger CSV Uploader</strong>
                      <span className="text-[10px] text-outline">
                        Status: <strong className={dataReadiness.ledger === 'connected' ? 'text-brand-accent' : 'text-outline'}>
                          {dataReadiness.ledger === 'connected' ? 'Connected' : 'Not Connected'}
                        </strong>
                      </span>
                    </div>
                    {dataReadiness.ledger !== 'connected' && (
                      <button
                        onClick={() => updateDataReadiness({ ledger: 'connected', customer: 'connected' })}
                        className="px-3 py-1 bg-[#0F766E] text-white text-[10px] font-bold uppercase rounded hover:brightness-110"
                      >
                        Upload Ledger
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="flex justify-between items-center pt-6 border-t border-[#E3E2DF]/60">
            {/* Developer Reset tool */}
            <button
              onClick={() => {
                if (confirm('Reset entire organization onboarding data? This will return you to the setup wizard.')) {
                  resetOnboarding();
                  window.location.reload();
                }
              }}
              className="text-[10px] font-bold text-[#ba1a1a] uppercase hover:underline cursor-pointer border-0 bg-transparent"
            >
              Reset Setup Data
            </button>

            <div className="flex items-center gap-3">
              {saveSuccess && (
                <span className="text-[#0F766E] text-[10px] font-bold uppercase animate-fade-in flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">done</span>
                  Settings Saved
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#0F766E] text-white text-xs font-bold uppercase tracking-wider rounded hover:brightness-110 cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
