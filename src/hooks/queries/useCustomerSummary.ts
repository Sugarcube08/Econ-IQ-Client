import { useQuery } from '@tanstack/react-query';
import { CustomerSummaryService } from '@/services/customer-summary.service';

export function useCustomerSummary(id: string) {
  return useQuery({
    queryKey: ['customer-summary', id],
    queryFn: () => CustomerSummaryService.getCustomerSummary(id).then((res) => res.data),
    enabled: !!id,
  });
}
