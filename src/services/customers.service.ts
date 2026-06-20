import { apiClient } from '@/lib/axios';
import {
  Customer,
  CustomerProfile,
  CustomerPredictions,
  CustomerRecommendations,
  GraphPoint,
} from '@/types/customer';
import { StandardResponse } from '@/types/response';

export const CustomersService = {
  async getCustomers(params: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
    search?: string;
    current_state?: string;
    [key: string]: unknown;
  }): Promise<StandardResponse<{ customers: Customer[] }>> {
    const res = await apiClient.get<StandardResponse<{ customers: Customer[] }>>('/customers', {
      params,
    });
    return res.data;
  },

  async getCustomer(id: string, windowDays: number = 365): Promise<StandardResponse<{ customer: CustomerProfile }>> {
    const res = await apiClient.get<StandardResponse<{ customer: CustomerProfile }>>(`/customer/${id}`, {
      params: { window_days: windowDays },
    });
    return res.data;
  },

  async getPredictions(id: string): Promise<StandardResponse<CustomerPredictions>> {
    const res = await apiClient.get<StandardResponse<CustomerPredictions>>(`/customer/${id}/predictions`);
    return res.data;
  },

  async getRecommendations(id: string): Promise<StandardResponse<CustomerRecommendations>> {
    const res = await apiClient.get<StandardResponse<CustomerRecommendations>>(`/customer/${id}/recommendations`);
    return res.data;
  },

  async getGraphs(
    id: string,
    params?: { window_days?: number; granularity?: string }
  ): Promise<StandardResponse<{ timeline: any[] }>> {
    const res = await apiClient.get<StandardResponse<{ timeline: any[] }>>(`/customer/${id}/graphs`, {
      params,
    });
    return res.data;
  },
};

// Maintain alias for import compatibility
export const CustomerService = CustomersService;
