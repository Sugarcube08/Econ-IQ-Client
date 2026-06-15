'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function PublicNavbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Platform', path: '/platform' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Industries', path: '/industries' },
    { name: 'Customers', path: '/customers' },
    { name: 'Resources', path: '/resources' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-outline-variant sticky top-0 z-50 w-full transition-all">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Branding Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-brand-accent rounded flex items-center justify-center text-white font-bold font-headline text-lg shadow-sm transition-transform group-hover:scale-105">
            EQ
          </div>
          <span className="font-headline text-xl font-extrabold text-primary tracking-tight">
            Econ-IQ
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`font-sans text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-brand-accent'
                    : 'text-outline hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/contact?type=demo"
            className="px-4 py-2 border border-brand-accent text-brand-accent font-sans font-bold text-xs uppercase tracking-wider rounded hover:bg-brand-accent/5 transition-colors"
          >
            Request Demo
          </Link>
          <Link
            href={isAuthenticated ? '/dashboard' : '/login'}
            className="px-4 py-2 bg-brand-accent text-white font-sans font-bold text-xs uppercase tracking-wider rounded hover:brightness-110 transition-colors shadow-sm"
          >
            {isAuthenticated ? 'Console' : 'Sign In'}
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-primary p-2 hover:bg-outline-variant/50 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-outline-variant px-6 py-6 space-y-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-sm font-bold text-outline hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="h-px bg-outline-variant my-4"></div>
          <div className="flex flex-col gap-3">
            <Link
              href="/contact?type=demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 border border-brand-accent text-brand-accent font-sans font-bold text-xs uppercase tracking-wider rounded"
            >
              Request Demo
            </Link>
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-brand-accent text-white font-sans font-bold text-xs uppercase tracking-wider rounded"
            >
              {isAuthenticated ? 'Go to Console' : 'Sign In'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
