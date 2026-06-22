import { useQuery } from '@tanstack/react-query';
import { SegmentsService } from '@/services/segments.service';

export function useSegments(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  return useQuery({
    queryKey: ['segments-analytics', params],
    queryFn: () => SegmentsService.getSegments(params).then((res) => res.data),
  });
}
