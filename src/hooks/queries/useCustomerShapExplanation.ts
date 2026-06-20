import { useQuery } from '@tanstack/react-query';
import { MLService } from '@/services/ml.service';

export function useCustomerShapExplanation(id: string, modelType: 'churn' | 'delinquency' | 'distress') {
  return useQuery({
    queryKey: ['customer-shap-explanation', id, modelType],
    queryFn: () => MLService.getShapExplanation(id, modelType),
    enabled: !!id && !!modelType,
  });
}
