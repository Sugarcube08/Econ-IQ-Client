import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '@/services/analytics.service';

export function useGrowthAnalytics(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  return useQuery({
    queryKey: ['growth-analytics', params],
    queryFn: () => AnalyticsService.getGrowth(params).then((res) => res.data),
  });
}
