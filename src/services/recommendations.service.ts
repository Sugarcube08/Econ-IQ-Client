import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';
import { CustomerRecommendations } from '@/types/customer';

export interface RecommendationData {
  id: string;
  customer_id: string;
  recommendation_type: string;
  severity: string;
  reason: string;
  confidence: number;
  status: string;
  created_at: string;
  value?: string;
  priority?: string;
  action_category?: string;
}

export const RecommendationsService = {
  async getRecommendations(params?: {
    customer_id?: string;
    status?: string;
  }): Promise<StandardResponse<RecommendationData[]>> {
    const res = await apiClient.get<StandardResponse<RecommendationData[]>>('/recommendations', { params });
    return res.data;
  },

  async getCustomerRecommendations(id: string): Promise<StandardResponse<CustomerRecommendations>> {
    const res = await apiClient.get<StandardResponse<CustomerRecommendations>>(`/customer/${id}/recommendations`);
    return res.data;
  },
};
