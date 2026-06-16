import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionsService } from '@/services/collections.service';

export function useLogCollectionActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      customer_id: string;
      activity_type: string;
      notes: string;
      outcome: string;
    }) => CollectionsService.logActivity(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collection-activities', { customer_id: variables.customer_id }] });
      queryClient.invalidateQueries({ queryKey: ['collection-activities'] });
      queryClient.invalidateQueries({ queryKey: ['system-activities'] });
    },
  });
}
