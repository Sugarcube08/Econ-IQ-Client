import { create } from 'zustand';
import { User } from '@/types/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, refreshToken: string, user: User) => void;
  updateAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Safe retrieval from localStorage in client environment
  let savedRefreshToken: string | null = null;
  if (typeof window !== 'undefined') {
    savedRefreshToken = localStorage.getItem('econ_refresh_token');
  }

  return {
    accessToken: null,
    refreshToken: savedRefreshToken,
    user: null,
    isAuthenticated: false,

    setSession: (accessToken, refreshToken, user) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('econ_refresh_token', refreshToken);
      }
      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
      });
    },

    updateAccessToken: (accessToken) => {
      set({ accessToken });
    },

    clearSession: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('econ_refresh_token');
      }
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      });
    },
  };
});
