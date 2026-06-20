'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  RefreshCw,
  Plus,
  User,
  Menu,
  ChevronDown,
  FileText,
  UserPlus,
  Layers,
  Database
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { organizations, activeOrgId, updateChecklistItem } = useOnboardingStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || { name: 'Primary Workspace' };
  const formattedName = user?.full_name || user?.email || 'J. Sterling';
  const roleLabel = user ? user.role.replace('_', ' ') : 'CFO';

  const handleManualSync = async () => {
    setIsSyncing(true);
    updateChecklistItem('firstSync', true);
    setIsSyncing(false);
    setQuickActionsOpen(false);
  };

  const handleQuickAction = (path: string) => {
    setQuickActionsOpen(false);
    router.push(path);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm select-none">
      
      {/* Left zone: Menu toggle (mobile), Org Context, Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 hover:bg-slate-100 rounded-md md:hidden text-slate-600 cursor-pointer bg-transparent border-0 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Organization / Workspace Context */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-lg text-xs font-semibold text-teal-800 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
          <span className="truncate max-w-[120px]">{activeOrg.name}</span>
        </div>

        {/* Global Search */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-teal-600 focus-within:border-teal-600 focus-within:bg-white transition-all w-full max-w-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search accounts, ledgers, events..."
            className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs text-slate-800 w-full py-0 px-2 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right zone: Sync status, Quick Actions, Notifications, User Account */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Data Sync Status Button */}
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin text-teal-600' : ''}`} />
          <span>
            {isSyncing ? 'Syncing ERP...' : 'Sync Ledger'}
          </span>
        </button>

        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer shadow-sm border-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Actions</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {quickActionsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-55 p-2 space-y-0.5 font-sans text-xs text-slate-800">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block px-2.5 py-1.5 border-b border-slate-100 mb-1">
                Quick Platform Actions
              </span>
              
              <button
                onClick={() => handleQuickAction('/customers')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-slate-700 cursor-pointer bg-transparent border-0 text-xs"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                Customer Directory
              </button>
              
              <button
                onClick={() => handleQuickAction('/organization/users/invite')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-slate-700 cursor-pointer bg-transparent border-0 text-xs"
              >
                <UserPlus className="w-4 h-4 text-slate-400" />
                Invite Team Member
              </button>

              <button
                onClick={() => handleQuickAction('/reports')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-slate-700 cursor-pointer bg-transparent border-0 text-xs"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                Export Reports
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center gap-2.5 text-slate-700 cursor-pointer bg-transparent border-0 text-xs disabled:opacity-50"
              >
                <Database className="w-4 h-4 text-teal-600" />
                <span>{isSyncing ? 'Syncing...' : 'Sync ERP Ingestion'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200"></div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer bg-transparent border-0"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600 rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-2xl z-55 p-4 space-y-3 text-xs font-sans text-slate-700">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <span className="font-bold text-slate-900">Priority Alerts Feed</span>
                <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-100">2 Vitals</span>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                    <span>Repayment Delay Alert</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Standard Steel Castings DSO exceeded 45 days. High liquidity stress.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Limits Optimization</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Metals Trading qualified for credit limit upsell based on payment score.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer bg-transparent border-0"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCGchDSEakrKOcETei73KAXiI49lgoozHkL8iexvK7aI3FQ4gIoRSJLEvcqkdVoayqudYGmq-5M-oeXThlhltVEf4_c1nR21R8oLbuANpgPpRF0QUZ2ViJb04im9ySAgK_JaEbEs9hoynV6B1BtJEflHux_G22gWdmEY66-VM721fw4feylDJpQo0VN3fRouxDcEz7EIwpNQewTerTsGsTCNndbBN-I4aAO1xSce_YXsZd9aBIns-lp14q5EMQBieVjWYUbjF3slw"
              alt="User profile"
              className="w-7 h-7 rounded-full border border-slate-200 object-cover"
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-55 p-2 space-y-0.5 font-sans text-xs text-slate-800">
              <div className="px-3 py-2 border-b border-slate-100 leading-none mb-1">
                <span className="font-bold text-slate-900 block truncate">{formattedName}</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mt-1">{roleLabel}</span>
              </div>
              <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-950 transition-colors">
                <User className="w-3.5 h-3.5" /> Account Details
              </Link>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
