import { apiClient } from '@/lib/axios';
import { User } from '@/types/auth';
import { StandardResponse } from '@/types/response';

export const UserService = {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
    search?: string;
    role?: string;
    is_active?: boolean;
  }): Promise<StandardResponse<{ users: User[] }>> {
    const res = await apiClient.get<StandardResponse<{ users: User[] }>>('/users', { params });
    return res.data;
  },

  async createUser(data: {
    email: string;
    full_name: string;
    role: string;
  }): Promise<StandardResponse<User>> {
    const res = await apiClient.post<StandardResponse<User>>('/users', data);
    return res.data;
  },

  async getUser(id: string): Promise<StandardResponse<User>> {
    const res = await apiClient.get<StandardResponse<User>>(`/users/${id}`);
    return res.data;
  },

  async updateUser(
    id: string,
    data: { full_name?: string; role?: string; is_active?: boolean }
  ): Promise<StandardResponse<User>> {
    const res = await apiClient.patch<StandardResponse<User>>(`/users/${id}`, data);
    return res.data;
  },

  async deleteUser(id: string): Promise<StandardResponse<{ user_id: string }>> {
    const res = await apiClient.delete<StandardResponse<{ user_id: string }>>(`/users/${id}`);
    return res.data;
  },
};
