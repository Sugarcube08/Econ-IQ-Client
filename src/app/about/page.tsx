'use client';

import React from 'react';
import { SectionHeader, CTASection } from '@/components/marketing/MarketingComponents';

export default function AboutPage() {
  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-[#FAF9F6] text-[#243447]">
      {/* Header */}
      <SectionHeader
        tag="About Econ-IQ"
        title="Engineering Commercial Transparency"
        description="Econ-IQ builds active risk and cash flow telemetry engines to replace spreadsheets and static credit indexes for global B2B supply networks."
      />

      {/* Platform Story & Core Philosophy */}
      <section className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">Our Origin</span>
          <h3 className="font-headline text-2xl font-extrabold text-[#243447] tracking-tight">
            Bridging ERP Records & Actionable Credit Telemetry
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#5E6266] leading-relaxed">
            Econ-IQ was founded by credit analysts and systems engineers who witnessed the commercial blind spots that emerge when wholesalers, manufacturers, and trading alliances scale. ERP databases recorded transactions, but did not compute forward-looking payment indicators.
          </p>
          <p className="font-sans text-xs sm:text-sm text-[#5E6266] leading-relaxed">
            We built a platform that translates raw invoice rows and ledger ledgers into active, continuous scores. We help organizations protect their cash, prioritize collections, and scale credit safely without manual spreadsheet updates.
          </p>
        </div>
        
        {/* Philosphy Box */}
        <div className="bg-[#243447] text-white p-8 md:p-12 rounded-xl border border-[#34485E] space-y-6">
          <span className="text-[10px] text-[#80d5cb] uppercase tracking-wider font-bold block">Our Belief</span>
          <blockquote className="font-headline text-lg italic text-[#FAF9F6] leading-relaxed">
            &ldquo;Ledgers represent actual commercial behavior. We believe corporate credit lines should be driven by continuous buyer transaction consistency, not static bureau reports.&rdquo;
          </blockquote>
          <div className="h-px bg-[#34485E]"></div>
          <div className="text-xs text-[#9EADB3]">
            — Dr. Arjan Vohra, Co-Founder & Chief Risk Officer
          </div>
        </div>
      </section>

      {/* Mission, Vision, and Values Cards */}
      <section className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl border border-[#E3E2DF] space-y-4">
          <div className="w-10 h-10 rounded bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E]">
            <span className="material-symbols-outlined text-[20px]">target</span>
          </div>
          <h4 className="font-headline text-sm font-bold text-[#243447] uppercase tracking-wider">The Mission</h4>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            To build the transparent commercial credit layer for global B2B commerce. We synchronize ledger data safely across regional supply chains to reduce delinquencies and release working capital.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-[#E3E2DF] space-y-4">
          <div className="w-10 h-10 rounded bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E]">
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </div>
          <h4 className="font-headline text-sm font-bold text-[#243447] uppercase tracking-wider">The Vision</h4>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            To eliminate manual spreadsheets and legacy credit indices. We envision a future where credit decisions are automated, low-latency, and powered by continuous ledger telemetry.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-[#E3E2DF] space-y-4">
          <div className="w-10 h-10 rounded bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E]">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <h4 className="font-headline text-sm font-bold text-[#243447] uppercase tracking-wider">The Technology</h4>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            Built for security first. Econ-IQ encrypts customer ledgers at rest, isolates customer database tenants, hashes invoice registries, and enforces multi-factor verification protocols.
          </p>
        </div>
      </section>

      {/* Corporate Leadership & Engineers note */}
      <section className="bg-white border border-[#E3E2DF] rounded-xl p-8 md:p-12 max-w-[1280px] mx-auto space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">Operational Integrity</span>
          <h3 className="font-headline text-lg font-bold text-[#243447]">Commitment to Accuracy</h3>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            Our platform does not use speculative AI models to guess payment behavior. We use verified transaction registries, ledger dates, and statistical correlations to calculate scores. Every score update displays the corresponding invoices and transaction events, allowing credit managers to verify the calculations.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Work with our risk engineering group"
        subtitle="Learn how we connect ledger streams and compute active customer profiles."
        primaryText="Schedule Integration Consultation"
        primaryLink="/contact?type=demo"
        secondaryText="View Developer Specifications"
        secondaryLink="/platform#api"
      />
    </div>
  );
}
