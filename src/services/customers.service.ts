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

  async getPredictions(id: string): Promise<{ predictions: Array<{ model: string; score: number; confidence: number; prediction_source: string }> }> {
    const res = await apiClient.get<StandardResponse<{
      risk?: any;
      growth?: any;
      health?: any;
      churn?: any;
      collection?: any;
      opportunity?: any;
    }>>(`/customer/${id}/predictions`);

    const data = res.data?.data;
    if (!data) {
      return { predictions: [] };
    }

    const predictions = [
      {
        model: 'churn',
        score: data.churn?.score ?? 0,
        confidence: data.churn?.confidence ?? 0.85,
        prediction_source: data.churn?.prediction_source ?? 'ML'
      },
      {
        model: 'delinquency',
        score: data.risk?.score ?? 0,
        confidence: data.risk?.confidence ?? 0.85,
        prediction_source: data.risk?.prediction_source ?? 'ML'
      },
      {
        model: 'distress',
        score: data.health?.score ?? 0,
        confidence: data.health?.confidence ?? 0.85,
        prediction_source: data.health?.prediction_source ?? 'ML'
      },
      {
        model: 'recovery',
        score: data.collection?.score ?? 0,
        confidence: data.collection?.confidence ?? 0.85,
        prediction_source: data.collection?.prediction_source ?? 'ML'
      },
      {
        model: 'state_transition',
        score: data.opportunity?.score ?? 0,
        confidence: data.opportunity?.confidence ?? 0.85,
        prediction_source: data.opportunity?.prediction_source ?? 'ML'
      }
    ];

    return { predictions };
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
