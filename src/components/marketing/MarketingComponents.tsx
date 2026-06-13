'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- SECTION HEADER ---
interface SectionHeaderProps {
  tag?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}

export function SectionHeader({ tag, title, description, align = 'center' }: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <div className={`space-y-3 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-2xl'}`}>
      {tag && (
        <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-[#0F766E] bg-[#0F766E]/10 px-2.5 py-1 rounded-full">
          {tag}
        </span>
      )}
      <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#243447] tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="font-sans text-xs sm:text-sm text-[#5E6266] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

// --- FEATURE GRID ---
interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  metric?: string;
}

interface FeatureGridProps {
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
  const colClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${colClass} gap-8`}>
      {features.map((feature, i) => (
        <div
          key={i}
          className="bg-white p-8 rounded-xl border border-[#E3E2DF] space-y-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E]">
              <span className="material-symbols-outlined text-[24px]">{feature.icon}</span>
            </div>
            <h3 className="font-headline text-sm font-bold text-[#243447] uppercase tracking-wide">
              {feature.title}
            </h3>
            <p className="font-sans text-xs text-[#5E6266] leading-relaxed">
              {feature.description}
            </p>
          </div>
          {feature.metric && (
            <div className="pt-4 border-t border-[#E3E2DF]/60">
              <span className="text-[10px] text-[#5E6266] font-semibold uppercase tracking-wider block">Target Outcome</span>
              <span className="font-headline text-lg font-extrabold text-[#0F766E]">{feature.metric}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- INDUSTRY CARDS ---
interface IndustryItem {
  icon: string;
  title: string;
  challenge: string;
  solution: string;
  outcome: string;
}

interface IndustryCardsProps {
  industries: IndustryItem[];
}

export function IndustryCards({ industries }: IndustryCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {industries.map((ind, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#E3E2DF] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Accent Side bar */}
          <div className="md:w-16 bg-[#243447] flex md:flex-col items-center justify-center p-4 gap-2 text-white border-b md:border-b-0 md:border-r border-[#E3E2DF]">
            <span className="material-symbols-outlined text-[24px] text-[#80d5cb]">{ind.icon}</span>
          </div>
          
          <div className="p-8 flex-1 space-y-4">
            <h3 className="font-headline text-base font-bold text-[#243447] tracking-tight">
              {ind.title}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-[#ba1a1a] uppercase font-bold tracking-wider">The Challenge</span>
                <p className="font-sans text-[#5E6266] leading-relaxed">{ind.challenge}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[#0F766E] uppercase font-bold tracking-wider">The Solution</span>
                <p className="font-sans text-[#5E6266] leading-relaxed">{ind.solution}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[#243447] uppercase font-bold tracking-wider">The Outcome</span>
                <p className="font-sans text-[#243447] font-semibold leading-relaxed">{ind.outcome}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- CASE STUDY CARDS ---
interface CaseStudyItem {
  company: string;
  initials: string;
  industry: string;
  metric: string;
  metricLabel: string;
  description: string;
  challenge: string;
  solution: string;
}

interface CaseStudyCardsProps {
  studies: CaseStudyItem[];
}

export function CaseStudyCards({ studies }: CaseStudyCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {studies.map((study, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#E3E2DF] shadow-sm hover:shadow-md transition-all duration-300 p-8 flex flex-col justify-between gap-6"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#243447] text-[#FAF9F6] flex items-center justify-center font-bold font-headline text-sm">
                  {study.initials}
                </div>
                <div>
                  <h3 className="font-headline text-sm font-bold text-[#243447]">{study.company}</h3>
                  <span className="text-[9px] uppercase tracking-wider text-[#5E6266] font-semibold">{study.industry}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-headline text-xl font-black text-[#0F766E] block leading-none">{study.metric}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#5E6266] font-bold">{study.metricLabel}</span>
              </div>
            </div>
            
            <p className="font-sans text-xs text-[#5E6266] leading-relaxed italic border-l-2 border-[#0F766E] pl-3">
              &ldquo;{study.description}&rdquo;
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] border-t border-[#E3E2DF]/60">
              <div className="space-y-1">
                <strong className="text-[#5E6266] uppercase block text-[9px] tracking-wider">Before</strong>
                <p className="font-sans text-[#ba1a1a] leading-relaxed">{study.challenge}</p>
              </div>
              <div className="space-y-1">
                <strong className="text-[#5E6266] uppercase block text-[9px] tracking-wider">After Econ-IQ</strong>
                <p className="font-sans text-[#243447] leading-relaxed">{study.solution}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- PRICING CARDS ---
interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  period: string;
  outcomes: string[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
}

interface PricingCardsProps {
  plans: PricingPlan[];
}

export function PricingCards({ plans }: PricingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {plans.map((plan, i) => (
        <div
          key={i}
          className={`bg-white rounded-xl border flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative ${
            plan.isPopular ? 'border-[#0F766E] ring-1 ring-[#0F766E]/20' : 'border-[#E3E2DF]'
          }`}
        >
          {plan.isPopular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F766E] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              Most Selected
            </span>
          )}
          
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="font-headline text-base font-extrabold text-[#243447] tracking-tight">{plan.name}</h3>
              <p className="font-sans text-xs text-[#5E6266] leading-relaxed">{plan.tagline}</p>
            </div>
            
            <div className="h-px bg-[#E3E2DF]/60"></div>
            
            <div className="space-y-1">
              <span className="font-headline text-3xl font-black text-[#243447] tracking-tight">{plan.price}</span>
              {plan.period && <span className="font-sans text-xs text-[#5E6266]"> / {plan.period}</span>}
            </div>

            <div className="h-px bg-[#E3E2DF]/60"></div>

            <div className="space-y-4">
              <span className="text-[10px] text-[#5E6266] font-bold uppercase tracking-wider block">Operational Goals</span>
              <ul className="space-y-2.5">
                {plan.outcomes.map((out, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-xs font-sans text-[#243447]">
                    <span className="material-symbols-outlined text-[#0F766E] text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-8 pt-0">
            <Link
              href={plan.ctaLink}
              className={`w-full block text-center py-3 rounded font-sans font-bold text-xs uppercase tracking-wider transition-colors ${
                plan.isPopular
                  ? 'bg-[#0F766E] text-white hover:brightness-110'
                  : 'border border-[#E3E2DF] text-[#243447] hover:bg-[#E3E2DF]/15'
              }`}
            >
              {plan.ctaText}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- FAQ SECTION ---
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="bg-white rounded-lg border border-[#E3E2DF] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full p-6 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-[#FAF9F6]/50 transition-colors"
            >
              <h3 className="font-headline text-xs sm:text-sm font-bold text-[#243447] uppercase tracking-wide">
                {faq.question}
              </h3>
              <span className={`material-symbols-outlined text-[#5E6266] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[300px] border-t border-[#E3E2DF]/50' : 'max-h-0'
              }`}
            >
              <div className="p-6 font-sans text-xs sm:text-sm text-[#5E6266] leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- TIMELINE SECTION ---
interface TimelineStep {
  step: string;
  title: string;
  duration: string;
  description: string;
}

interface TimelineSectionProps {
  steps: TimelineStep[];
}

export function TimelineSection({ steps }: TimelineSectionProps) {
  return (
    <div className="relative border-l-2 border-[#0F766E]/20 ml-4 md:ml-32 space-y-12 max-w-4xl mx-auto">
      {steps.map((step, i) => (
        <div key={i} className="relative pl-8 md:pl-12">
          {/* Step marker */}
          <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-4 border-[#FAF9F6] bg-[#0F766E] shadow-sm"></div>
          
          {/* Duration tag for medium screens */}
          <div className="hidden md:block absolute -left-32 top-1 w-24 text-right">
            <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider bg-[#0F766E]/10 px-2 py-0.5 rounded-full">
              {step.duration}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-mono text-[10px] text-[#5E6266] uppercase tracking-wider">
                Phase {step.step}
              </span>
              <span className="md:hidden inline-block w-fit text-[9px] font-bold text-[#0F766E] uppercase tracking-wider bg-[#0F766E]/10 px-2 py-0.5 rounded-full">
                {step.duration}
              </span>
            </div>
            <h3 className="font-headline text-base font-extrabold text-[#243447] tracking-tight">
              {step.title}
            </h3>
            <p className="font-sans text-xs text-[#5E6266] leading-relaxed max-w-2xl">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- CTA SECTION ---
interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export function CTASection({
  title,
  subtitle,
  primaryText,
  primaryLink,
  secondaryText,
  secondaryLink
}: CTASectionProps) {
  return (
    <section className="bg-[#243447] text-white py-20 px-6 text-center space-y-8 border-y border-[#34485E]">
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
          {title}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#9EADB3] max-w-lg mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link
          href={primaryLink}
          className="w-full sm:w-auto px-8 py-3 bg-[#0F766E] text-white font-sans font-bold text-xs uppercase tracking-wider rounded hover:brightness-110 transition-all shadow-md text-center"
        >
          {primaryText}
        </Link>
        {secondaryText && secondaryLink && (
          <Link
            href={secondaryLink}
            className="w-full sm:w-auto px-8 py-3 border border-[#34485E] bg-[#243447] text-white font-sans font-bold text-xs uppercase tracking-wider rounded hover:bg-[#34485E] transition-all text-center"
          >
            {secondaryText}
          </Link>
        )}
      </div>
    </section>
  );
}
