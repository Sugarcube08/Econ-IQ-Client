'use client';

import React from 'react';
import { SectionHeader, IndustryCards, CTASection } from '@/components/marketing/MarketingComponents';

export default function IndustriesPage() {
  const industries = [
    {
      icon: 'factory',
      title: 'Manufacturing & Heavy Industry',
      challenge: 'Long production cycles and custom capital-intensive orders lock up major upfront working capital. Delayed distributor payments ripple backward and stall production lines.',
      solution: 'Continuous monitoring of buyer ledger histories tracks payment scores and alerts risk managers before raw materials are committed.',
      outcome: 'Reduce exposure on long-lead orders and secure material investments.'
    },
    {
      icon: 'local_shipping',
      title: 'Logistics & Distribution',
      challenge: 'Operating on thin margins across multi-region depots means a small delay in freight or delivery invoice payments rapidly reduces overall liquidity.',
      solution: 'Consolidated commercial analytics aggregates outstanding balances and terms compliance rates across all distribution channels.',
      outcome: 'Protect operational cash flow stability across regional networks.'
    },
    {
      icon: 'store',
      title: 'Wholesale Trade',
      challenge: 'Processing high transaction volumes with diverse buyer lists makes manual credit checks slow, resulting in unmonitored default build-up.',
      solution: 'Low-latency REST APIs integrate live credit trust and payment scores directly into the order placement workflow.',
      outcome: 'Automate high-volume credit decisions without slowing order flow.'
    },
    {
      icon: 'currency_exchange',
      title: 'Commodities & Trading',
      challenge: 'Sudden price volatility in materials and bulk goods strains buyer liquidity, leading to rapid, unforeseen default events.',
      solution: 'Continuous behavioral analysis monitors buyer purchase-payment correlations, identifying stress patterns early.',
      outcome: 'Mitigate defaults by spotting counterparty liquidity issues 30 days in advance.'
    },
    {
      icon: 'shopping_cart',
      title: 'Fast-Moving Consumer Goods (FMCG)',
      challenge: 'Massive retailer and distributor accounts lists cause collections teams to waste time chasing small invoices while major exposures grow.',
      solution: 'Priority collections queueing segments accounts automatically based on live exposure size and calculated risk state.',
      outcome: 'Redirect team bandwidth to maximize outstanding cash recovery.'
    },
    {
      icon: 'construction',
      title: 'Industrial & Machinery Supply',
      challenge: 'High-value equipment orders involve complex warranty and freight terms. Invoice disputes linger for months, delaying ledger closure.',
      solution: 'Integrated reporting checks delivery milestones against invoice age, raising warnings on lingering dispute files.',
      outcome: 'Resolve billing disputes faster and lower overall DSO averages.'
    }
  ];

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-background text-secondary">
      {/* Header */}
      <SectionHeader
        tag="Industries"
        title="Tailored to B2B Commercial Networks"
        description="Econ-IQ is built specifically for industrial businesses managing complex distributor channels, bulk trade flows, and capital-intensive supply chains."
      />

      {/* Industry Cards Grid */}
      <section className="max-w-[1280px] mx-auto">
        <IndustryCards industries={industries} />
      </section>

      {/* Integration Detail Section */}
      <section className="bg-white border border-outline-variant rounded-xl p-8 md:p-12 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider block">Enterprise Standard</span>
          <h3 className="font-headline text-xl font-extrabold text-secondary">Compatible with your existing ERP</h3>
          <p className="font-sans text-xs text-outline leading-relaxed">
            Econ-IQ does not replace your ERP ledger records or billing systems. We sit on top of your existing infrastructure, reading transaction histories securely via database reads or automated flat-file CSV dumps to extract active analytics.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-secondary">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-accent text-[18px]">check_circle</span>
              <span>SAP & Oracle Compatible</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-accent text-[18px]">check_circle</span>
              <span>NetSuite & Dynamics Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-accent text-[18px]">check_circle</span>
              <span>Flat-file CSV / Excel Importers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-accent text-[18px]">check_circle</span>
              <span>72-Hour Deployment Timeframe</span>
            </div>
          </div>
        </div>
        
        {/* Right side illustration representing compatibility */}
        <div className="bg-background p-8 rounded-lg border border-outline-variant/60 space-y-4">
          <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">Data Flow Connectivity</span>
          <div className="space-y-2 font-mono text-[10px] text-secondary">
            <div className="p-2 bg-white rounded border border-outline-variant flex justify-between items-center">
              <span>ERP Invoice Registers</span>
              <span className="text-brand-accent font-bold">Connect</span>
            </div>
            <div className="p-2 bg-white rounded border border-outline-variant flex justify-between items-center">
              <span>Historical Payment Ledger</span>
              <span className="text-brand-accent font-bold">Connect</span>
            </div>
            <div className="p-2 bg-white rounded border border-outline-variant flex justify-between items-center">
              <span>Econ-IQ Scoring Engine</span>
              <span className="text-brand-accent font-bold">Processing</span>
            </div>
            <div className="p-2 bg-brand-accent/10 rounded border border-brand-accent/20 flex justify-between items-center text-brand-accent">
              <span>Predictive Term Adjustments</span>
              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Protect your manufacturing and trading cash flows"
        subtitle="Talk to an integration specialist today to schedule a risk mapping assessment."
        primaryText="Schedule Integration Call"
        primaryLink="/contact?type=demo"
        secondaryText="View Pricing Plans"
        secondaryLink="/pricing"
      />
    </div>
  );
}
