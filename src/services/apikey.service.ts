import { apiClient } from '@/lib/axios';
import { APIKey } from '@/types/auth';
import { StandardResponse } from '@/types/response';

export const ApiKeyService = {
  async getApiKeys(): Promise<StandardResponse<APIKey[]>> {
    const res = await apiClient.get<StandardResponse<APIKey[]>>('/api-keys');
    return res.data;
  },

  async createApiKey(data: { name: string; scopes: string[] }): Promise<StandardResponse<APIKey>> {
    const res = await apiClient.post<StandardResponse<APIKey>>('/api-keys', data);
    return res.data;
  },

  async revokeApiKey(id: string): Promise<StandardResponse<null>> {
    const res = await apiClient.delete<StandardResponse<null>>(`/api-keys/${id}`);
    return res.data;
  },
};
