import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

export interface AlertData {
  id: string;
  workspace_id: string | null;
  customer_id: string;
  customer_name?: string;
  alert_type: string;
  alert_severity: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
}

export interface AlertCounts {
  active: number;
  critical: number;
  warning: number;
}

export interface PaginatedAlerts {
  items: AlertData[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const AlertsService = {
  async getAlerts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    customer_id?: string;
    sort_by?: string;
    sort_order?: string;
    search?: string;
  }): Promise<StandardResponse<AlertData[] | PaginatedAlerts>> {
    const res = await apiClient.get<StandardResponse<AlertData[] | PaginatedAlerts>>('/alerts', { params });
    return res.data;
  },

  async getAlertsCount(): Promise<StandardResponse<AlertCounts>> {
    const res = await apiClient.get<StandardResponse<AlertCounts>>('/alerts/count');
    return res.data;
  },

  async acknowledgeAlert(id: string): Promise<StandardResponse<{ id: string; status: string; acknowledged_at: string }>> {
    const res = await apiClient.post<StandardResponse<{ id: string; status: string; acknowledged_at: string }>>(`/alerts/${id}/acknowledge`);
    return res.data;
  },
};
