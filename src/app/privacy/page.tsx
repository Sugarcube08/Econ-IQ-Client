'use client';

import React from 'react';
import { SectionHeader, CTASection } from '@/components/marketing/MarketingComponents';

export default function PrivacyPage() {
  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-[#FAF9F6] text-[#243447]">
      {/* Header */}
      <SectionHeader
        tag="Privacy Policy"
        title="Ledger Data Confidentiality"
        description="Econ-IQ enforces strict data privacy boundaries. We treat your commercial invoice histories and transaction ledgers with absolute security."
      />

      {/* Content */}
      <section className="max-w-3xl mx-auto bg-white border border-[#E3E2DF] rounded-xl p-8 md:p-12 font-sans text-xs sm:text-sm text-[#5E6266] space-y-6 leading-relaxed">
        <div className="space-y-2">
          <h3 className="font-headline text-base font-bold text-[#243447]">1. Information Ingestion</h3>
          <p>
            Econ-IQ ingests raw invoice registries, ledger entries, and payment records purely to calculate trust, growth, and relationship scores. We retrieve read-only feeds and do not modify transaction records in your host ERP systems.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-headline text-base font-bold text-[#243447]">2. Tenant Isolation Boundaries</h3>
          <p>
            All ingested transactions are written to an isolated database tenant unique to your organization. Your proprietary commercial histories are never co-mingled, aggregates are never shared, and customer data is never used to train global scoring algorithms.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-headline text-base font-bold text-[#243447]">3. Data Deletion</h3>
          <p>
            If you terminate your Econ-IQ connection or delete a tenant profile, we cryptographically scrub all customer scores, transaction histories, and invoice snapshots from our production hosts within 72 hours.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-headline text-base font-bold text-[#243447]">4. Audits & Compliance</h3>
          <p>
            Econ-IQ complies with regional corporate privacy regulations. We support role-based user access controls, allowing your systems admin to restrict view capabilities by team division or regional branch.
          </p>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Questions about data handling?"
        subtitle="Contact our compliance team to receive a detailed breakdown of our privacy mechanisms and tenant isolation parameters."
        primaryText="Contact Compliance Team"
        primaryLink="/contact?type=custom"
        secondaryText="View Platform Specifications"
        secondaryLink="/platform"
      />
    </div>
  );
}
