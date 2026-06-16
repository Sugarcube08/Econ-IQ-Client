import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertsService } from '@/services/alerts.service';

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AlertsService.acknowledgeAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts-count'] });
      queryClient.invalidateQueries({ queryKey: ['system-alerts-count'] });
    },
  });
}
