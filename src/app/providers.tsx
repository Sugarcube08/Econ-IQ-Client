'use client';

import React, { useEffect, useState } from 'react';
import QueryProvider from '@/providers/query-provider';
import { useAuthStore } from '@/stores/useAuthStore';
import { AuthService } from '@/services/auth.service';

// Cache the session recovery promise at module level to prevent concurrent duplicate calls during Strict Mode double-mounts
let initSessionPromise: Promise<{ access_token: string; refresh_token: string; user: any } | null> | null = null;

export default function Providers({ children }: { children: React.ReactNode }) {
  const { setSession, clearSession } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initSession() {
      const savedRefreshToken = localStorage.getItem('econ_refresh_token');
      if (savedRefreshToken) {
        try {
          if (!initSessionPromise) {
            initSessionPromise = (async () => {
              // Attempt silent session recovery
              const res = await AuthService.refresh(savedRefreshToken);
              const { access_token, refresh_token } = res.data;
              
              // To fetch /me we need access_token in state, let's temporarily save it
              useAuthStore.getState().updateAccessToken(access_token);
              const userRes = await AuthService.getMe();
              
              return { access_token, refresh_token, user: userRes.data };
            })().catch((err) => {
              initSessionPromise = null; // Clear on error so retries can occur
              throw err;
            });
          }

          const sessionData = await initSessionPromise;
          if (sessionData) {
            const { access_token, refresh_token, user } = sessionData;
            setSession(access_token, refresh_token, user);
          }
        } catch (e) {
          console.error('Failed to recover session:', e);
          clearSession();
        }
      }
      setIsInitialized(true);
    }
    initSession();
  }, [setSession, clearSession]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#101417] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#80d5cb] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-sans text-sm text-[#bdc9c6] tracking-wide">Initializing Command Center...</p>
        </div>
      </div>
    );
  }

  return <QueryProvider>{children}</QueryProvider>;
}
