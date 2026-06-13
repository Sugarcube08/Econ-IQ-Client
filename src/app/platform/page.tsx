'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionHeader, CTASection } from '@/components/marketing/MarketingComponents';

export default function PlatformPage() {
  const [activeModule, setActiveModule] = useState<'dashboard' | 'intelligence' | 'analytics' | 'reporting' | 'api' | 'security'>('dashboard');

  const modules = [
    {
      id: 'dashboard',
      name: 'Executive Dashboard',
      icon: 'dashboard',
      tagline: 'High-level commercial intelligence telemetry',
      problem: 'CFOs and commercial executives lack a unified, real-time interface to monitor aggregate exposure, DSO cycles, and payment trends across multiple subsidiaries and ERP instances.',
      solution: 'An executive control center aggregating ledger activity, invoice registries, and cash flows into stateful, real-time longitudinal metrics.',
      outcome: 'Immediate visual audit verification of cash-in-transit, aging buckets, and cash flow predictability in a single corporate dashboard.',
      mock: (
        <div className="bg-white border border-[#E3E2DF] rounded-xl p-6 space-y-4 shadow-sm font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3E2DF]/60">
            <span className="text-xs font-bold text-[#243447] uppercase">Ledger Telemetry</span>
            <span className="text-[10px] text-[#0F766E] font-bold bg-[#0F766E]/10 px-2 py-0.5 rounded-full uppercase">Live Sync</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAF9F6] p-3 rounded border border-[#E3E2DF]/40">
              <span className="text-[10px] text-[#5E6266] uppercase block">DSO (Current)</span>
              <span className="text-lg font-black text-[#243447]">38.2 Days</span>
              <span className="text-[9px] text-[#0F766E] block mt-0.5 font-bold">-4.5d vs Last Month</span>
            </div>
            <div className="bg-[#FAF9F6] p-3 rounded border border-[#E3E2DF]/40">
              <span className="text-[10px] text-[#5E6266] uppercase block">Total Outstanding</span>
              <span className="text-lg font-black text-[#243447]">$12.4M</span>
              <span className="text-[9px] text-[#ba1a1a] block mt-0.5 font-bold">12% in High-Risk Buckets</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-[#5E6266] uppercase font-bold block">Cash Inflow Trend (12 Months)</span>
            <div className="h-16 flex items-end gap-1 pt-2">
              {[30, 45, 35, 60, 50, 75, 55, 80, 70, 95, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-[#0F766E]/20 rounded-t" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'intelligence',
      name: 'Customer Intelligence',
      icon: 'groups',
      tagline: 'Continuous credit behavior tracking matrix',
      problem: 'Credit assessments depend on static third-party reports that ignore live order behavior, payment frequencies, and historical invoice adjustments.',
      solution: 'A stateful account intelligence matrix that processes ledger entries continuously to rate payment and purchase habits.',
      outcome: 'A real-time, searchable matrix showing live customer trust scores, growth trends, and transaction history profiles.',
      mock: (
        <div className="bg-white border border-[#E3E2DF] rounded-xl p-6 space-y-4 shadow-sm font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3E2DF]/60">
            <span className="text-xs font-bold text-[#243447] uppercase">Account Profile</span>
            <span className="text-[10px] text-[#c8a96b] font-bold bg-[#c8a96b]/10 px-2 py-0.5 rounded-full uppercase">Monitor</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#243447]">Vohra-Dugal FMCG</span>
              <span className="font-mono text-[#5E6266]">ID: 381f54d5</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#FAF9F6] p-2 rounded text-center border border-[#E3E2DF]/40">
                <span className="text-[8px] text-[#5E6266] uppercase block">Trust Score</span>
                <span className="text-xs font-bold text-[#243447]">52%</span>
              </div>
              <div className="bg-[#FAF9F6] p-2 rounded text-center border border-[#E3E2DF]/40">
                <span className="text-[8px] text-[#5E6266] uppercase block">Payment Score</span>
                <span className="text-xs font-bold text-[#243447]">41%</span>
              </div>
              <div className="bg-[#FAF9F6] p-2 rounded text-center border border-[#E3E2DF]/40">
                <span className="text-[8px] text-[#5E6266] uppercase block">Growth Score</span>
                <span className="text-xs font-bold text-[#243447]">89%</span>
              </div>
            </div>
            <div className="p-3 bg-[#ba1a1a]/5 rounded border border-[#ba1a1a]/20 text-[10px] text-[#ba1a1a] leading-relaxed">
              <span className="font-bold">Liquidity Alert:</span> Purchase volume is up 40% but payment delays have increased from 12 to 28 days.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      name: 'Commercial Analytics',
      icon: 'analytics',
      tagline: 'Longitudinal behavior modeling engines',
      problem: 'Risk teams spend too much time calculating ratios manually in spreadsheets, missing early signs of declining customer accounts.',
      solution: 'Automated statistical modeling that benchmarks customer ledger histories against eight proprietary risk indicators.',
      outcome: 'Predictive analytics on cash collections, customer concentration risk, and next-best-action policy recommenders.',
      mock: (
        <div className="bg-white border border-[#E3E2DF] rounded-xl p-6 space-y-4 shadow-sm font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3E2DF]/60">
            <span className="text-xs font-bold text-[#243447] uppercase">Predictive Policy Engine</span>
            <span className="text-[10px] text-[#0F766E] font-bold bg-[#0F766E]/10 px-2 py-0.5 rounded-full uppercase">Calculated</span>
          </div>
          <div className="space-y-3">
            <div className="text-[10px] text-[#5E6266] uppercase font-bold">Policy Recommendation</div>
            <div className="p-3 bg-[#FAF9F6] rounded border border-[#E3E2DF] space-y-1">
              <div className="text-xs font-bold text-[#243447] uppercase">Adjust Payment Terms</div>
              <p className="text-[10px] text-[#5E6266] leading-relaxed">
                Tighten credit window from Net 60 to Net 45. Delinquency risk probability has increased by 18.2% based on latest payment schedules.
              </p>
            </div>
            <div className="flex justify-between text-[10px] text-[#5E6266]">
              <span>Confidence Level: <strong>94.2%</strong></span>
              <span>Applied to: <strong>14 Accounts</strong></span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reporting',
      name: 'Reports & Exporter',
      icon: 'summarize',
      tagline: 'Structured compliance-ready data extraction',
      problem: 'Exporting audit lists or risk summaries requires custom developer scripts or complex SQL queries across disparate ledgers.',
      solution: 'A compliance-ready reporting engine supporting state-filtered exports, PDF risk summaries, and CSV data queries.',
      outcome: 'Instant download of historical payment histories, exposure metrics, and risk buckets, complete with cryptographic audit trails.',
      mock: (
        <div className="bg-white border border-[#E3E2DF] rounded-xl p-6 space-y-4 shadow-sm font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3E2DF]/60">
            <span className="text-xs font-bold text-[#243447] uppercase">Report Console</span>
            <span className="material-symbols-outlined text-[#0F766E] text-[18px]">download</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] text-[#5E6266] uppercase block font-bold">Filter Dataset</label>
              <div className="text-xs bg-[#FAF9F6] border border-[#E3E2DF] p-2 rounded text-[#243447] font-mono">
                SELECT * FROM ledger WHERE risk_state = 'liquidity_stress'
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-[#0F766E] text-white text-[10px] font-bold uppercase rounded text-center">
                Export CSV
              </button>
              <button className="flex-1 py-1.5 border border-[#E3E2DF] text-[#243447] text-[10px] font-bold uppercase rounded text-center">
                Export PDF
              </button>
            </div>
            <div className="text-[9px] text-outline text-center">
              SHA-256 Checksum: <strong>f7b2c91a...</strong>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      name: 'API Platform',
      icon: 'code',
      tagline: 'Low-latency developer integrations',
      problem: 'Connecting commercial risk scoring models to active ERP systems, billing software, or internal CRMs is typically a major multi-month integration project.',
      solution: 'Low-latency REST APIs that expose stateful account scores, invoice statistics, and automated policy recommendations.',
      outcome: 'A developer console to provision secure API keys, monitor usage quotas, and retrieve JSON-structured account payloads.',
      mock: (
        <div className="bg-[#243447] rounded-xl p-6 space-y-4 shadow-sm font-mono text-[10px] text-[#C5D0D6]">
          <div className="flex justify-between items-center pb-2 border-b border-[#34485E]">
            <span className="text-[#80d5cb] font-bold uppercase">GET /api/v1/customers</span>
            <span className="text-white">200 OK</span>
          </div>
          <pre className="overflow-x-auto text-[9px] leading-relaxed">
{`{
  "customer_id": "381f54d5-92e5",
  "name": "Vohra-Dugal Corporation",
  "trust_score": 0.52,
  "metrics": {
    "outstanding_current": 124500.00,
    "current_state": "liquidity_stress"
  }
}`}
          </pre>
        </div>
      )
    },
    {
      id: 'security',
      name: 'Enterprise Security',
      icon: 'security',
      tagline: 'Audit trails and secure tenant environments',
      problem: 'Corporate transaction registries contain sensitive customer terms and margins. Storing this information on public clouds creates exposure to hacking or data leaks.',
      solution: 'Econ-IQ uses isolated database tenants, end-to-end data encryption, and hashed ledger verification signatures.',
      outcome: 'Full compliance with corporate security audits, multi-factor OTP login flows, and read-only database connections.',
      mock: (
        <div className="bg-white border border-[#E3E2DF] rounded-xl p-6 space-y-4 shadow-sm font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-[#E3E2DF]/60">
            <span className="text-xs font-bold text-[#243447] uppercase">Security Standard</span>
            <span className="text-[10px] text-[#0F766E] font-bold bg-[#0F766E]/10 px-2 py-0.5 rounded-full uppercase">Compliant</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-[#FAF9F6] rounded border border-[#E3E2DF]/40">
              <span>Data Encryption (AES-256)</span>
              <span className="material-symbols-outlined text-[#0F766E] text-[16px]">verified</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-[#FAF9F6] rounded border border-[#E3E2DF]/40">
              <span>Isolated Tenant DB</span>
              <span className="material-symbols-outlined text-[#0F766E] text-[16px]">verified</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-[#FAF9F6] rounded border border-[#E3E2DF]/40">
              <span>Audit Trail Logs</span>
              <span className="material-symbols-outlined text-[#0F766E] text-[16px]">verified</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-[#FAF9F6] text-[#243447]">
      {/* Header */}
      <SectionHeader
        tag="Platform Architecture"
        title="Active Commercial Intelligence"
        description="Econ-IQ replaces static ledger reports with automated, stateful risk metrics, analytics, and policy recommenders built directly on top of your current transaction records."
      />

      {/* Interactive Module Explorer */}
      <section className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Module List (Left Column) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-bold text-[#5E6266] uppercase tracking-wider block mb-2">Platform Modules</span>
          <div className="flex flex-col gap-2">
            {modules.map((m) => {
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id as any)}
                  className={`w-full p-4 rounded-lg text-left border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#0F766E] shadow-sm'
                      : 'bg-[#FAF9F6] border-transparent hover:bg-white/40 hover:border-[#E3E2DF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#0F766E] text-white' : 'bg-[#0F766E]/10 text-[#0F766E]'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-[#243447]' : 'text-[#5E6266]'}`}>
                        {m.name}
                      </h4>
                      <p className="text-[10px] text-[#5E6266] mt-0.5">{m.tagline}</p>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-[16px] text-outline transition-transform duration-300 ${
                    isActive ? 'translate-x-1 text-[#0F766E]' : ''
                  }`}>
                    chevron_right
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Module Explanation (Right Column) */}
        <div className="lg:col-span-7 space-y-8 bg-white border border-[#E3E2DF] rounded-xl p-8 shadow-sm min-h-[440px] flex flex-col justify-between">
          {modules.map((m) => {
            if (activeModule !== m.id) return null;
            return (
              <div key={m.id} className="space-y-8 animate-fade-in flex-grow flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-headline text-xl font-extrabold text-[#243447]">{m.name}</h3>
                    <p className="font-sans text-xs text-[#5E6266] mt-1">{m.tagline}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs border-y border-[#E3E2DF]/60 py-6">
                    <div className="space-y-1">
                      <strong className="text-[10px] text-[#ba1a1a] uppercase font-bold tracking-wider">The Problem</strong>
                      <p className="font-sans text-[#5E6266] leading-relaxed">{m.problem}</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-[10px] text-[#0F766E] uppercase font-bold tracking-wider">The Solution</strong>
                      <p className="font-sans text-[#5E6266] leading-relaxed">{m.solution}</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-[10px] text-[#243447] uppercase font-bold tracking-wider">The Outcome</strong>
                      <p className="font-sans text-[#243447] font-semibold leading-relaxed">{m.outcome}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-[#5E6266] uppercase font-bold tracking-wider block">Interface Preview</span>
                  {m.mock}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Integration timeline or details */}
      <section className="bg-white border border-[#E3E2DF] rounded-xl p-8 md:p-12 max-w-[1280px] mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h3 className="font-headline text-lg font-bold text-[#243447]">Active Ledger Verification Flow</h3>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            How Econ-IQ securely transforms raw transaction rows into actionable commercial insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-center">
          <div className="p-6 bg-[#FAF9F6] rounded border border-[#E3E2DF]/60 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold mx-auto font-mono">1</div>
            <strong className="font-headline text-[#243447] uppercase block tracking-wider text-[10px]">Ingestion</strong>
            <p className="font-sans text-[#5E6266] leading-relaxed">Secure REST APIs or ledger file CSV transfers load invoices.</p>
          </div>
          <div className="p-6 bg-[#FAF9F6] rounded border border-[#E3E2DF]/60 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold mx-auto font-mono">2</div>
            <strong className="font-headline text-[#243447] uppercase block tracking-wider text-[10px]">Normalization</strong>
            <p className="font-sans text-[#5E6266] leading-relaxed">Dates, balances, and customer details are unified and clean.</p>
          </div>
          <div className="p-6 bg-[#FAF9F6] rounded border border-[#E3E2DF]/60 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold mx-auto font-mono">3</div>
            <strong className="font-headline text-[#243447] uppercase block tracking-wider text-[10px]">Scoring</strong>
            <p className="font-sans text-[#5E6266] leading-relaxed">Statistical algorithms update continuous risk and trust profiles.</p>
          </div>
          <div className="p-6 bg-[#FAF9F6] rounded border border-[#E3E2DF]/60 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold mx-auto font-mono">4</div>
            <strong className="font-headline text-[#243447] uppercase block tracking-wider text-[10px]">Action</strong>
            <p className="font-sans text-[#5E6266] leading-relaxed">Predictive alerts recommend payment terms or credit adjustments.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to connect your ledger system?"
        subtitle="Provision developers keys immediately to test our REST API or request an onboarding session with our team."
        primaryText="Request Onboarding"
        primaryLink="/contact?type=demo"
        secondaryText="View API Documentation"
        secondaryLink="/resources"
      />
    </div>
  );
}
