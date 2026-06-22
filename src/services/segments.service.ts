import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

export interface SegmentItem {
  state: string;
  current_state: string;
  count: number;
  exposure: number;
  outstanding: number;
  movement_in: number;
  movement_out: number;
  net_change: number;
  trend: number;
  week_over_week_trend: number;
}

export interface SegmentsResponseData {
  items: SegmentItem[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const SegmentsService = {
  async getSegments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<StandardResponse<SegmentsResponseData>> {
    const res = await apiClient.get<StandardResponse<SegmentsResponseData>>('/analytics/segments', {
      params,
    });
    return res.data;
  },
};
