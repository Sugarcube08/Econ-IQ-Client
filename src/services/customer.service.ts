import { apiClient } from '@/lib/axios';
import {
  Customer,
  CustomerProfile,
  CustomerPredictions,
  CustomerRecommendations,
  GraphPoint,
} from '@/types/customer';
import { StandardResponse } from '@/types/response';

export const CustomerService = {
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

  async getPurchaseGraph(
    id: string,
    params?: { window_days?: number; granularity?: string }
  ): Promise<StandardResponse<{ graph: GraphPoint[] }>> {
    const res = await apiClient.get<StandardResponse<{ graph: GraphPoint[] }>>(`/customer/${id}/purchase-graph`, {
      params,
    });
    return res.data;
  },

  async getPaymentGraph(
    id: string,
    params?: { window_days?: number; granularity?: string }
  ): Promise<StandardResponse<{ graph: GraphPoint[] }>> {
    const res = await apiClient.get<StandardResponse<{ graph: GraphPoint[] }>>(`/customer/${id}/payment-graph`, {
      params,
    });
    return res.data;
  },

  async getRgGraph(
    id: string,
    params?: { window_days?: number; granularity?: string }
  ): Promise<StandardResponse<{ graph: GraphPoint[] }>> {
    const res = await apiClient.get<StandardResponse<{ graph: GraphPoint[] }>>(`/customer/${id}/rg-graph`, {
      params,
    });
    return res.data;
  },

  async getOutstandingGraph(
    id: string,
    params?: { window_days?: number; granularity?: string }
  ): Promise<StandardResponse<{ graph: GraphPoint[] }>> {
    const res = await apiClient.get<StandardResponse<{ graph: GraphPoint[] }>>(`/customer/${id}/outstanding-graph`, {
      params,
    });
    return res.data;
  },
};
