'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'detail' | 'reports'>('dashboard');

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 lg:px-8 bg-gradient-to-b from-brand-accent/5 to-background">
        <div className="max-w-[1280px] mx-auto text-center space-y-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-brand-accent/10 text-brand-accent rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping"></span>
            Enterprise Commercial Intelligence
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-secondary tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Turn Ledger Records Into <span className="text-brand-accent">Commercial Certainty</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-outline max-w-2xl mx-auto leading-relaxed">
            Econ-IQ extracts cash flows, payment patterns, and credit risk models directly from transaction histories. Replace spreadsheets and ERP blind spots with active, stateful telemetry.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href="/contact?type=demo"
              className="w-full sm:w-auto px-8 py-3 bg-brand-accent text-white font-sans font-bold text-xs uppercase tracking-wider rounded hover:brightness-110 transition-all shadow-md text-center"
            >
              Request Live Demo
            </Link>
            <Link
              href="/platform"
              className="w-full sm:w-auto px-8 py-3 border border-outline-variant bg-white text-secondary font-sans font-bold text-xs uppercase tracking-wider rounded hover:bg-outline-variant/10 transition-all text-center"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Commercial Problems Section */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-secondary">
            The Five Blind Spots of Modern commerce
          </h2>
          <p className="text-xs text-outline uppercase tracking-wider font-semibold">
            Why traditional ERP reports and intuition fail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl border border-outline-variant space-y-4 shadow-sm hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[32px]">trending_down</span>
            <h3 className="font-headline text-sm font-bold text-secondary">Invisible Deterioration</h3>
            <p className="font-sans text-xs text-outline leading-relaxed">
              Customers shift payment habits gradually. By the time an analyst notices an invoice is 60 days past due, default risks have already escalated.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-outline-variant space-y-4 shadow-sm hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[32px]">warning</span>
            <h3 className="font-headline text-sm font-bold text-secondary">Customer Credit Risk</h3>
            <p className="font-sans text-xs text-outline leading-relaxed">
              Decisions based on outdated credit bureau scores ignore live order behavior and payment frequencies.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-outline-variant space-y-4 shadow-sm hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[32px]">account_balance_wallet</span>
            <h3 className="font-headline text-sm font-bold text-secondary">Inefficient Collections</h3>
            <p className="font-sans text-xs text-outline leading-relaxed">
              Collections teams spend 80% of their effort chasing small, low-risk invoices, leaving large exposures unmonitored.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-outline-variant space-y-4 shadow-sm hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[32px]">bar_chart</span>
            <h3 className="font-headline text-sm font-bold text-secondary">Outstanding Exposure</h3>
            <p className="font-sans text-xs text-outline leading-relaxed">
              A company&apos;s total outstanding balance accumulates silently across sales segments, reducing cash flow predictability.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-outline-variant space-y-4 shadow-sm hover:shadow-md transition-all md:col-span-2 lg:col-span-1">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[32px]">visibility_off</span>
            <h3 className="font-headline text-sm font-bold text-secondary">ERP Blind Spots</h3>
            <p className="font-sans text-xs text-outline leading-relaxed">
              Traditional ERP systems record transactional history but fail to model predictive metrics and score trends.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Platform Overview */}
      <section className="bg-background border-y border-outline-variant py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-accent">Modular Architecture</span>
              <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
                Designed for Corporate Operations & Risk
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                </div>
                <div>
                  <h4 className="font-headline text-xs font-bold text-secondary uppercase">Executive Dashboard</h4>
                  <p className="font-sans text-xs text-outline mt-1 leading-relaxed">
                    Visualizes sales, collections, and aging buckets across the organization.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
                <div>
                  <h4 className="font-headline text-xs font-bold text-secondary uppercase">Customer Intelligence</h4>
                  <p className="font-sans text-xs text-outline mt-1 leading-relaxed">
                    Interactive server-side matrix detailing trust scores, purchase patterns, and exposures.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </div>
                <div>
                  <h4 className="font-headline text-xs font-bold text-secondary uppercase">Commercial Analytics</h4>
                  <p className="font-sans text-xs text-outline mt-1 leading-relaxed">
                    Models 8 operational scores to benchmark customer health and risk indicators.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <span className="material-symbols-outlined text-[20px]">summarize</span>
                </div>
                <div>
                  <h4 className="font-headline text-xs font-bold text-secondary uppercase">Operational Monitoring</h4>
                  <p className="font-sans text-xs text-outline mt-1 leading-relaxed">
                    Automated warnings and next-best-action policy recommenders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mini Vector Diagram representing data flow */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant shadow-md space-y-6">
            <h4 className="font-headline text-xs font-bold text-secondary uppercase tracking-wider">Stateful Data Flow</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-background rounded border border-outline-variant/60 text-xs">
                <span className="font-mono text-outline">1. ERP Ledger Ingestion</span>
                <span className="material-symbols-outlined text-brand-accent">check_circle</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded border border-outline-variant/60 text-xs">
                <span className="font-mono text-outline">2. Score Calculations</span>
                <span className="material-symbols-outlined text-brand-accent">check_circle</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded border border-outline-variant/60 text-xs">
                <span className="font-mono text-outline">3. Predictive Risk Assessment</span>
                <span className="material-symbols-outlined text-brand-accent">check_circle</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded border border-outline-variant/60 text-xs">
                <span className="font-mono text-secondary font-bold">4. Next-Best-Action Policy</span>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-ping"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Product Preview */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-secondary">
            Designed for Commercial Executives
          </h2>
          <p className="text-xs text-outline uppercase tracking-wider font-semibold">
            Visual walkthrough of the platform interfaces
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center border-b border-outline-variant gap-8">
          {(['dashboard', 'detail', 'reports'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-outline hover:text-secondary'
              }`}
            >
              {tab === 'dashboard' ? 'Executive Dashboard' : tab === 'detail' ? 'Customer Profile' : 'Reports & Exporter'}
            </button>
          ))}
        </div>

        {/* Mock Screen Content */}
        <div className="bg-secondary p-4 md:p-6 rounded-2xl border border-[#34485E] shadow-2xl">
          {activeTab === 'dashboard' && (
            <div className="bg-background text-secondary rounded-xl overflow-hidden border border-outline-variant h-[340px] p-6 space-y-6 flex flex-col justify-between">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-headline text-md font-bold text-brand-accent">Q3 Commercial Intelligence Overview</h4>
                  <p className="text-[10px] text-outline">Real-time telemetry feeds active.</p>
                </div>
                <span className="text-[10px] bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded font-bold uppercase font-mono">Heartbeat OK</span>
              </div>
              {/* Cards Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border border-outline-variant space-y-1">
                  <span className="text-[9px] text-outline uppercase tracking-wider font-semibold">Active Accounts</span>
                  <p className="font-headline text-xl font-bold text-secondary">1,048</p>
                </div>
                <div className="bg-white p-4 rounded border border-outline-variant space-y-1">
                  <span className="text-[9px] text-outline uppercase tracking-wider font-semibold">Total Collections</span>
                  <p className="font-headline text-xl font-bold text-secondary">$54.2M</p>
                </div>
                <div className="bg-white p-4 rounded border border-outline-variant space-y-1">
                  <span className="text-[9px] text-outline uppercase tracking-wider font-semibold">Outstanding Exposure</span>
                  <p className="font-headline text-xl font-bold text-secondary">$9.0M</p>
                </div>
              </div>
              {/* Bottom Pulse Representation */}
              <div className="flex-1 bg-white border border-outline-variant rounded p-4 flex flex-col justify-between">
                <span className="text-[9px] text-outline uppercase font-bold">Longitudinal Commercial Pulse (365d)</span>
                <div className="h-16 flex items-end gap-1.5 pt-2">
                  {[20, 40, 25, 50, 45, 60, 30, 80, 55, 90, 75, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-brand-accent/20 hover:bg-brand-accent transition-colors rounded-t" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'detail' && (
            <div className="bg-background text-secondary rounded-xl overflow-hidden border border-outline-variant h-[340px] p-6 space-y-6 flex flex-col justify-between">
              {/* Profile Ribbon */}
              <div className="flex justify-between items-center p-3 bg-white border border-outline-variant rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-brand-accent text-white flex items-center justify-center font-bold">VG</div>
                  <div>
                    <h5 className="text-xs font-bold">Vohra-Dugal Corporation</h5>
                    <p className="text-[9px] text-outline">ID: 381f54d5-92e5-4d0c | Location: Rampur</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-[#ba1a1a]/10 text-[#ba1a1a] rounded font-bold uppercase border border-[#ba1a1a]/20">Liquidity Stress</span>
              </div>
              {/* Scores Grid */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Health Score', score: 67 },
                  { name: 'Risk Score', score: 61 },
                  { name: 'Growth Score', score: 45 },
                  { name: 'Trust Score', score: 50 },
                ].map((s) => (
                  <div key={s.name} className="bg-white p-3 rounded border border-outline-variant space-y-1">
                    <span className="text-[9px] text-outline uppercase">{s.name}</span>
                    <p className="text-xs font-extrabold text-secondary">{s.score}%</p>
                    <div className="w-full bg-outline-variant h-1 rounded-full overflow-hidden">
                      <div className="bg-brand-accent h-full" style={{ width: `${s.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Predictions Card */}
              <div className="bg-white border border-outline-variant rounded p-4 space-y-2">
                <span className="text-[9px] text-outline uppercase font-bold">Next-Best-Action Policy Recommendation</span>
                <p className="text-xs leading-relaxed text-secondary">
                  <strong className="text-brand-accent">TIGHTEN PAYMENT TERMS:</strong> Customer payment cycles exceed credit parameters. Adjust default window to 45 days.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-background text-secondary rounded-xl overflow-hidden border border-outline-variant h-[340px] p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-headline text-md font-bold text-secondary">Intelligence Reports & Exporter</h4>
                <p className="text-[10px] text-outline mt-0.5">Generate and download structured CSV/Excel reports.</p>
              </div>
              <div className="border border-outline-variant rounded bg-white p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-outline block font-bold">Export Dataset Filter</label>
                  <select className="w-full text-xs bg-background border border-outline-variant rounded p-2 focus:outline-none">
                    <option>All Accounts (Active exposure)</option>
                    <option>Accounts in Liquidity Stress</option>
                    <option>Accounts with Outstanding Balances &gt; $100k</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 py-2 bg-brand-accent text-white text-xs font-bold uppercase rounded hover:brightness-110">
                    Download CSV
                  </button>
                  <button className="flex-1 py-2 border border-outline-variant text-secondary text-xs font-bold uppercase rounded hover:bg-background">
                    Schedule Auto-Export
                  </button>
                </div>
              </div>
              <div className="text-[9px] text-outline text-center">
                System enforces encrypted ledger hashing upon export generation sequences.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Business Outcomes Section */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left column illustration represent data stats */}
        <div className="space-y-6 bg-background p-8 rounded-xl border border-outline-variant">
          <h4 className="font-headline text-xs font-bold text-secondary uppercase tracking-wider">Verified Business Outcomes</h4>
          <div className="space-y-4 font-sans text-xs">
            <div className="flex justify-between items-center p-3 bg-white rounded border border-outline-variant/60">
              <span className="text-outline">Average DSO Reduction</span>
              <span className="font-headline text-sm font-bold text-brand-accent">-14.2 Days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded border border-outline-variant/60">
              <span className="text-outline">Bad Debt Write-off Reduction</span>
              <span className="font-headline text-sm font-bold text-brand-accent">-38.0%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded border border-outline-variant/60">
              <span className="text-outline">Collections Workflow Efficiency</span>
              <span className="font-headline text-sm font-bold text-brand-accent">+2.5x</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider uppercase text-brand-accent">Operational Benefits</span>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
              Transform Your Cash Flow Profile
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <h4 className="font-headline text-xs font-bold text-secondary uppercase">Improve Commercial Visibility</h4>
              <p className="font-sans text-xs text-outline leading-relaxed">
                Aggregates customer payment rhythms across diverse ledger files into a single, real-time executive dashboard.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-headline text-xs font-bold text-secondary uppercase">Mitigate Delinquency Risk</h4>
              <p className="font-sans text-xs text-outline leading-relaxed">
                Anticipate cash shortages and payment delays using predictive models before bad debt accumulates.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-headline text-xs font-bold text-secondary uppercase">Enhance Decision Quality</h4>
              <p className="font-sans text-xs text-outline leading-relaxed">
                Decide credit extensions and terms adjustments based on quantitative behavioral scores, not guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="bg-secondary text-white py-20 px-6 text-center space-y-8 border-t border-[#34485E]">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="font-headline text-3xl font-extrabold tracking-tight">
            Ready to audit your outstanding exposures?
          </h2>
          <p className="font-sans text-sm text-[#9EADB3] max-w-lg mx-auto leading-relaxed">
            Provision developer keys or schedule an executive session with our risk engineers to connect your ledger system.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/contact?type=demo"
            className="w-full sm:w-auto px-8 py-3 bg-brand-accent text-white font-sans font-bold text-xs uppercase tracking-wider rounded hover:brightness-110 transition-all shadow-md text-center"
          >
            Request Demo
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 border border-[#34485E] bg-secondary text-white font-sans font-bold text-xs uppercase tracking-wider rounded hover:bg-[#34485E] transition-all text-center"
          >
            Access Console
          </Link>
        </div>
      </section>
    </div>
  );
}
