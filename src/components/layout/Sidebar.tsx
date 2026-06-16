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
  Settings as SettingsIcon,
  LogOut,
  ChevronsUpDown,
  Plus,
  X,
  Sliders
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  
  const {
    organizations,
    activeOrgId,
    switchOrganization,
    addOrganization
  } = useOnboardingStore();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || { id: 'org_default', name: 'Primary Organization' };
  const formattedName = user?.full_name || user?.email || 'J. Sterling';
  const roleLabel = user ? user.role.replace('_', ' ') : 'CFO';

  const handleCreateOrg = () => {
    const name = prompt('Enter new organization name:');
    if (name && name.trim()) {
      addOrganization(name.trim());
      setOrgDropdownOpen(false);
    }
  };

  const navigationGroups = [
    {
      title: 'Operating System',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Alerts Center', path: '/operations/alerts', icon: AlertTriangle },
        { name: 'Collections Center', path: '/operations/collections', icon: Briefcase },
        { name: 'Decisions Center', path: '/operations/decisions', icon: Sliders },
      ]
    },
    {
      title: 'Customers',
      items: [
        { name: 'All Customers', path: '/customers', icon: Users },
        { name: 'Segments', path: '/customers/segments', icon: Layers },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { name: 'Risk Signals', path: '/intelligence/risk-signals', icon: Flame },
        { name: 'Opportunities', path: '/intelligence/opportunities', icon: Zap },
      ]
    },
    {
      title: 'Analytics',
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
        { name: 'Team', path: '/users', icon: UserIcon },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <aside className={`w-52 bg-slate-950 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 text-slate-300 z-50 select-none transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header with Org Switcher */}
        <div className="relative border-b border-slate-800 p-4 shrink-0 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="w-full flex items-center justify-between gap-3 p-1.5 rounded-lg hover:bg-slate-900 transition-all text-left cursor-pointer bg-transparent border-0"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 bg-teal-700 rounded-md flex items-center justify-center text-white font-bold font-headline text-xs shrink-0 shadow-inner">
                  {activeOrg.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden leading-tight">
                  <span className="font-headline font-bold text-xs text-white block truncate">{activeOrg.name}</span>
                  <span className="text-[9px] font-sans text-slate-400 font-medium tracking-wider uppercase block">Workspace</span>
                </div>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Mobile Close Button */}
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded-md md:hidden ml-2 cursor-pointer bg-transparent border-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {orgDropdownOpen && (
            <div className="absolute top-full left-4 right-4 bg-slate-900 border border-slate-800 rounded-xl mt-1.5 p-2 space-y-1.5 z-55 shadow-2xl font-sans text-xs text-slate-200">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block px-2.5 py-1.5 border-b border-slate-800 mb-1">
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
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer border-0 bg-transparent text-slate-200"
                    >
                      <span className={`truncate ${isSelected ? 'font-bold text-teal-400' : 'text-slate-300'}`}>
                        {org.name}
                      </span>
                      {isSelected && <span className="text-teal-400 font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-slate-800 pt-1.5 mt-1.5">
                <button
                  onClick={handleCreateOrg}
                  className="w-full text-left p-2 text-teal-400 hover:bg-slate-800 transition-colors flex items-center gap-2 font-bold cursor-pointer border-0 bg-transparent text-xs rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-grow overflow-y-auto py-4 space-y-4 px-3 custom-scrollbar">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="px-3 text-[9px] uppercase font-bold text-slate-500 tracking-widest block font-sans">
                {group.title}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.path === '/customers'
                    ? pathname === '/customers'
                    : pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path + '/'));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group ${
                        isActive
                          ? 'bg-teal-950/40 text-teal-400 font-bold border-l-2 border-teal-500 pl-2.5'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`} />
                      <span className="font-sans text-xs tracking-wide">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Account / Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-2 rounded-lg hover:bg-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-full border border-slate-800 bg-teal-950/30 text-teal-400 flex items-center justify-center font-semibold text-xs uppercase shrink-0">
              {formattedName.slice(0, 2)}
            </div>
            <div className="overflow-hidden leading-tight">
              <span className="font-sans font-bold text-xs text-white block truncate">{formattedName}</span>
              <span className="text-[9px] font-sans text-slate-400 uppercase mt-0.5 block">{roleLabel}</span>
            </div>
          </div>

          <button
            onClick={() => logout.mutate()}
            className="w-full text-left text-slate-400 hover:text-white flex items-center gap-3 px-2.5 py-2 hover:bg-slate-900 rounded-lg transition-all duration-150 cursor-pointer bg-transparent border-0"
          >
            <LogOut className="w-4 h-4 shrink-0 text-slate-500" />
            <span className="font-sans text-xs">Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
}
