import { useQuery } from '@tanstack/react-query';
import { CustomersService } from '@/services/customers.service';

export function useCustomers(params: {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  search?: string;
  current_state?: string;
  [key: string]: unknown;
}) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => CustomersService.getCustomers(params),
  });
}
