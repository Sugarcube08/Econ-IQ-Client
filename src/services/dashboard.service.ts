import { apiClient } from '@/lib/axios';
import {
  DashboardOverview,
  CommercialFlowPoint,
  StateDistribution,
  AgingDistribution,
  DashboardCustomerSummary,
  ActivitySummaryAlert,
  TopContributor,
} from '@/types/dashboard';
import { StandardResponse } from '@/types/response';

export const DashboardService = {
  async getOverview(): Promise<StandardResponse<DashboardOverview>> {
    const res = await apiClient.get<StandardResponse<DashboardOverview>>('/dashboard/overview');
    return res.data;
  },

  async getCommercialFlow(): Promise<StandardResponse<CommercialFlowPoint[]>> {
    const res = await apiClient.get<StandardResponse<CommercialFlowPoint[]>>('/dashboard/commercial-flow');
    return res.data;
  },

  async getAgingDistribution(): Promise<StandardResponse<AgingDistribution>> {
    const res = await apiClient.get<StandardResponse<AgingDistribution>>('/dashboard/aging-distribution');
    return res.data;
  },

  async getStateDistribution(): Promise<StandardResponse<StateDistribution>> {
    const res = await apiClient.get<StandardResponse<StateDistribution>>('/dashboard/state-distribution');
    return res.data;
  },

  async getDeterioratingCustomers(): Promise<StandardResponse<DashboardCustomerSummary[]>> {
    const res = await apiClient.get<StandardResponse<DashboardCustomerSummary[]>>('/dashboard/deteriorating-customers');
    return res.data;
  },

  async getImprovingCustomers(): Promise<StandardResponse<DashboardCustomerSummary[]>> {
    const res = await apiClient.get<StandardResponse<DashboardCustomerSummary[]>>('/dashboard/improving-customers');
    return res.data;
  },

  async getHighRiskCustomers(): Promise<StandardResponse<DashboardCustomerSummary[]>> {
    const res = await apiClient.get<StandardResponse<DashboardCustomerSummary[]>>('/dashboard/high-risk-customers');
    return res.data;
  },

  async getActivitySummary(): Promise<StandardResponse<ActivitySummaryAlert[]>> {
    const res = await apiClient.get<StandardResponse<ActivitySummaryAlert[]>>('/dashboard/activity-summary');
    return res.data;
  },

  async getTopContributors(): Promise<StandardResponse<TopContributor[]>> {
    const res = await apiClient.get<StandardResponse<TopContributor[]>>('/dashboard/top-contributors');
    return res.data;
  },
};
