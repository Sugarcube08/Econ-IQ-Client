import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

export interface RiskSignalData {
  customer_id: string;
  customer_name: string;
  risk_score: number;
  safety_score: number;
  trust_delta: number;
  outstanding_current: number;
  state: string;
  payment_delay: number;
}

export interface PaginatedRiskSignals {
  items: RiskSignalData[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const RiskSignalsService = {
  async getRiskSignals(params?: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
    search?: string;
  }): Promise<StandardResponse<PaginatedRiskSignals>> {
    const res = await apiClient.get<StandardResponse<PaginatedRiskSignals>>('/intelligence/risk-signals', { params });
    return res.data;
  },
};
