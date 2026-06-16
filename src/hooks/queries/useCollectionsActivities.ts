import { useQuery } from '@tanstack/react-query';
import { CollectionsService } from '@/services/collections.service';

export function useCollectionsActivities(params?: {
  customer_id?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['collection-activities', params],
    queryFn: () => CollectionsService.getActivities(params).then((res) => res.data),
  });
}
