import { useQuery } from '@tanstack/react-query';
import { RecommendationsService } from '@/services/recommendations.service';

export function useRecommendations(params?: {
  customer_id?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['recommendations', params],
    queryFn: () => RecommendationsService.getRecommendations(params).then((res) => res.data),
  });
}
