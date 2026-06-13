'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Customers', path: '/customers', icon: 'groups' },
    { name: 'Reports', path: '/reports', icon: 'bar_chart' },
    { name: 'Users', path: '/users', icon: 'person' },
    { name: 'API Keys', path: '/api-keys', icon: 'key' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  return (
    <nav className="hidden md:flex bg-primary-container fixed left-0 top-0 h-full w-sidebar-width flex-col z-50 border-r border-outline-variant text-on-primary-container">
      {/* Branding */}
      <div className="flex items-center gap-md px-lg py-xl">
        <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center text-white font-bold font-headline text-lg">
          EQ
        </div>
        <div>
          <h1 className="text-headline font-bold text-white leading-none text-lg">Econ-IQ</h1>
          <span className="text-[11px] font-sans text-on-primary-container">Enterprise Intelligence</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col gap-xs px-sm py-md overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-md px-lg py-md rounded-lg mx-sm transition-all duration-200 ${
                isActive
                  ? 'border-l-4 border-brand-accent text-white bg-secondary/30 font-bold scale-[0.98]'
                  : 'text-on-primary-container/70 hover:bg-primary/20 hover:text-white hover:scale-[0.98]'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>
                {item.icon}
              </span>
              <span className="font-sans text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="mt-auto px-sm py-md border-t border-outline-variant/20">
        <button
          onClick={() => logout.mutate()}
          className="w-full text-left text-on-primary-container/70 flex items-center gap-md px-lg py-md hover:bg-primary/20 hover:text-white rounded-lg mx-sm transition-all duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-sans text-sm">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
