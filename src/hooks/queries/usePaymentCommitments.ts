import { useQuery } from '@tanstack/react-query';
import { CollectionsService } from '@/services/collections.service';

export function usePaymentCommitments(params?: {
  customer_id?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['payment-commitments', params],
    queryFn: () => CollectionsService.getCommitments(params).then((res) => res.data),
  });
}
