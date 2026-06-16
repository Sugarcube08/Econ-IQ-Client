import { useQuery } from '@tanstack/react-query';
import { DecisionsService } from '@/services/decisions.service';

export function useDecisionHistory(params?: {
  customer_id?: string;
}) {
  return useQuery({
    queryKey: ['decision-history', params],
    queryFn: () => DecisionsService.getDecisionHistory(params).then((res) => res.data),
  });
}
