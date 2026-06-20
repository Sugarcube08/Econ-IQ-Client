import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

export interface CollectionActivityData {
  id: string;
  customer_id: string;
  user_id: string;
  activity_type: 'CALL' | 'EMAIL' | 'LETTER' | 'OTHER' | string;
  notes: string;
  outcome: 'CONTACTED' | 'LEFT_VM' | 'NO_ANSWER' | 'EMAIL_SENT' | string;
  created_at: string;
}

export interface PaymentCommitmentData {
  id: string;
  customer_id: string;
  customer_name?: string;
  amount: number;
  promised_date: string;
  status: 'PENDING' | 'KEPT' | 'BROKEN' | string;
  created_at: string;
}

export const CollectionsService = {
  async logActivity(payload: {
    customer_id: string;
    activity_type: string;
    notes: string;
    outcome: string;
  }): Promise<StandardResponse<CollectionActivityData>> {
    const res = await apiClient.post<StandardResponse<CollectionActivityData>>('/collections/activity', payload);
    return res.data;
  },

  async getActivities(params?: {
    customer_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<StandardResponse<CollectionActivityData[]>> {
    const res = await apiClient.get<StandardResponse<CollectionActivityData[]>>('/collections/activity', { params });
    return res.data;
  },

  async logCommitment(payload: {
    customer_id: string;
    amount: number;
    promised_date: string;
  }): Promise<StandardResponse<PaymentCommitmentData>> {
    const res = await apiClient.post<StandardResponse<PaymentCommitmentData>>('/collections/commitment', payload);
    return res.data;
  },

  async getCommitments(params?: {
    customer_id?: string;
    status?: string;
  }): Promise<StandardResponse<PaymentCommitmentData[]>> {
    const res = await apiClient.get<StandardResponse<PaymentCommitmentData[]>>('/collections/commitment', { params });
    return res.data;
  },
};
