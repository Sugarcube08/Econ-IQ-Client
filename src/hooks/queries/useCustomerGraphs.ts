import { useQuery } from '@tanstack/react-query';
import { CustomersService } from '@/services/customers.service';

export function useCustomerGraphs(id: string, windowDays: number = 365, granularity = 'monthly') {
  const params = { window_days: windowDays, granularity };

  return useQuery({
    queryKey: ['customer-graphs', id, params],
    queryFn: () => CustomersService.getGraphs(id, params).then((res) => res.data.timeline),
    enabled: !!id,
  });
}
