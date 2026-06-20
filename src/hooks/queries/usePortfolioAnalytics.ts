import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '@/services/analytics.service';

export function usePortfolioAnalytics() {
  return useQuery({
    queryKey: ['portfolio-analytics-overview'],
    queryFn: () => AnalyticsService.getPortfolioOverview().then((res) => res.data),
  });
}
