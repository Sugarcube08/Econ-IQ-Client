import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '@/services/analytics.service';

export function useCollectionQueue(params?: {
  page?: number;
  limit?: number;
  search?: string;
  priority_level?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  return useQuery({
    queryKey: ['collection-queue', params],
    queryFn: () => AnalyticsService.getCollectionQueue(params).then((res) => res.data),
  });
}
