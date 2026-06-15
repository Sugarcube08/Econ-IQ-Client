'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import {
  LayoutDashboard,
  Users,
  Layers,
  AlertTriangle,
  Flame,
  Zap,
  Briefcase,
  Clock,
  PieChart,
  TrendingUp,
  DollarSign,
  Network,
  User as UserIcon,
  Key,
  Settings,
  LogOut,
  ChevronsUpDown,
  Plus
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  
  // Multi-org store hooks
  const {
    organizations,
    activeOrgId,
    switchOrganization,
    addOrganization
  } = useOnboardingStore();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || { id: 'org_default', name: 'Primary Organization' };

  const handleCreateOrg = () => {
    const name = prompt('Enter new organization name:');
    if (name && name.trim()) {
      addOrganization(name.trim());
      setOrgDropdownOpen(false);
    }
  };

  const formattedName = user?.full_name || user?.email || 'J. Sterling';
  const roleLabel = user ? user.role.replace('_', ' ') : 'CFO';

  // Structured navigation categories matching the Mandate
  const navigationGroups = [
    {
      title: 'Operating System',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Customer Directory',
      items: [
        { name: 'All Customers', path: '/customers', icon: Users },
      ]
    },
    {
      title: 'Intelligence Engine',
      items: [
        { name: 'Alerts Feed', path: '/intelligence/alerts', icon: AlertTriangle },
        { name: 'Risk Signals', path: '/intelligence/risk-signals', icon: Flame },
        { name: 'Opportunities', path: '/intelligence/opportunities', icon: Zap },
      ]
    },
    {
      title: 'Receivables Control',
      items: [
        { name: 'Collection Queue', path: '/collections/queue', icon: Briefcase },
        { name: 'Overdue Analysis', path: '/collections/overdue', icon: Clock },
      ]
    },
    {
      title: 'Analytics Suite',
      items: [
        { name: 'Risk Analytics', path: '/analytics/risk', icon: PieChart },
        { name: 'Growth Analytics', path: '/analytics/growth', icon: TrendingUp },
        { name: 'Payment Analytics', path: '/analytics/payments', icon: DollarSign },
      ]
    },
    {
      title: 'Administration',
      items: [
        { name: 'Integrations', path: '/organization', icon: Network },
        { name: 'Team Access', path: '/users', icon: UserIcon },
        { name: 'Developer Keys', path: '/api-keys', icon: Key },
        { name: 'System Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <nav className="hidden md:flex bg-primary-container fixed left-0 top-0 h-full w-sidebar-width flex-col z-50 border-r border-[#3e4947]/30 text-on-primary-container bg-[#1c2023]">
      
      {/* Dynamic Organization Switcher */}
      <div className="relative border-b border-[#3e4947]/20 p-md">
        <button
          onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
          className="w-full flex items-center justify-between gap-sm p-sm rounded hover:bg-white/5 transition-all text-left cursor-pointer bg-transparent border-0"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-[#0F766E] rounded flex items-center justify-center text-white font-bold font-headline text-md shrink-0">
              {activeOrg.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden leading-none text-xs">
              <span className="font-headline font-bold text-white block truncate">{activeOrg.name}</span>
              <span className="text-[9px] font-sans text-on-primary-container/60 mt-1 uppercase tracking-wider block">Switcher</span>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-on-primary-container/60 shrink-0" />
        </button>

        {/* Switcher Dropdown */}
        {orgDropdownOpen && (
          <div className="absolute top-full left-4 right-4 bg-[#101417] border border-[#3e4947] rounded-lg mt-1 p-2 space-y-1 z-50 shadow-xl font-sans text-xs text-white">
            <span className="text-[9px] text-[#889391] uppercase tracking-wider font-bold block px-2 py-1 border-b border-[#3e4947]/40 mb-1">
              Select Workspace
            </span>
            <div className="max-h-32 overflow-y-auto space-y-0.5">
              {organizations.map((org) => {
                const isSelected = org.id === activeOrg.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => {
                      switchOrganization(org.id);
                      setOrgDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer border-0 bg-transparent text-white"
                  >
                    <span className={`truncate ${isSelected ? 'font-bold text-[#80d5cb]' : 'text-[#889391]'}`}>
                      {org.name}
                    </span>
                    {isSelected && (
                      <span className="text-[#80d5cb] font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-[#3e4947]/40 pt-1 mt-1">
              <button
                onClick={handleCreateOrg}
                className="w-full text-left p-2 text-[#80d5cb] hover:bg-white/5 transition-colors flex items-center gap-2 font-bold cursor-pointer border-0 bg-transparent text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                New Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Menu Tabs Grouped */}
      <div className="flex-1 flex flex-col gap-sm py-md overflow-y-auto select-none">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <div className="px-lg pt-2 pb-1 text-[9px] uppercase font-bold text-on-primary-container/40 tracking-widest font-sans">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-3 px-lg py-2 mx-sm rounded-md transition-all duration-150 ${
                      isActive
                        ? 'border-l-4 border-[#80d5cb] text-white bg-white/5 font-bold scale-[0.98]'
                        : 'text-on-primary-container/60 hover:bg-white/5 hover:text-white hover:scale-[0.98]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#80d5cb]' : 'text-on-primary-container/40'}`} />
                    <span className="font-sans text-xs tracking-wide">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Profile Menu Footer */}
      <div className="mt-auto px-md py-md border-t border-outline-variant/10 space-y-2 bg-[#171a1d]">
        <div className="flex items-center gap-3 px-sm">
          <div className="w-8 h-8 rounded-full border border-[#3e4947] bg-[#0F766E]/20 text-[#80d5cb] flex items-center justify-center font-bold text-xs uppercase">
            {formattedName.slice(0, 2)}
          </div>
          <div className="overflow-hidden leading-none text-xs">
            <span className="font-sans font-bold text-xs text-white block truncate">{formattedName}</span>
            <span className="text-[9px] font-sans text-on-primary-container/60 uppercase mt-1 block">{roleLabel}</span>
          </div>
        </div>

        <button
          onClick={() => logout.mutate()}
          className="w-full text-left text-on-primary-container/70 flex items-center gap-md px-lg py-md hover:bg-white/5 hover:text-white rounded-lg transition-all duration-150 cursor-pointer bg-transparent border-0"
        >
          <LogOut className="w-4 h-4 shrink-0 text-on-primary-container/40" />
          <span className="font-sans text-xs">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
