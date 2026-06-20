'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import { ChevronRight, Plus } from 'lucide-react';

interface ProvisionedUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  status: 'Active' | 'Pending';
  createdAt: string;
}

export default function InviteTeamPage() {
  const { updateChecklistItem } = useOnboardingStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER'>('ANALYST');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [users, setUsers] = useState<ProvisionedUser[]>([
    {
      id: 'usr_1',
      fullName: 'Sarah Jenkins',
      email: 'creditoops@standardsteel.com',
      role: 'ADMIN',
      status: 'Pending',
      createdAt: '2026-06-12 14:30',
    },
    {
      id: 'usr_2',
      fullName: 'David Vance',
      email: 'systems@standardsteel.com',
      role: 'ADMIN',
      status: 'Active',
      createdAt: '2026-06-10 09:15',
    },
    {
      id: 'usr_3',
      fullName: 'Alex Carter',
      email: 'auditor.extern@consulting.com',
      role: 'ANALYST',
      status: 'Active',
      createdAt: '2026-05-28 11:00',
    },
  ]);

  const handleProvisionAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) return;

    setIsProvisioning(true);

    const newUser: ProvisionedUser = {
      id: 'usr_' + (Date.now() % 10000),
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setUsers([newUser, ...users]);
    setFullName('');
    setEmail('');
    setIsProvisioning(false);

    // Check off user provisioning checklist task in onboarding
    updateChecklistItem('firstUser', true);
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Full Name',
      render: (row: ProvisionedUser) => (
        <div>
          <span className="font-semibold text-on-surface block">{row.fullName}</span>
          <span className="text-[10px] text-outline">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row: ProvisionedUser) => (
        <Badge variant={row.role === 'ADMIN' ? 'accent' : row.role === 'ANALYST' ? 'secondary' : 'info'} size="sm">
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Provisioned Date',
      render: (row: ProvisionedUser) => <span className="text-outline">{row.createdAt}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right' as const,
      render: (row: ProvisionedUser) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'warning'} size="sm">
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-xl text-on-background font-sans">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-xs text-xs text-outline">
        <Link href="/organization" className="hover:underline">Organization</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-bold">Provision Access</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-headline text-3xl font-semibold text-primary">Provision User Access</h2>
          <p className="text-sm text-outline mt-1">
            Instantly create profiles and assign system roles for corporate analysts, managers, and administrators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Provision Form */}
        <div className="lg:col-span-5 bg-surface border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm h-fit space-y-6">
          <h3 className="font-headline text-base font-bold text-primary">Provision Account Access</h3>
          
          <form onSubmit={handleProvisionAccess} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              required
            />

            <Input
              label="Corporate Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />

            <Select
              label="Assign Authority Role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'ANALYST' | 'VIEWER')}
              options={[
                { value: 'ANALYST', label: 'ANALYST (Read-only ledger analytics)' },
                { value: 'ADMIN', label: 'ADMIN (Full billing & credential control)' },
                { value: 'VIEWER', label: 'VIEWER (Read-only profile status)' },
              ]}
            />

            <Button
              type="submit"
              isLoading={isProvisioning}
              icon={Plus}
              variant="accent"
              className="w-full"
            >
              {isProvisioning ? 'Provisioning...' : 'Grant Platform Access'}
            </Button>
          </form>

          <div className="p-3 bg-background rounded border border-outline-variant text-[10px] text-outline leading-relaxed">
            Direct provisioning creates the user profile immediately in the backend database. The user will be authorized to access the system using their corporate email and secure OTP verification on their next visit.
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-7 bg-surface border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-headline text-base font-bold text-primary">Platform Access registry</h3>
          
          <Table
            columns={columns}
            data={users}
            density="standard"
          />
        </div>
      </div>
    </div>
  );
}
