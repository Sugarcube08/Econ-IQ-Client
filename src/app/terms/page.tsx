'use client';

import React from 'react';
import { SectionHeader, CTASection } from '@/components/marketing/MarketingComponents';

export default function TermsPage() {
  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-[#FAF9F6] text-[#243447]">
      {/* Header */}
      <SectionHeader
        tag="Terms of Service"
        title="Commercial Platform Terms"
        description="Econ-IQ provides commercial intelligence software. These terms outline user access rules and integration responsibilities."
      />

      {/* Content */}
      <section className="max-w-3xl mx-auto bg-white border border-[#E3E2DF] rounded-xl p-8 md:p-12 font-sans text-xs sm:text-sm text-[#5E6266] space-y-6 leading-relaxed">
        <div className="space-y-2">
          <h3 className="font-headline text-base font-bold text-[#243447]">1. License & Subscription</h3>
          <p>
            Subject to subscription payments, Econ-IQ grants you a non-transferable, non-exclusive license to access our analytics dashboard, provision API keys, and download custom compliance reports.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-headline text-base font-bold text-[#243447]">2. Ledger & ERP Connector Use</h3>
          <p>
            You are responsible for ensuring that all data synced to the platform via ERP databases or CSV imports is accurate, and that you possess necessary permissions to process such records.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-headline text-base font-bold text-[#243447]">3. Decision Support Liability</h3>
          <p>
            Econ-IQ provides predictive calculations, scores, and policy suggestions to support credit workflows. Final commercial choices (e.g. extending credit, adjusting default terms, collections actions) are made solely at your organization&apos;s discretion.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-headline text-base font-bold text-[#243447]">4. System Integrity & Security</h3>
          <p>
            Users are prohibited from attempting to bypass API limits, access neighboring customer tenants, or expose API credentials to public systems. Unauthorized operations will result in immediate session suspension.
          </p>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Understand our platform parameters"
        subtitle="Request a formal Service Level Agreement (SLA) or discuss corporate legal frameworks with our sales group."
        primaryText="Contact Legal Team"
        primaryLink="/contact?type=custom"
        secondaryText="View Pricing Details"
        secondaryLink="/pricing"
      />
    </div>
  );
}
