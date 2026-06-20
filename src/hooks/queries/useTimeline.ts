import { useQuery } from '@tanstack/react-query';
import { TimelineService } from '@/services/timeline.service';

export function useTimeline(
  id: string,
  params?: {
    page?: number;
    limit?: number;
    event_types?: string;
  }
) {
  return useQuery({
    queryKey: ['timeline', id, params],
    queryFn: () => TimelineService.getTimeline(id, params).then((res) => res.data),
    enabled: !!id,
  });
}
