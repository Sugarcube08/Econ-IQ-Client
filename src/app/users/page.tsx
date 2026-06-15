'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/auth';
import { normalizeUsers } from '@/lib/normalizers';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Table, { TableColumn } from '@/components/ui/Table';
import { 
  Plus, 
  UserMinus, 
  Search, 
  Building, 
  Shield, 
  Key, 
  History, 
  Send,
  Lock,
  UserCheck
} from 'lucide-react';

function UsersPageContent() {
  const { user: currentUser } = useAuth();
  const { orgProfile } = useOnboardingStore();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add User states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('ANALYST');
  const [addMsg, setAddMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await UserService.getUsers();
      // Normalize data contracts
      setUsers(normalizeUsers(res.data.users));
    } catch (e: unknown) {
      console.error('Failed to load users:', e);
      let errMsg = 'Unauthorized or failed user fetch.';
      if (e && typeof e === 'object' && 'response' in e) {
        const res = (e as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) errMsg = res.data.message;
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg(null);
    try {
      await UserService.createUser({
        email,
        full_name: fullName,
        role,
      });
      setAddMsg('Member invited successfully. Sync pending.');
      setEmail('');
      setFullName('');
      fetchUsers();
      setTimeout(() => setAddMsg(null), 4000);
    } catch (err: unknown) {
      let errMsg = 'Failed to create user account.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) errMsg = res.data.message;
      }
      setAddMsg(errMsg);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this analyst?')) return;
    try {
      await UserService.deleteUser(id);
      fetchUsers();
    } catch (err: unknown) {
      let errMsg = 'Failed to deactivate user.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) errMsg = res.data.message;
      }
      alert(errMsg);
    }
  };

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: TableColumn<User>[] = [
    {
      key: 'full_name',
      header: 'Full Name',
      sortable: false,
      pinned: true,
      width: 200,
      render: (u) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 uppercase text-xs">
            {u.full_name ? u.full_name[0] : 'U'}
          </div>
          <div>
            <span className="font-semibold text-slate-800 text-sm block">{u.full_name || '(Pending Setup)'}</span>
            <span className="text-[10px] text-slate-400 font-mono block">UID: {u.id.slice(0, 8)}</span>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email Address',
      sortable: false,
      width: 220,
      render: (u) => <span className="text-slate-600 font-sans text-xs">{u.email}</span>
    },
    {
      key: 'role',
      header: 'System Role',
      sortable: false,
      width: 140,
      render: (u) => (
        <Badge variant={u.role === 'SUPER_ADMIN' ? 'danger' : 'accent'} size="sm">
          {u.role.replace('_', ' ')}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      width: 100,
      render: (u) => (
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
          {u.is_active ? 'Active' : 'Suspended'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      sortable: false,
      align: 'right',
      width: 100,
      render: (u) => {
        if (currentUser?.role === 'SUPER_ADMIN' && u.id !== currentUser.id && u.is_active) {
          return (
            <Button
              onClick={() => handleDeactivate(u.id)}
              variant="secondary"
              size="sm"
              icon={UserMinus}
              title="Deactivate Account"
              className="hover:text-red-600 hover:border-red-200"
            >
              Suspend
            </Button>
          );
        }
        return null;
      }
    }
  ];

  const auditActivity = [
    { action: 'USER_LOGIN', user: currentUser?.email || 'admin@econiq.com', details: 'Authorized SSO Session Initiated', time: '10 mins ago' },
    { action: 'API_KEY_CREATED', user: 'admin@econiq.com', details: 'Generated production read key for NetSuite', time: '2 hours ago' },
    { action: 'MEMBER_INVITED', user: 'admin@econiq.com', details: 'Invited analyst@econiq.com to workspace', time: '1 day ago' },
    { action: 'LEDGER_SYNCED', user: 'SYSTEM', details: 'Postgres SQL connection pools re-verified', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200/60 pb-6">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-slate-800 tracking-tight">Organization & Team Center</h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Provision team seats, verify RBAC configuration access levels, and review organization parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Organization, Seats, Permissions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Org Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-teal-600 border-b border-slate-100 pb-3">
              <Building className="w-5 h-5" />
              <h3 className="font-headline text-base font-bold text-slate-800">Organization Profile</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100/50">
                <span className="text-slate-400">Name</span>
                <span className="font-semibold text-slate-800">{orgProfile?.name || 'Econ-IQ Primary Tenant'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100/50">
                <span className="text-slate-400">Industry</span>
                <span className="font-semibold text-slate-800">{orgProfile?.industry || 'Manufacturing & Steel'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100/50">
                <span className="text-slate-400">Ledger API Sync</span>
                <span className="font-semibold text-emerald-600">CONNECTED</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Workspace Seats</span>
                <span className="font-bold text-slate-800">{users.length} of 10 Occupied</span>
              </div>
            </div>
          </div>

          {/* Card 2: Permission Matrix summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-teal-600 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5" />
              <h3 className="font-headline text-base font-bold text-slate-800">System Access Matrix</h3>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>SUPER ADMIN</span>
                  <Badge variant="danger" size="sm">FULL CONTROL</Badge>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Can invite new users, provision developer keys, adjust credit approval levels, and modify system sync frequencies.
                </p>
              </div>
              <div className="border-t border-slate-100/80 pt-3">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>ANALYST</span>
                  <Badge variant="accent" size="sm">READ + ACTION</Badge>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Has view rights to the command center, reports, and credit scores. Can execute mitigation actions (e.g. tightening terms).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Directory, Invite form, Audits */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: User Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-800">Workspace User Directory</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Currently active credit intelligence analysts.</p>
              </div>
            </div>

            {/* Search and Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500/20"
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto ml-auto">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-teal-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admins</option>
                  <option value="ANALYST">Analysts</option>
                </select>
              </div>
            </div>

            {/* Directory Table */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
              <Table
                columns={columns}
                data={filteredUsers}
                isLoading={isLoading}
                isError={!!error}
                errorMessage={error || undefined}
                density="standard"
              />
            </div>
          </div>

          {/* Card 2: Invite User (Super Admin only) */}
          {currentUser?.role === 'SUPER_ADMIN' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-headline text-base font-bold text-slate-800">Invite Credit Analyst</h3>
                <p className="text-xs text-slate-400 mt-0.5">Provision immediate read-action access to a billing specialist.</p>
              </div>

              {addMsg && (
                <div className={`p-3 rounded-lg text-xs font-bold ${
                  addMsg.includes('successfully') 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {addMsg}
                </div>
              )}

              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-teal-500 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@econiq.com"
                    className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-teal-500 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">System Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="ANALYST">ANALYST</option>
                      <option value="SUPER_ADMIN">SUPER ADMIN</option>
                    </select>
                  </div>
                  <Button type="submit" variant="accent" icon={Send} className="h-[34px] px-4 cursor-pointer">
                    Invite
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Card 3: Audit Activity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-teal-600 border-b border-slate-100 pb-3">
              <History className="w-5 h-5" />
              <h3 className="font-headline text-base font-bold text-slate-800">Role Audit Logs</h3>
            </div>
            <div className="space-y-3 font-sans text-xs">
              {auditActivity.map((log, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="text-slate-400 text-[10px]">{log.user}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <RouteErrorBoundary routeName="Organization Users Center">
      <UsersPageContent />
    </RouteErrorBoundary>
  );
}
