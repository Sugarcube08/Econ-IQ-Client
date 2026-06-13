'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Search, Bell } from 'lucide-react';

export default function TopBar({ title }: { title?: string }) {
  const { user } = useAuth();

  const formattedName = user
    ? user.full_name || user.email
    : 'J. Sterling';

  const roleLabel = user ? user.role.replace('_', ' ') : 'CFO';

  return (
    <header className="bg-surface h-16 flex items-center justify-between px-lg border-b border-outline-variant sticky top-0 z-40 shadow-sm transition-all md:left-sidebar-width">
      <div className="flex items-center gap-md">
        <h2 className="font-headline text-lg font-black text-brand-accent hidden sm:block">
          {title || 'Executive Dashboard'}
        </h2>
      </div>

      <div className="flex items-center gap-lg">
        {/* Search */}
        <div className="hidden lg:flex items-center bg-surface-container-low rounded border border-outline-variant px-sm py-1 focus-within:ring-2 focus-within:ring-brand-accent transition-all w-64">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-on-surface w-full py-0 px-2 placeholder:text-outline"
            placeholder="Search accounts, transactions..."
            type="text"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-sm text-on-surface-variant">
          <button className="p-sm hover:text-brand-accent transition-all relative cursor-pointer bg-transparent border-0">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>

        <div className="w-px h-6 bg-outline-variant hidden sm:block"></div>

        {/* Profile */}
        <div className="flex items-center gap-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Executive Profile"
            className="w-8 h-8 rounded-full border border-outline-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCGchDSEakrKOcETei73KAXiI49lgoozHkL8iexvK7aI3FQ4gIoRSJLEvcqkdVoayqudYGmq-5M-oeXThlhltVEf4_c1nR21R8oLbuANpgPpRF0QUZ2ViJb04im9ySAgK_JaEbEs9hoynV6B1BtJEflHux_G22gWdmEY66-VM721fw4feylDJpQo0VN3fRouxDcEz7EIwpNQewTerTsGsTCNndbBN-I4aAO1xSce_YXsZd9aBIns-lp14q5EMQBieVjWYUbjF3slw"
          />
          <div className="hidden xl:flex flex-col items-start leading-none text-xs">
            <span className="font-sans text-xs font-semibold text-on-surface">{formattedName}</span>
            <span className="font-sans text-[10px] text-on-surface-variant uppercase mt-1">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
