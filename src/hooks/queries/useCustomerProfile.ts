import { useQuery } from '@tanstack/react-query';
import { CustomersService } from '@/services/customers.service';

export function useCustomerProfile(id: string, windowDays: number = 365) {
  return useQuery({
    queryKey: ['customer-profile', id, windowDays],
    queryFn: () => CustomersService.getCustomer(id, windowDays).then((res) => res.data.customer),
    enabled: !!id,
  });
}
