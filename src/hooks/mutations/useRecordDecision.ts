import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DecisionsService } from '@/services/decisions.service';

export function useRecordDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      customer_id: string;
      recommendation_id: string | null;
      action_taken: string;
      reason: string;
    }) => DecisionsService.recordDecision(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-recommendations', variables.customer_id] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['system-recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['decision-history', { customer_id: variables.customer_id }] });
      queryClient.invalidateQueries({ queryKey: ['decision-history'] });
      queryClient.invalidateQueries({ queryKey: ['system-decisions'] });
    },
  });
}
