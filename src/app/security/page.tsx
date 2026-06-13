'use client';

import React from 'react';
import { SectionHeader, CTASection } from '@/components/marketing/MarketingComponents';

export default function SecurityPage() {
  const securityControls = [
    {
      icon: 'database',
      title: 'Isolated Database Tenancy',
      description: 'Your organization’s ledger registries and payment analytics are housed in a separate, isolated database instance. There is zero database co-mingling or cross-tenant query risk.',
    },
    {
      icon: 'vpn_lock',
      title: 'End-to-End Encryption',
      description: 'Econ-IQ encrypts all commercial ledger data using AES-256 in storage states. Data in transit is secured using TLS 1.3 encryption protocols.',
    },
    {
      icon: 'fingerprint',
      title: 'Ledger Audit Signatures',
      description: 'Every ledger record and dataset export is accompanied by a SHA-256 cryptographic check signature. This prevents ledger alteration and verifies export origins.',
    },
    {
      icon: 'verified_user',
      title: 'Passkey & Multi-Factor Access',
      description: 'Enterprise console sessions are secured using passwordless email OTP verification flows and strict identity timeouts. Security admins can review audit trails at any time.',
    }
  ];

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-[#FAF9F6] text-[#243447]">
      {/* Header */}
      <SectionHeader
        tag="Security Controls"
        title="Enterprise-Grade Data Safeguards"
        description="Econ-IQ enforces comprehensive physical, network, and application security configurations to safeguard your sensitive commercial histories."
      />

      {/* Grid of Security controls */}
      <section className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-xs">
        {securityControls.map((sc, i) => (
          <div key={i} className="bg-white p-8 rounded-xl border border-[#E3E2DF] space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 rounded bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E]">
              <span className="material-symbols-outlined text-[20px]">{sc.icon}</span>
            </div>
            <h3 className="font-headline text-sm font-bold text-[#243447] uppercase tracking-wider">{sc.title}</h3>
            <p className="text-[#5E6266] leading-relaxed">{sc.description}</p>
          </div>
        ))}
      </section>

      {/* Compliance statement */}
      <section className="bg-white border border-[#E3E2DF] rounded-xl p-8 md:p-12 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center font-sans text-xs">
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">Compliance Standards</span>
          <h3 className="font-headline text-lg font-bold text-[#243447]">SOC-2 & ISO 27001 Alignment</h3>
          <p className="text-[#5E6266] leading-relaxed">
            Our cloud infrastructure providers maintain active SOC-2 Type II audits, ISO 27001 certifications, and fully compliant data centers. We undergo regular network penetration testing, application code reviews, and threat vector analysis.
          </p>
        </div>
        <div className="p-6 bg-[#FAF9F6] rounded border border-[#E3E2DF]/60 space-y-2 text-[10px] text-outline font-semibold">
          <div className="flex justify-between items-center py-1 border-b border-[#E3E2DF]/40">
            <span>SOC-2 Certification Status:</span>
            <span className="text-[#0F766E] font-bold">Compliant / Active</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#E3E2DF]/40">
            <span>Encryption Standard:</span>
            <span className="text-[#0F766E] font-bold">AES-256-GCM</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Database Ingestion:</span>
            <span className="text-[#0F766E] font-bold">Read-Only Connectors</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Schedule a security review"
        subtitle="Request our complete security pack, tenant isolation maps, and compliance documentations."
        primaryText="Contact Security Team"
        primaryLink="/contact?type=custom"
        secondaryText="View API Specs"
        secondaryLink="/platform#api"
      />
    </div>
  );
}
