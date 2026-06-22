import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

export interface DecisionAuditData {
  id: string;
  customer_id: string;
  customer_name?: string;
  recommendation_id: string | null;
  action_taken: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN' | string;
  performed_by: string;
  reason: string;
  timestamp: string;
}

export const DecisionsService = {
  async recordDecision(payload: {
    customer_id: string;
    recommendation_id: string | null;
    action_taken: string;
    reason: string;
  }): Promise<StandardResponse<DecisionAuditData>> {
    const res = await apiClient.post<StandardResponse<DecisionAuditData>>('/decisions/action', payload);
    return res.data;
  },

  async getDecisionHistory(params?: {
    customer_id?: string;
  }): Promise<StandardResponse<DecisionAuditData[]>> {
    const res = await apiClient.get<StandardResponse<DecisionAuditData[]>>('/decisions/history', { params });
    return res.data;
  },
};
