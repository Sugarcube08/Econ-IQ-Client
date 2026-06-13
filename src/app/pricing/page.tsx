'use client';

import React from 'react';
import { SectionHeader, PricingCards, FAQSection } from '@/components/marketing/MarketingComponents';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter Intelligence',
      tagline: 'For mid-market manufacturers and wholesalers seeking basic exposure tracking.',
      price: '$1,200',
      period: 'month',
      outcomes: [
        'Establish clean cash flow visibility across branches',
        'Monitor up to 150 active distributor accounts',
        'Reduce average DSO cycle delays by 5-8 days',
        'Automate standard aging collections alerts'
      ],
      ctaText: 'Start Assessment',
      ctaLink: '/contact?type=starter'
    },
    {
      name: 'Commercial Growth',
      tagline: 'For expanding B2B operations seeking active credit risk intelligence.',
      price: '$2,800',
      period: 'month',
      outcomes: [
        'Reduce counterparty credit delinquency by 25%',
        'Monitor up to 500 active customer accounts',
        'Accelerate collections efficiency by 2.0x',
        'Access next-best-action credit recommendations'
      ],
      ctaText: 'Deploy Growth Console',
      ctaLink: '/contact?type=growth',
      isPopular: true
    },
    {
      name: 'Corporate Enterprise',
      tagline: 'For large-scale industrial companies requiring comprehensive risk modeling.',
      price: '$6,500',
      period: 'month',
      outcomes: [
        'Achieve maximum cash flow velocity (14d+ DSO drop)',
        'Monitor unlimited customer accounts and ledgers',
        'Direct REST API integrations for auto-checkout',
        'Access priority collections queues'
      ],
      ctaText: 'Request Pilot Program',
      ctaLink: '/contact?type=enterprise'
    },
    {
      name: 'Custom Architecture',
      tagline: 'For specialized enterprise requirements or private cloud deployments.',
      price: 'Custom',
      period: '',
      outcomes: [
        'Dedicated credit risk modeling support engineers',
        'Private tenant database or private cloud hosting',
        'Custom ERP ledger connector development',
        'Formal SLA and 24/7 priority support support'
      ],
      ctaText: 'Contact Risk Engineers',
      ctaLink: '/contact?type=custom'
    }
  ];

  const pricingFaqs = [
    {
      question: 'How is subscription pricing calculated?',
      answer: 'Pricing is billed monthly based on the selected tier. There are no additional per-user licenses or seat costs. You can invite your entire finance, credit, sales, and executive teams without incremental charges.'
    },
    {
      question: 'Can we connect multiple ERP ledger databases?',
      answer: 'Yes. The Growth and Enterprise plans support connecting multiple ledger data sources. Econ-IQ normalizes transactions across multiple subsidiaries, regions, or entities to compute a single trust and payment score per buyer.'
    },
    {
      question: 'Is there a setup or implementation fee?',
      answer: 'We provide remote deployment support for all tiers. Custom database configurations, specialized ERP mappings, or on-premise tenant setups are evaluated and quoted separately by our integration engineers.'
    },
    {
      question: 'How does the 30-day ledger assessment work?',
      answer: 'Before beginning a subscription, we offer a historical ledger evaluation. Our risk engineers securely parse a historical transaction export (CSV format) to calculate your current cash pulse and identify immediate risk exposures.'
    }
  ];

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-[#FAF9F6] text-[#243447]">
      {/* Header */}
      <SectionHeader
        tag="Premium Plans"
        title="Predictable Outcomes. Transparent Value."
        description="Econ-IQ subscription models are designed for B2B operations. We structure plans around business outcomes, account volumes, and integration depths."
      />

      {/* Pricing Cards Grid */}
      <section className="max-w-[1280px] mx-auto">
        <PricingCards plans={plans} />
      </section>

      {/* FAQ Section */}
      <section className="space-y-12 max-w-[1280px] mx-auto">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">Questions</span>
          <h2 className="font-headline text-2xl font-extrabold text-[#243447]">Pricing & Implementation FAQ</h2>
        </div>
        <FAQSection faqs={pricingFaqs} />
      </section>

      {/* Outcome Commitment Callout */}
      <section className="bg-white border border-[#E3E2DF] rounded-xl p-8 md:p-12 max-w-3xl mx-auto text-center space-y-4">
        <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">Guaranteed Alignment</span>
        <h3 className="font-headline text-lg font-bold text-[#243447]">Run a historical ledger assessment</h3>
        <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
          Unsure which tier matches your exposure levels? Let our risk team process a historical ledger file export to generate a diagnostic summary. We identify outstanding bottlenecks and demonstrate score accuracy before you subscribe.
        </p>
        <div className="pt-2">
          <a
            href="/contact?type=assessment"
            className="inline-block px-6 py-2.5 bg-[#0F766E] text-white text-xs font-bold uppercase tracking-wider rounded hover:brightness-110"
          >
            Request Ledger Diagnosis
          </a>
        </div>
      </section>
    </div>
  );
}
