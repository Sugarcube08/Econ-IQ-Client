'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function OnboardingWizardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    currentStep,
    orgProfile,
    commercialConfig,
    dataReadiness,
    securitySetup,
    setStep,
    updateOrgProfile,
    updateCommercialConfig,
    updateDataReadiness,
    updateSecuritySetup,
    completeOnboarding,
  } = useOnboardingStore();

  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Simulation states for Step 3 (Data Readiness)
  const [isConnectingErp, setIsConnectingErp] = useState(false);
  const [isSyncingLedger, setIsSyncingLedger] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-xs text-outline">Initializing workspace...</p>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Profile' },
    { num: 2, label: 'Commercial' },
    { num: 3, label: 'Data Sync' },
    { num: 4, label: 'Security' },
    { num: 5, label: 'Review' },
  ];

  // Validation before changing steps
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!orgProfile.name.trim()) newErrors.name = 'Organization Name is required';
      if (!orgProfile.industry) newErrors.industry = 'Industry classification is required';
      if (!orgProfile.businessType) newErrors.businessType = 'Business Type is required';
      if (!orgProfile.country.trim()) newErrors.country = 'Country is required';
      if (!orgProfile.state.trim()) newErrors.state = 'State is required';
      if (!orgProfile.primaryContact.trim()) newErrors.primaryContact = 'Primary Contact is required';
      if (!orgProfile.companySize) newErrors.companySize = 'Company Size is required';
    } else if (currentStep === 4) {
      if (!securitySetup.adminContact.trim()) {
        newErrors.adminContact = 'Admin Contact Email is required';
      } else if (!/\S+@\S+\.\S+/.test(securitySetup.adminContact)) {
        newErrors.adminContact = 'Invalid corporate email format';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  // Simulating connection actions for data readiness
  const handleConnectErp = async () => {
    setIsConnectingErp(true);
    updateDataReadiness({ erp: 'pending', sync: 'pending' });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateDataReadiness({ erp: 'connected', sync: 'connected' });
    setIsConnectingErp(false);
  };

  const handleUploadLedger = async () => {
    setIsSyncingLedger(true);
    updateDataReadiness({ ledger: 'pending', customer: 'pending' });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateDataReadiness({ ledger: 'connected', customer: 'connected' });
    setIsSyncingLedger(false);
  };

  const handleFinalSubmit = () => {
    completeOnboarding();
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-[640px] bg-white border border-outline-variant rounded-xl shadow-md p-8 md:p-10 space-y-8 animate-fade-in text-secondary">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-sans font-semibold text-outline uppercase tracking-wider">
          <span>Setup Progress</span>
          <span>Step {currentStep} of 5</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-outline-variant rounded-full overflow-hidden">
          <div
            className="bg-brand-accent h-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>

        {/* Steps Indicators */}
        <div className="flex justify-between gap-1 pt-2">
          {stepsList.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1 flex-1">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono border transition-all ${
                  currentStep === s.num
                    ? 'bg-brand-accent text-white border-brand-accent'
                    : currentStep > s.num
                    ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30'
                    : 'bg-background text-outline border-outline-variant'
                }`}
              >
                {s.num}
              </span>
              <span className={`text-[9px] uppercase font-bold tracking-wider hidden sm:inline ${
                currentStep === s.num ? 'text-brand-accent' : 'text-outline'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-outline-variant/60" />

      {/* STEP 1: ORGANIZATION PROFILE */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="space-y-1">
            <h2 className="font-headline text-lg font-bold text-secondary">Organization Profile</h2>
            <p className="text-xs text-outline">Establish your primary corporate record details.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-outline uppercase tracking-wider block">Organization Name</label>
              <input
                type="text"
                value={orgProfile.name}
                onChange={(e) => updateOrgProfile({ name: e.target.value })}
                className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                placeholder="E.g., Standard Steel Castings Ltd."
              />
              {errors.name && <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Industry</label>
                <select
                  value={orgProfile.industry}
                  onChange={(e) => updateOrgProfile({ industry: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                >
                  <option value="">Select Industry...</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="distribution">Distribution</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="trading">Trading</option>
                  <option value="fmcg">FMCG</option>
                  <option value="industrial_supply">Industrial Supply</option>
                  <option value="other">Other B2B Operations</option>
                </select>
                {errors.industry && <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.industry}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Business Type</label>
                <select
                  value={orgProfile.businessType}
                  onChange={(e) => updateOrgProfile({ businessType: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                >
                  <option value="">Select Type...</option>
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                </select>
                {errors.businessType && <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.businessType}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Country</label>
                <input
                  type="text"
                  value={orgProfile.country}
                  onChange={(e) => updateOrgProfile({ country: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                  placeholder="E.g., India"
                />
                {errors.country && <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.country}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">State / Region</label>
                <input
                  type="text"
                  value={orgProfile.state}
                  onChange={(e) => updateOrgProfile({ state: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                  placeholder="E.g., Punjab"
                />
                {errors.state && <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Primary Contact Person</label>
                <input
                  type="text"
                  value={orgProfile.primaryContact}
                  onChange={(e) => updateOrgProfile({ primaryContact: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                  placeholder="E.g., Arjan Vohra"
                />
                {errors.primaryContact && <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.primaryContact}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Company Size</label>
                <select
                  value={orgProfile.companySize}
                  onChange={(e) => updateOrgProfile({ companySize: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                >
                  <option value="">Select Size...</option>
                  <option value="1-50">1-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1,000 employees</option>
                  <option value="1000+">1,000+ employees</option>
                </select>
                {errors.companySize && <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.companySize}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: COMMERCIAL CONFIGURATION */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="space-y-1">
            <h2 className="font-headline text-lg font-bold text-secondary">Commercial Configuration</h2>
            <p className="text-xs text-outline">Establish analysis windows and transaction currencies.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Default Analysis Window</label>
                <select
                  value={commercialConfig.windowDays}
                  onChange={(e) => updateCommercialConfig({ windowDays: parseInt(e.target.value) })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                >
                  <option value="90">90 Days (Quarterly Pulse)</option>
                  <option value="180">180 Days (Half-Year Trends)</option>
                  <option value="365">365 Days (Longitudinal Year)</option>
                  <option value="730">730 Days (Dual-Year Multi-ledger)</option>
                </select>
                <p className="text-[10px] text-outline">Defines historical context length for payment score metrics.</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Platform Currency</label>
                <select
                  value={commercialConfig.currency}
                  onChange={(e) => updateCommercialConfig({ currency: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
                <p className="text-[10px] text-outline">Nominal values will be displayed in this currency designation.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Reporting Frequency</label>
                <select
                  value={commercialConfig.reportingPref}
                  onChange={(e) => updateCommercialConfig({ reportingPref: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                >
                  <option value="standard">Standard (Monthly Digests)</option>
                  <option value="detailed">Detailed (Weekly Active Logs)</option>
                  <option value="executive">Executive (Real-time triggers only)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-outline uppercase tracking-wider block">Operational Calendar</label>
                <select
                  value={commercialConfig.calendar}
                  onChange={(e) => updateCommercialConfig({ calendar: e.target.value })}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                >
                  <option value="gregorian">Gregorian (Jan-Dec)</option>
                  <option value="fiscal_april">Fiscal Year (April-March)</option>
                  <option value="fiscal_july">Fiscal Year (July-June)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: DATA READINESS */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="space-y-1">
            <h2 className="font-headline text-lg font-bold text-secondary">Data Connectivity</h2>
            <p className="text-xs text-outline">Establish data streams to compile continuous analytics.</p>
          </div>

          <div className="space-y-4">
            <div className="border border-outline-variant rounded-lg overflow-hidden divide-y divide-outline-variant">
              {/* Data Ingestion Row 1 */}
              <div className="p-4 flex items-center justify-between bg-background/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">account_balance</span>
                    <strong className="text-xs">ERP Database Link</strong>
                  </div>
                  <p className="text-[10px] text-outline">SAP, NetSuite, or Dynamics secure database integration</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                    dataReadiness.erp === 'connected'
                      ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent'
                      : dataReadiness.erp === 'pending'
                      ? 'bg-brand-gold/10 border-brand-gold/30 text-[#c8a96b] animate-pulse'
                      : 'bg-outline-variant/20 border-outline-variant text-outline'
                  }`}>
                    {dataReadiness.erp === 'connected' ? 'Connected' : dataReadiness.erp === 'pending' ? 'Pending' : 'Not Configured'}
                  </span>
                  {dataReadiness.erp === 'none' && (
                    <button
                      onClick={handleConnectErp}
                      disabled={isConnectingErp}
                      className="px-3 py-1 bg-brand-accent text-white text-[10px] font-bold uppercase rounded hover:brightness-110 disabled:opacity-50 cursor-pointer"
                    >
                      {isConnectingErp ? 'Linking...' : 'Link ERP'}
                    </button>
                  )}
                </div>
              </div>

              {/* Data Ingestion Row 2 */}
              <div className="p-4 flex items-center justify-between bg-background/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">sync</span>
                    <strong className="text-xs">Data Sync Scheduler</strong>
                  </div>
                  <p className="text-[10px] text-outline">Hourly sync schedule for transaction records</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                  dataReadiness.sync === 'connected'
                    ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent'
                    : dataReadiness.sync === 'pending'
                    ? 'bg-brand-gold/10 border-brand-gold/30 text-[#c8a96b]'
                    : 'bg-outline-variant/20 border-outline-variant text-outline'
                }`}>
                  {dataReadiness.sync === 'connected' ? 'Connected' : dataReadiness.sync === 'pending' ? 'Pending' : 'Not Configured'}
                </span>
              </div>

              {/* Data Ingestion Row 3 */}
              <div className="p-4 flex items-center justify-between bg-background/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">receipt_long</span>
                    <strong className="text-xs">Ledger File Uploader</strong>
                  </div>
                  <p className="text-[10px] text-outline">Synchronize historical invoice registers (CSV/Excel)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                    dataReadiness.ledger === 'connected'
                      ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent'
                      : dataReadiness.ledger === 'pending'
                      ? 'bg-brand-gold/10 border-brand-gold/30 text-[#c8a96b] animate-pulse'
                      : 'bg-outline-variant/20 border-outline-variant text-outline'
                  }`}>
                    {dataReadiness.ledger === 'connected' ? 'Loaded' : dataReadiness.ledger === 'pending' ? 'Uploading' : 'Not Configured'}
                  </span>
                  {dataReadiness.ledger === 'none' && (
                    <button
                      onClick={handleUploadLedger}
                      disabled={isSyncingLedger}
                      className="px-3 py-1 bg-brand-accent text-white text-[10px] font-bold uppercase rounded hover:brightness-110 disabled:opacity-50 cursor-pointer"
                    >
                      {isSyncingLedger ? 'Processing...' : 'Upload ledger'}
                    </button>
                  )}
                </div>
              </div>

              {/* Data Ingestion Row 4 */}
              <div className="p-4 flex items-center justify-between bg-background/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">contacts</span>
                    <strong className="text-xs">Customer Master Records</strong>
                  </div>
                  <p className="text-[10px] text-outline">Customer account lists and address directory</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                  dataReadiness.customer === 'connected'
                    ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent'
                    : dataReadiness.customer === 'pending'
                    ? 'bg-brand-gold/10 border-brand-gold/30 text-[#c8a96b]'
                    : 'bg-outline-variant/20 border-outline-variant text-outline'
                }`}>
                  {dataReadiness.customer === 'connected' ? 'Loaded' : dataReadiness.customer === 'pending' ? 'Pending' : 'Not Configured'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-brand-accent/5 rounded border border-brand-accent/20 text-[10px] leading-relaxed text-[#0f766e]">
              <span className="font-bold">Tip:</span> If you do not have an active database link or ledger file ready, you can skip this step today. Econ-IQ will initialize with standard operational mock records so you can discover the platform interfaces immediately.
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SECURITY SETUP */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="space-y-1">
            <h2 className="font-headline text-lg font-bold text-secondary">Security Configuration</h2>
            <p className="text-xs text-outline">Establish identity domains and provisioning parameters.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-outline uppercase tracking-wider block">Admin Security Contact Email</label>
              <input
                type="email"
                value={securitySetup.adminContact || user?.email || ''}
                onChange={(e) => updateSecuritySetup({ adminContact: e.target.value })}
                className="w-full bg-background border border-outline-variant rounded p-3 text-sm focus:outline-none focus:border-brand-accent text-secondary"
                placeholder="E.g., admin@company.com"
              />
              {errors.adminContact && <p className="text-[#ba1a1a] text-[10px] mt-1">{errors.adminContact}</p>}
              <p className="text-[10px] text-outline">All key rotations, access suspensions, and compliance logs will copy to this address.</p>
            </div>

            <div className="p-4 bg-background rounded border border-outline-variant space-y-4">
              <span className="font-bold text-secondary uppercase tracking-wider block">Pre-Provisioned Access Scopes</span>
              
              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-0.5 accent-brand-accent"
                  />
                  <div>
                    <strong className="text-secondary">Super Admin Role</strong>
                    <p className="text-[10px] text-outline mt-0.5">Full access to billing, user invitations, and developer keys.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-0.5 accent-brand-accent"
                  />
                  <div>
                    <strong className="text-secondary">Risk Analyst Role</strong>
                    <p className="text-[10px] text-outline mt-0.5">Read-only ledger analytics access with report exporting capability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded border border-outline-variant">
              <div className="space-y-0.5">
                <strong className="text-secondary text-xs">Developer API Key Access</strong>
                <p className="text-[10px] text-outline">Enable REST endpoints to support auto-checkout scoring</p>
              </div>
              <input
                type="checkbox"
                checked={securitySetup.apiAccess}
                onChange={(e) => updateSecuritySetup({ apiAccess: e.target.checked })}
                className="w-10 h-6 rounded-full accent-brand-accent cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW CONFIGURATION */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="space-y-1">
            <h2 className="font-headline text-lg font-bold text-secondary">Review Configuration</h2>
            <p className="text-xs text-outline">Confirm setup profile parameters before workspace launch.</p>
          </div>

          <div className="space-y-4 border border-outline-variant rounded-xl overflow-hidden font-sans text-xs">
            {/* Header banner */}
            <div className="bg-secondary text-white p-4 flex justify-between items-center">
              <div>
                <strong className="block text-sm">{orgProfile.name || 'Unnamed Organization'}</strong>
                <span className="text-[9px] uppercase tracking-wider text-[#9EADB3]">
                  {orgProfile.industry || 'Pending industry'} • {orgProfile.businessType || 'Pending type'}
                </span>
              </div>
              <span className="text-[10px] bg-brand-accent text-white px-2 py-0.5 rounded font-mono font-bold">READY</span>
            </div>

            {/* Config summary details */}
            <div className="p-6 divide-y divide-outline-variant/60 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-2">
                <div>
                  <span className="text-[9px] text-outline uppercase block font-bold">Primary Contact</span>
                  <span className="font-semibold">{orgProfile.primaryContact || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-outline uppercase block font-bold">HQ Region</span>
                  <span className="font-semibold">{orgProfile.state}, {orgProfile.country}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 pb-2">
                <div>
                  <span className="text-[9px] text-outline uppercase block font-bold">Analysis Window</span>
                  <span className="font-semibold">{commercialConfig.windowDays} Days</span>
                </div>
                <div>
                  <span className="text-[9px] text-outline uppercase block font-bold">Currency</span>
                  <span className="font-semibold">{commercialConfig.currency}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 pb-2">
                <div>
                  <span className="text-[9px] text-outline uppercase block font-bold">ERP Connection</span>
                  <span className={`font-bold ${dataReadiness.erp === 'connected' ? 'text-brand-accent' : 'text-outline'}`}>
                    {dataReadiness.erp === 'connected' ? 'Active SAP/Oracle Link' : 'Not Connected (Simulation active)'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-outline uppercase block font-bold">API Access</span>
                  <span className="font-semibold">{securitySetup.apiAccess ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>

              <div className="pt-4 font-mono text-[9px] text-outline text-center">
                Completing setup initializes your secure database tenant under keyset authority.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/60">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-5 py-2.5 border border-outline-variant text-xs font-semibold uppercase tracking-wider rounded hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white text-secondary"
        >
          Back
        </button>

        {currentStep === 5 ? (
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-2.5 bg-brand-accent text-white text-xs font-bold uppercase tracking-wider rounded hover:brightness-110 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
          >
            Activate Platform & Ingest Ledgers
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-brand-accent text-white text-xs font-bold uppercase tracking-wider rounded hover:brightness-110 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
