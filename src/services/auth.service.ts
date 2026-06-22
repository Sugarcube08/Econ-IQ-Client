import { apiClient } from '@/lib/axios';
import { TokenResponse, User } from '@/types/auth';
import { StandardResponse } from '@/types/response';

export const AuthService = {
  async requestOtp(email: string): Promise<StandardResponse<{ email: string }>> {
    const res = await apiClient.post<StandardResponse<{ email: string }>>('/auth/request-otp', { email });
    return res.data;
  },

  async verifyOtp(
    email: string,
    otp: string,
    deviceId?: string
  ): Promise<StandardResponse<TokenResponse>> {
    const res = await apiClient.post<StandardResponse<TokenResponse>>('/auth/verify-otp', {
      email,
      otp,
      device_id: deviceId,
    });
    return res.data;
  },

  async refresh(refreshToken: string, deviceId?: string): Promise<StandardResponse<TokenResponse>> {
    const res = await apiClient.post<StandardResponse<TokenResponse>>('/auth/refresh', {
      refresh_token: refreshToken,
      device_id: deviceId,
    });
    return res.data;
  },

  async logout(): Promise<StandardResponse<null>> {
    const res = await apiClient.get<StandardResponse<null>>('/auth/logout');
    return res.data;
  },

  async getMe(): Promise<StandardResponse<User>> {
    const res = await apiClient.get<StandardResponse<User>>('/auth/me');
    return res.data;
  },
};
