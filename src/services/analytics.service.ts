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

export interface PortfolioOverviewData {
  risk_analytics: RiskAnalytics;
  payment_analytics: PaymentAnalytics;
  aging_distribution: AgingDistribution;
  recovery_analytics: RecoveryAnalytics;
}

export const AnalyticsService = {
  async getPortfolioOverview(): Promise<StandardResponse<PortfolioOverviewData>> {
    const res = await apiClient.get<StandardResponse<PortfolioOverviewData>>('/analytics/portfolio-overview');
    return res.data;
  },
};
