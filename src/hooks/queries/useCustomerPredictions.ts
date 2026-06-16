import { useQuery } from '@tanstack/react-query';
import { CustomersService } from '@/services/customers.service';

export function useCustomerPredictions(id: string) {
  return useQuery({
    queryKey: ['customer-predictions', id],
    queryFn: () => CustomersService.getPredictions(id).then((res) => res.data),
    enabled: !!id,
  });
}
