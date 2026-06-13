'use client';

import React from 'react';
import Link from 'next/link';

export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#243447] text-white border-t border-[#34485E] py-16 px-6 font-sans">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0F766E] rounded flex items-center justify-center text-white font-bold font-headline text-md shadow-sm">
              EQ
            </div>
            <span className="font-headline text-lg font-extrabold text-white tracking-tight">
              Econ-IQ
            </span>
          </div>
          <p className="text-xs text-[#9EADB3] leading-relaxed max-w-sm">
            Econ-IQ is a commercial intelligence platform bridging corporate operations and credit analytics. We construct stateful insights directly from ledger records to optimize outstanding exposures.
          </p>
          <div className="text-[10px] text-[#9EADB3] font-semibold">
            Operational Heartbeat: <span className="text-[#80d5cb]">Active V2.0</span>
          </div>
        </div>

        {/* Sitemap Columns */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#9EADB3]">Platform</h4>
          <ul className="space-y-2 text-xs text-[#C5D0D6]">
            <li><Link href="/platform#dashboard" className="hover:text-white transition-colors">Executive Dashboard</Link></li>
            <li><Link href="/platform#matrix" className="hover:text-white transition-colors">Customer Intelligence</Link></li>
            <li><Link href="/platform#analytics" className="hover:text-white transition-colors">Commercial Analytics</Link></li>
            <li><Link href="/platform#api" className="hover:text-white transition-colors">Developer APIs</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#9EADB3]">Solutions</h4>
          <ul className="space-y-2 text-xs text-[#C5D0D6]">
            <li><Link href="/solutions#risk" className="hover:text-white transition-colors">Commercial Risk</Link></li>
            <li><Link href="/solutions#collections" className="hover:text-white transition-colors">Collection Priority</Link></li>
            <li><Link href="/solutions#monitoring" className="hover:text-white transition-colors">Account Monitoring</Link></li>
            <li><Link href="/solutions#outstanding" className="hover:text-white transition-colors">Outstanding Management</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#9EADB3]">Company</h4>
          <ul className="space-y-2 text-xs text-[#C5D0D6]">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Sales</Link></li>
            <li><Link href="/resources" className="hover:text-white transition-colors">Resources Hub</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Premium Plans</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto h-px bg-[#34485E] my-12"></div>

      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#9EADB3]">
        <span>&copy; {year} Econ-IQ Technologies Inc. All rights reserved.</span>
        <div className="flex gap-6 font-semibold uppercase tracking-wider">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/security" className="hover:text-white transition-colors">Security Controls</Link>
        </div>
      </div>
    </footer>
  );
}
