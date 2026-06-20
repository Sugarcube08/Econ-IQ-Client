import { useQuery } from '@tanstack/react-query';
import { RecommendationsService } from '@/services/recommendations.service';

export function useRecommendations(params?: {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  sort_by?: string;
  sort_order?: string;
  search?: string;
  customer_id?: string;
}) {
  return useQuery({
    queryKey: ['recommendations', params],
    queryFn: () => RecommendationsService.getRecommendations(params).then((res) => res.data),
  });
}

