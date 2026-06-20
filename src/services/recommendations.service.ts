import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';
import { CustomerRecommendations } from '@/types/customer';

export interface RecommendationData {
  id: string;
  customer_id: string;
  customer_name?: string;
  recommendation_type: string;
  severity: string;
  reason?: string;
  confidence: number;
  status: string;
  created_at: string;
  value?: string;
  priority?: string;
  action_category?: string;
}

export interface PaginatedRecommendations {
  items: RecommendationData[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const RecommendationsService = {
  async getRecommendations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    sort_by?: string;
    sort_order?: string;
    search?: string;
    customer_id?: string;
  }): Promise<StandardResponse<RecommendationData[] | PaginatedRecommendations>> {
    const res = await apiClient.get<StandardResponse<RecommendationData[] | PaginatedRecommendations>>('/recommendations', { params });
    return res.data;
  },

  async getCustomerRecommendations(id: string): Promise<StandardResponse<CustomerRecommendations>> {
    const res = await apiClient.get<StandardResponse<CustomerRecommendations>>(`/customer/${id}/recommendations`);
    return res.data;
  },
};

