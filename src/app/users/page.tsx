'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { Plus, UserMinus } from 'lucide-react';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add User states
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('ANALYST');
  const [addMsg, setAddMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await UserService.getUsers();
      setUsers(res.data.users || []);
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
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
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
      setAddMsg('User created successfully.');
      setEmail('');
      setFullName('');
      fetchUsers();
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

  return (
    <div className="space-y-xl">
      <div>
        <h2 className="text-3xl font-headline font-semibold text-primary">User Directory</h2>
        <p className="text-sm font-sans text-outline mt-1">
          Manage system analysts and administrators with access to command center telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Current User Session Profile */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm h-fit space-y-md">
          <h3 className="font-headline text-base font-bold text-primary">Active Analyst Session</h3>
          {currentUser ? (
            <div className="space-y-sm text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Email Address</span>
                <span className="font-semibold text-primary">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Full Name</span>
                <span className="font-semibold text-primary">
                  {currentUser.full_name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">System Role</span>
                <span className="font-semibold text-brand-accent uppercase">{currentUser.role}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-outline">Loading active analyst credentials...</p>
          )}
        </div>

        {/* Users list and controls */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h3 className="font-headline text-sm font-bold text-primary">Authorized Analysts</h3>
            {currentUser?.role === 'SUPER_ADMIN' && (
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant="accent"
                size="sm"
                icon={Plus}
              >
                New Analyst
              </Button>
            )}
          </div>

          {/* New user form */}
          {showAddForm && (
            <form onSubmit={handleAddUser} className="p-lg bg-surface-container-low border-b border-outline-variant space-y-md text-xs font-sans">
              <h4 className="font-bold text-primary uppercase">Provision New Access</h4>
              {addMsg && (
                <div className={`p-md rounded ${addMsg.includes('success') ? 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent' : 'bg-error-container/20 border border-error/50 text-error'}`}>
                  {addMsg}
                </div>
              )}
              <Input
                label="Full Name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@econiq.com"
              />
              <Select
                label="User Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: 'ANALYST', label: 'ANALYST' },
                  { value: 'SUPER_ADMIN', label: 'SUPER ADMIN' },
                ]}
              />
              <Button type="submit" variant="accent" size="sm">
                Create Account
              </Button>
            </form>
          )}

          {isLoading ? (
            <div className="py-16 text-center text-xs text-outline">Loading database catalog...</div>
          ) : error ? (
            <div className="py-16 text-center text-xs text-error">{error}</div>
          ) : (
            <div className="divide-y divide-outline-variant/30">
              {users.map((u) => (
                <div key={u.id} className="p-md flex justify-between items-center hover:bg-surface-container-low transition-colors">
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">
                      {u.full_name || '(Pending Setup)'}
                    </h4>
                    <span className="text-[10px] text-outline">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-md">
                    <Badge
                      variant={u.is_active ? 'accent' : 'danger'}
                      size="sm"
                    >
                      {u.role.replace('_', ' ')}
                    </Badge>
                    {currentUser?.role === 'SUPER_ADMIN' && u.id !== currentUser.id && u.is_active && (
                      <Button
                        onClick={() => handleDeactivate(u.id)}
                        variant="secondary"
                        size="sm"
                        icon={UserMinus}
                        title="Deactivate Account"
                        className="w-8 h-8 p-0"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
