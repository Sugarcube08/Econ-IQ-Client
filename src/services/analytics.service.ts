import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

export interface RiskAnalytics {
  average_risk_score: number;
  average_safety_score: number;
  high_risk_exposure_pct: number;
}

export interface PaymentAnalytics {
  average_payment_delay_days: number;
  dso: number;
  days_past_due: number;
}

export interface AgingDistribution {
  current: number;
  '1_30_days': number;
  '31_60_days': number;
  '61_90_days': number;
  '90_plus_days': number;
}

export interface RecoveryAnalytics {
  active_payment_commitments: number;
  commitment_adherence_rate: number;
  total_recovered_amount: number;
}

export interface PortfolioSummary {
  total_outstanding: number;
  total_recovered_30d: number;
  recovery_rate_ytd: number;
  active_commitments_count: number;
}

export interface PriorityDistribution {
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

export interface PortfolioOverviewData {
  risk_analytics?: RiskAnalytics;
  payment_analytics?: PaymentAnalytics;
  aging_distribution: AgingDistribution;
  recovery_analytics?: RecoveryAnalytics;
  summary?: PortfolioSummary;
  priority_distribution?: PriorityDistribution;
  growth_analytics?: {
    top_account_share: number;
    top_5_share: number;
    top_10_share: number;
    growth_trajectory: string;
    opportunity_index: string;
  };
  top_account_share?: number;
  growth_trajectory?: string;
  opportunity_index?: string;
  portfolio_risk_trend?: string;
  items?: any[];
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

export interface CollectionQueueItem {
  customer_id: string;
  customer_name: string;
  outstanding: number;
  recovered_ytd: number;
  priority_score: number;
  priority_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  primary_dunning_reason: string;
  last_outreach_date: string | null;
}

export interface CollectionQueueData {
  items: CollectionQueueItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface GrowthItem {
  customer_id: string;
  name: string;
  contribution: number;
  sales_volume: number;
  growth_rate: number;
}

export interface GrowthAnalyticsData {
  top_account_share: number;
  growth_trajectory: string;
  opportunity_label: string;
  items: GrowthItem[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const AnalyticsService = {
  async getPortfolioOverview(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<StandardResponse<PortfolioOverviewData>> {
    const res = await apiClient.get<StandardResponse<PortfolioOverviewData>>('/analytics/portfolio-overview', {
      params,
    });
    return res.data;
  },

  async getCollectionQueue(params?: {
    page?: number;
    limit?: number;
    search?: string;
    priority_level?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<StandardResponse<CollectionQueueData>> {
    const res = await apiClient.get<StandardResponse<CollectionQueueData>>('/analytics/collection-queue', {
      params,
    });
    return res.data;
  },

  async getGrowth(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<StandardResponse<GrowthAnalyticsData>> {
    const res = await apiClient.get<StandardResponse<GrowthAnalyticsData>>('/analytics/growth', {
      params,
    });
    return res.data;
  },
};
