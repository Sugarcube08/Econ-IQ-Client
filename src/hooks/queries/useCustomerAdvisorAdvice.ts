import { useQuery } from '@tanstack/react-query';
import { MLService } from '@/services/ml.service';

export function useCustomerAdvisorAdvice(id: string) {
  return useQuery({
    queryKey: ['customer-advisor-advice', id],
    queryFn: () => MLService.getAdvisorAdvice(id),
    enabled: !!id,
  });
}
