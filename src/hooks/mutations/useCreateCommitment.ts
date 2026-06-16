import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionsService } from '@/services/collections.service';

export function useCreateCommitment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      customer_id: string;
      amount: number;
      promised_date: string;
    }) => CollectionsService.logCommitment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment-commitments', { customer_id: variables.customer_id }] });
      queryClient.invalidateQueries({ queryKey: ['payment-commitments'] });
      queryClient.invalidateQueries({ queryKey: ['system-commitments'] });
    },
  });
}
