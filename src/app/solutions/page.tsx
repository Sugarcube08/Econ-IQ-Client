'use client';

import React from 'react';
import { SectionHeader, FeatureGrid, CTASection } from '@/components/marketing/MarketingComponents';

export default function SolutionsPage() {
  const solutions = [
    {
      icon: 'warning',
      title: 'Commercial Risk Mitigation',
      description: 'Traditional credit bureau scores ignore live order behavior and payment frequencies. Econ-IQ calculates continuous trust and payment ratings based on actual transaction patterns to protect your margin.',
      metric: '30-45 Days Early Delinquency Warning'
    },
    {
      icon: 'payments',
      title: 'Collections Optimization',
      description: 'Redirect your collections teams from chasing low-value, low-risk accounts. Econ-IQ segment monitors customer accounts automatically and prioritizes aging balances with high exposure and liquidity stress.',
      metric: '2.5x Collections Bandwidth Efficiency'
    },
    {
      icon: 'monitoring',
      title: 'Continuous Account Monitoring',
      description: 'Track customer payment and purchase health over a rolling 365-day timeline. Detect accounts in gradual decline or experiencing cash flow constraints before defaults affect your cash flows.',
      metric: '-38% Bad Debt Write-offs'
    },
    {
      icon: 'account_balance',
      title: 'Outstanding Exposure Management',
      description: 'Keep your working capital fluid by tracking outstanding accounts and aging buckets in real-time. Benchmark terms compliance across regions, segments, and sales divisions.',
      metric: '-14.2 Days DSO Cycle Reduction'
    },
    {
      icon: 'trending_up',
      title: 'Growth Intelligence',
      description: 'Confidently extend credit terms to creditworthy buyers. Econ-IQ identifies healthy, high-purchase accounts with excellent payment consistency so you can capture more revenue safely.',
      metric: '18% Credit Line Expansion Velocity'
    },
    {
      icon: 'summarize',
      title: 'Executive & Audit Reporting',
      description: 'Stop wasting developer hours writing custom database query scripts. Generate CSV data exports and ledger audit lists matching your specific filters, complete with SHA-256 validation.',
      metric: 'Zero-Script Audit Compliance'
    }
  ];

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-[#FAF9F6] text-[#243447]">
      {/* Header */}
      <SectionHeader
        tag="Solutions"
        title="Engineered for B2B Commercial Problems"
        description="Econ-IQ provides targeted commercial intelligence modules to optimize cash flows, credit risk exposure, and collection workflows for industrial operations."
      />

      {/* Solutions Grid */}
      <section className="max-w-[1280px] mx-auto">
        <FeatureGrid features={solutions} columns={3} />
      </section>

      {/* Structured Problem-Solution Matrix */}
      <section className="bg-white border border-[#E3E2DF] rounded-xl p-8 md:p-12 max-w-[1280px] mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h3 className="font-headline text-lg font-bold text-[#243447]">Active Ledger Verification Framework</h3>
          <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
            How Econ-IQ compares to traditional legacy solutions and manual workflows.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#E3E2DF] text-[#5E6266] uppercase tracking-wider text-[10px] font-bold">
                <th className="pb-4 font-bold">Operational Metric</th>
                <th className="pb-4 font-bold">Spreadsheets & ERP Reports</th>
                <th className="pb-4 font-bold text-[#0F766E]">Econ-IQ Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E2DF]/50 text-[#243447]">
              <tr>
                <td className="py-4 font-semibold">Data Refresh Cycle</td>
                <td className="py-4 text-[#5E6266]">Monthly manual extraction & compile</td>
                <td className="py-4 font-bold text-[#0F766E]">Continuous server-side synchronization</td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Risk Assessments</td>
                <td className="py-4 text-[#5E6266]">Outdated credit reports (30-90 days old)</td>
                <td className="py-4 font-bold text-[#0F766E]">Live purchase-payment correlation scoring</td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Collections Prioritization</td>
                <td className="py-4 text-[#5E6266]">Sorting by nominal aging buckets (e.g. 30/60/90 days)</td>
                <td className="py-4 font-bold text-[#0F766E]">Stateful prioritization mapping risk & exposure</td>
              </tr>
              <tr>
                <td className="py-4 font-semibold">Integration Effort</td>
                <td className="py-4 text-[#5E6266]">Disruptive custom code or legacy consultants</td>
                <td className="py-4 font-bold text-[#0F766E]">REST APIs or CSV imports setup under 72h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Align your commercial teams on verified ledger data"
        subtitle="Schedule a technical demo to see how Econ-IQ models account health and risk exposure."
        primaryText="Schedule Demo Session"
        primaryLink="/contact?type=demo"
        secondaryText="View Case Studies"
        secondaryLink="/customers"
      />
    </div>
  );
}
