'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

interface Invitation {
  id: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Analyst';
  status: 'Pending' | 'Accepted' | 'Expired';
  sentAt: string;
}

export default function InviteTeamPage() {
  const { updateChecklistItem } = useOnboardingStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager' | 'Analyst'>('Analyst');
  const [isSending, setIsSending] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 'inv_1',
      email: 'creditoops@standardsteel.com',
      role: 'Manager',
      status: 'Pending',
      sentAt: '2026-06-12 14:30',
    },
    {
      id: 'inv_2',
      email: 'systems@standardsteel.com',
      role: 'Admin',
      status: 'Accepted',
      sentAt: '2026-06-10 09:15',
    },
    {
      id: 'inv_3',
      email: 'auditor.extern@consulting.com',
      role: 'Analyst',
      status: 'Expired',
      sentAt: '2026-05-28 11:00',
    },
  ]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSending(true);
    // Simulate sending invite
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newInvite: Invitation = {
      id: 'inv_' + Math.floor(Math.random() * 10000),
      email: email.trim(),
      role,
      status: 'Pending',
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setInvitations([newInvite, ...invitations]);
    setEmail('');
    setIsSending(false);

    // Check off user provisioning checklist task
    updateChecklistItem('firstUser', true);
  };

  const getStatusBadge = (status: Invitation['status']) => {
    switch (status) {
      case 'Accepted':
        return 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent';
      case 'Pending':
        return 'bg-brand-gold/10 border-brand-gold/30 text-[#c8a96b] animate-pulse';
      case 'Expired':
        return 'bg-error/10 border-error/30 text-error';
    }
  };

  return (
    <div className="space-y-xl text-[#243447] font-sans">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-xs text-xs text-outline">
        <Link href="/organization" className="hover:underline">Organization</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary font-bold">Team Invitations</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-headline text-3xl font-semibold text-primary">Invite Team Members</h2>
          <p className="text-sm text-outline mt-1">
            Provision user access keys and scopes for analysts, risk managers, and admins.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Invite Form */}
        <div className="lg:col-span-5 bg-white border border-[#E3E2DF] rounded-xl p-6 md:p-8 shadow-sm h-fit space-y-6">
          <h3 className="font-headline text-base font-bold text-primary">Provision Invite Key</h3>
          
          <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#5E6266] uppercase block">Corporate Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none focus:border-[#0F766E] text-[#243447]"
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#5E6266] uppercase block">Assign Authority Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#FAF9F6] border border-[#E3E2DF] rounded p-3 text-sm focus:outline-none focus:border-[#0F766E] text-[#243447]"
              >
                <option value="Analyst">Risk Analyst (Read-only ledger access)</option>
                <option value="Manager">Credit Manager (Adjusts limits & settings)</option>
                <option value="Admin">Administrator (Full billing & keys control)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-[#0F766E] text-white font-semibold uppercase tracking-wider rounded hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSending ? 'Sending Key...' : 'Send Access Key'}
            </button>
          </form>

          <div className="p-3 bg-[#FAF9F6] rounded border border-[#E3E2DF] text-[10px] text-outline leading-relaxed">
            Invitations generate a unique, cryptographically signed passkey link sent directly to the email. Passkeys expire automatically after 7 days if unredeemed.
          </div>
        </div>

        {/* Invite List */}
        <div className="lg:col-span-7 bg-white border border-[#E3E2DF] rounded-xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-headline text-base font-bold text-primary">Pending & Accepted Passes</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-[#E3E2DF] text-outline uppercase tracking-wider text-[10px] font-bold">
                  <th className="pb-3">User Email</th>
                  <th className="pb-3">Assigned Role</th>
                  <th className="pb-3">Sent Timestamp</th>
                  <th className="pb-3 text-right">Pass Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E2DF]/40 text-primary">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td className="py-3 font-semibold">{inv.email}</td>
                    <td className="py-3">{inv.role}</td>
                    <td className="py-3 text-outline">{inv.sentAt}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadge(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
