import { useQuery } from '@tanstack/react-query';
import { AlertsService } from '@/services/alerts.service';

export function useAlertsCount() {
  return useQuery({
    queryKey: ['alerts-count'],
    queryFn: () => AlertsService.getAlertsCount().then((res) => res.data),
  });
}
