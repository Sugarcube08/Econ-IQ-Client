import { useQuery } from '@tanstack/react-query';
import { RecommendationsService } from '@/services/recommendations.service';

export function useCustomerRecommendations(id: string) {
  return useQuery({
    queryKey: ['customer-recommendations', id],
    queryFn: () => RecommendationsService.getCustomerRecommendations(id).then((res) => res.data),
    enabled: !!id,
  });
}
