'use client';

import React, { useState, useEffect } from 'react';
import { ApiKeyService } from '@/services/apikey.service';
import { APIKey } from '@/types/auth';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Creation states
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [readIntel, setReadIntel] = useState(true);
  const [createApiKey, setCreateApiKey] = useState(false);
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [addMsg, setAddMsg] = useState<string | null>(null);

  const fetchKeys = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiKeyService.getApiKeys();
      setKeys(res.data || []);
    } catch (e: any) {
      console.error('Failed to load API keys:', e);
      setError(e.response?.data?.message || 'Failed to load developer keys.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg(null);
    setNewRawKey(null);

    const scopes = [];
    if (readIntel) scopes.push('Permission.INTEL_READ');
    if (createApiKey) scopes.push('Permission.API_KEY_CREATE');

    if (scopes.length === 0) {
      setAddMsg('Please select at least one permission scope.');
      return;
    }

    try {
      const res = await ApiKeyService.createApiKey({ name, scopes });
      setNewRawKey(res.data.raw_key || null);
      setAddMsg('Key created successfully. Copy the raw key secret now as it will not be shown again!');
      setName('');
      fetchKeys();
    } catch (err: any) {
      setAddMsg(err.response?.data?.message || 'Failed to generate API key.');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action is immediate.')) return;
    try {
      await ApiKeyService.revokeApiKey(id);
      fetchKeys();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to revoke key.');
    }
  };

  return (
    <div className="space-y-xl">
      <div>
        <h2 className="text-3xl font-headline font-semibold text-primary">API Key Management</h2>
        <p className="text-sm font-sans text-outline mt-1">
          Issue and manage cryptographic tokens to authorize external integrations with Econiq engines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Creator form */}
        <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-sm h-fit space-y-md">
          <h3 className="font-headline text-base font-bold text-primary">Issue Developer Credentials</h3>
          
          {addMsg && (
            <div className={`p-md rounded text-xs font-semibold ${
              addMsg.includes('successfully') ? 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent' : 'bg-error-container/20 border border-error/50 text-error'
            }`}>
              {addMsg}
            </div>
          )}

          {newRawKey && (
            <div className="p-md rounded bg-[#243447] text-white space-y-sm font-mono text-[11px] break-all">
              <span className="font-bold text-brand-gold">RAW SECRET KEY:</span>
              <p className="select-all p-xs bg-[#181c1f] rounded text-[#80d5cb] border border-outline-variant/30">
                {newRawKey}
              </p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-md text-xs font-sans">
            <div className="space-y-1">
              <label className="text-outline">Key Description Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ERP Ingestion Service"
                className="w-full bg-surface border border-outline-variant px-3 py-1.5 rounded"
              />
            </div>
            
            <div className="space-y-sm">
              <label className="text-outline uppercase tracking-wider block">Authorized Scopes</label>
              
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={readIntel}
                  onChange={(e) => setReadIntel(e.target.checked)}
                  className="rounded border-outline-variant"
                />
                Read Intelligence (INTEL_READ)
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={createApiKey}
                  onChange={(e) => setCreateApiKey(e.target.checked)}
                  className="rounded border-outline-variant"
                />
                Issue API Keys (API_KEY_CREATE)
              </label>
            </div>

            <button type="submit" className="w-full h-10 bg-[#0F766E] text-white font-bold rounded hover:brightness-110">
              Generate Key
            </button>
          </form>
        </div>

        {/* Existing keys table */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="p-md border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-headline text-sm font-bold text-primary">Registered API Keys</h3>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-xs text-outline font-sans">Loading credentials store...</div>
          ) : error ? (
            <div className="py-16 text-center text-xs text-error font-sans">{error}</div>
          ) : keys.length === 0 ? (
            <div className="py-16 text-center text-xs text-outline font-sans">No API credentials generated.</div>
          ) : (
            <div className="divide-y divide-outline-variant/30">
              {keys.map((k) => (
                <div key={k.id} className="p-md flex justify-between items-center hover:bg-surface-container-low transition-colors">
                  <div className="space-y-1">
                    <h4 className="font-sans text-xs font-bold text-primary">{k.name}</h4>
                    <div className="flex gap-sm text-[10px] text-outline font-mono">
                      <span>Prefix: {k.key_prefix}</span>
                      <span>•</span>
                      <span>Created: {new Date(k.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${
                      k.is_active ? 'text-brand-accent bg-brand-accent/10 border-brand-accent/30' : 'text-error bg-error/10 border-error/30'
                    }`}>
                      {k.is_active ? 'Active' : 'Revoked'}
                    </span>
                    {k.is_active && (
                      <button
                        onClick={() => handleRevoke(k.id)}
                        className="p-1 hover:text-error transition-colors flex items-center justify-center cursor-pointer"
                        title="Revoke Access"
                      >
                        <span className="material-symbols-outlined text-[18px]">block</span>
                      </button>
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
