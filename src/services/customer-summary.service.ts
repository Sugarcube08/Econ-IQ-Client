import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

export interface RecentActivityItem {
  id: string;
  timestamp: string | null;
  event_type: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface RecommendationItem {
  id: string;
  recommendation_type: string;
  severity: string;
  reason: string;
  confidence: number;
}

export interface CustomerSummaryData {
  recent_activity: RecentActivityItem[];
  payment_latency_days: number;
  risk_drivers: string[];
  growth_signals: string[];
  recommendations: RecommendationItem[];
}

export const CustomerSummaryService = {
  async getCustomerSummary(id: string): Promise<StandardResponse<CustomerSummaryData>> {
    const res = await apiClient.get<StandardResponse<CustomerSummaryData>>(`/customer/${id}/summary`);
    return res.data;
  },
};
