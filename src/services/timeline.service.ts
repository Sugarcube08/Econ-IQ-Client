import { apiClient } from '@/lib/axios';
import { StandardResponse } from '@/types/response';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  event_type: 'INVOICE' | 'PAYMENT' | 'ALERT' | 'COLLECTION' | 'COMMITMENT' | 'DECISION' | 'RETURN';
  title: string;
  description: string;
  metadata: Record<string, any>;
}

export interface PaginatedTimeline {
  items: TimelineEvent[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const TimelineService = {
  async getTimeline(
    id: string,
    params?: {
      page?: number;
      limit?: number;
      event_types?: string;
    }
  ): Promise<StandardResponse<PaginatedTimeline>> {
    const res = await apiClient.get<StandardResponse<PaginatedTimeline>>(`/customer/${id}/timeline`, { params });
    return res.data;
  },
};
