import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { setSession, clearSession, accessToken, user, isAuthenticated } = useAuthStore();

  // 1. Request OTP
  const requestOtp = useMutation({
    mutationFn: (email: string) => AuthService.requestOtp(email),
  });

  // 2. Verify OTP & Authenticate
  const verifyOtp = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const res = await AuthService.verifyOtp(email, otp);
      const { access_token, refresh_token } = res.data;

      // Temporary token swap to get current user details
      const prevToken = useAuthStore.getState().accessToken;
      useAuthStore.getState().updateAccessToken(access_token);

      try {
        const userRes = await AuthService.getMe();
        setSession(access_token, refresh_token, userRes.data);
        return { token: res.data, user: userRes.data };
      } catch (err) {
        useAuthStore.getState().updateAccessToken(prevToken || '');
        throw err;
      }
    },
  });

  // 3. Get Current User Info
  const userProfile = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => AuthService.getMe().then((res) => res.data),
    enabled: isAuthenticated && !!accessToken,
  });

  // 4. Logout
  const logout = useMutation({
    mutationFn: async () => {
      try {
        await AuthService.logout();
      } catch (e) {
        console.error('Logout error on server:', e);
      }
      clearSession();
      router.push('/login');
    },
  });

  return {
    requestOtp,
    verifyOtp,
    userProfile,
    logout,
    user,
    isAuthenticated,
  };
}
