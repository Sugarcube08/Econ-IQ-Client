import { useQuery } from '@tanstack/react-query';
import { AlertsService } from '@/services/alerts.service';

export function useAlerts(params?: {
  status?: string;
  severity?: string;
  customer_id?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => AlertsService.getAlerts(params).then((res) => res.data),
  });
}
