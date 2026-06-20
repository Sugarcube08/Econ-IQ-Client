import { useQuery } from '@tanstack/react-query';
import { RiskSignalsService } from '@/services/risk-signals.service';

export function useRiskSignals(params?: {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['risk-signals', params],
    queryFn: () => RiskSignalsService.getRiskSignals(params).then((res) => res.data),
  });
}
