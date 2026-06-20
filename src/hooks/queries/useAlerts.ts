import { useQuery } from '@tanstack/react-query';
import { AlertsService } from '@/services/alerts.service';

export function useAlerts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  customer_id?: string;
  sort_by?: string;
  sort_order?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => AlertsService.getAlerts(params).then((res) => res.data),
  });
}
