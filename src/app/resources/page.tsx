'use client';

import React, { useState } from 'react';
import { SectionHeader, CTASection } from '@/components/marketing/MarketingComponents';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  const categories = [
    'All',
    'Commercial Intelligence',
    'Customer Analytics',
    'Collections',
    'Outstanding Management',
    'Risk Monitoring',
    'Business Operations'
  ];

  const articles = [
    {
      id: 1,
      category: 'Outstanding Management',
      title: 'DSO Reduction Strategies for Heavy Manufacturers',
      description: 'A quantitative analysis of payment term optimization across multi-depot distribution networks.',
      excerpt: 'Heavy manufacturing operations face unique working capital constraints. In this white paper, we analyze the impact of static payment terms versus dynamic, risk-adjusted credit limits. Based on transaction records from 120 distributors, implementing behavioral DSO triggers reduced average collection lag by 18 days, releasing critical capital to raw materials procurement.',
      author: 'Dr. Arjan Vohra, Chief Risk Officer',
      readTime: '8 min read',
      date: 'June 02, 2026'
    },
    {
      id: 2,
      category: 'Risk Monitoring',
      title: 'Identifying Early Signs of Counterparty Liquidity Stress',
      description: 'How statistical purchase-payment correlation models outperform static credit bureau indexes.',
      excerpt: 'Static credit ratings compiled quarterly fail to capture week-to-week shifts in commercial cash flow. The first indicator of distress is typically a purchase volume spike (pre-stocking) coupled with a gradual extension of invoice payment cycles from 30 to 48 days. This paper maps the mathematical models Econ-IQ uses to spot counterparty stress 45 days before actual default.',
      author: 'Sarah Dugal, VP of Engineering',
      readTime: '12 min read',
      date: 'May 24, 2026'
    },
    {
      id: 3,
      category: 'Collections',
      title: 'Designing an Exposure-Weighted Collections Queue',
      description: 'Redirecting accounts receivable bandwidth to high-exposure risk groups.',
      excerpt: 'Traditional collections teams work through ledger outstanding lists chronologically by invoice age. This results in agents spending 80% of their bandwidth chasing minor, low-risk invoices, while large credit exposures decay silently. We present an exposure-weighted priority algorithm that combines trust scores, total outstanding balances, and aging buckets to optimize cash recovery.',
      author: 'CFO Insights Board',
      readTime: '6 min read',
      date: 'May 11, 2026'
    },
    {
      id: 4,
      category: 'Commercial Intelligence',
      title: 'ERP Integration Playbook: Connecting SAP & Oracle Ledgers',
      description: 'Data structure specifications, security protocols, and zero-downtime ledger ingestion flow.',
      excerpt: 'Linking active risk intelligence modules to an enterprise resource planning (ERP) environment does not require database schemas changes. This playbook details our read-only integration flows, cryptographic invoice registry hashes, and tenant data separation structures designed to meet SOC-2 Type II audits.',
      author: 'Security & Infrastructure Team',
      readTime: '10 min read',
      date: 'April 29, 2026'
    },
    {
      id: 5,
      category: 'Customer Analytics',
      title: 'Measuring Customer Trust: The 8 Behavioral Ledger Scores',
      description: 'An in-depth breakdown of the proprietary metrics used to profile accounts.',
      excerpt: 'Econ-IQ constructs eight core behavioral scores (including Trust, Payment, Growth, and Relationship scores) from transaction histories. This guide details the calculation inputs, weighting curves, and temporal decay variables used to build a stateful, longitudinal profile for every commercial buyer account.',
      author: 'Analytics Research Group',
      readTime: '9 min read',
      date: 'April 15, 2026'
    },
    {
      id: 6,
      category: 'Business Operations',
      title: 'Working Capital Management in FMCG Distribution Networks',
      description: 'How to maintain cash flow predictability during regional market shifts.',
      excerpt: 'FMCG distribution depends on high invoice turnover and consistent collections. When regional economic shifts affect distributor liquidity, cash flow predictability deteriorates. We outline policy playbooks for automatic credit limit adaptations and next-best-action workflows to protect margins.',
      author: 'Industrial Operations Group',
      readTime: '7 min read',
      date: 'March 30, 2026'
    }
  ];

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-background text-secondary">
      {/* Header */}
      <SectionHeader
        tag="Publications"
        title="Commercial Intelligence Knowledge Hub"
        description="Access in-depth publications, engineering playbooks, and operational guides on B2B risk, credit tracking, and working capital optimization."
      />

      {/* Publications Control Panel */}
      <section className="max-w-[1280px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setActiveCategory(c);
                  setExpandedArticle(null);
                }}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeCategory === c
                    ? 'bg-brand-accent text-white'
                    : 'bg-white border border-outline-variant text-outline hover:text-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setExpandedArticle(null);
              }}
              className="w-full bg-white border border-outline-variant pl-10 pr-4 py-2 rounded text-xs text-secondary focus:outline-none focus:border-brand-accent"
              placeholder="Search publications..."
            />
          </div>
        </div>

        {/* Article Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 text-xs text-outline font-sans bg-white border border-outline-variant rounded-xl">
            No publications matched your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => {
              const isExpanded = expandedArticle === art.id;
              return (
                <div
                  key={art.id}
                  className="bg-white rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-brand-accent uppercase tracking-wider">
                      <span>{art.category}</span>
                      <span className="text-outline">{art.readTime}</span>
                    </div>

                    <h3 className="font-headline text-base font-bold text-secondary tracking-tight leading-snug">
                      {art.title}
                    </h3>
                    
                    <p className="font-sans text-xs text-outline leading-relaxed">
                      {art.description}
                    </p>

                    {isExpanded && (
                      <div className="pt-4 border-t border-outline-variant/60 text-xs text-outline leading-relaxed font-sans space-y-3 animate-fade-in">
                        <p>{art.excerpt}</p>
                        <div className="pt-2 flex justify-between items-center text-[10px] text-outline font-semibold">
                          <span>By {art.author}</span>
                          <span>Published {art.date}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-8 pt-0 border-t border-outline-variant/40 flex justify-between items-center">
                    <button
                      onClick={() => setExpandedArticle(isExpanded ? null : art.id)}
                      className="text-xs font-bold text-brand-accent uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? 'Collapse Abstract' : 'Read Abstract'}
                      <span className="material-symbols-outlined text-[14px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    <span className="text-[10px] text-outline font-mono">PDF Available</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Publications expansion callout */}
      <section className="bg-white border border-outline-variant rounded-xl p-8 md:p-12 max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider block">Publications Feed</span>
          <h3 className="font-headline text-lg font-bold text-secondary">Subscribe to Our Risk Analytics Feed</h3>
          <p className="font-sans text-xs text-outline leading-relaxed max-w-xl">
            Get technical briefs and integration case studies written by our engineering and analytics groups.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            placeholder="corporate@company.com"
            className="bg-background border border-outline-variant rounded px-4 py-2.5 text-xs text-secondary focus:outline-none w-full md:w-64"
          />
          <button className="bg-brand-accent text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded shrink-0 hover:brightness-110 cursor-pointer">
            Subscribe
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to explore what Econ-IQ can calculate for you?"
        subtitle="Schedule a technical session to discuss risk models and ledger mappings."
        primaryText="Schedule Demo Session"
        primaryLink="/contact?type=demo"
        secondaryText="View Solutions Specs"
        secondaryLink="/solutions"
      />
    </div>
  );
}
