import { apiClient } from '@/lib/axios';

export interface SHAPExplanation {
  prediction: number;
  top_factors: string[];
}

export interface AdvisorAdvice {
  customer_id: string;
  state: string;
  predictions: {
    distress: number;
    churn: number;
  };
  recommendations: Array<{
    action: string;
    impact: number;
    confidence: number;
  }>;
}

export interface ScoreState {
  distress: number;
  health: number;
}

export interface SimulationResult {
  current: ScoreState;
  simulated: ScoreState;
  delta: ScoreState;
}

export const MLService = {
  async getShapExplanation(id: string, modelType: 'churn' | 'delinquency' | 'distress'): Promise<SHAPExplanation> {
    const res = await apiClient.get<SHAPExplanation>(`/ml/explanation/${id}`, {
      params: { model_type: modelType }
    });
    return res.data;
  },

  async getAdvisorAdvice(id: string): Promise<AdvisorAdvice> {
    const res = await apiClient.get<AdvisorAdvice>(`/advisor/customer/${id}`);
    return res.data;
  },

  async simulateActions(id: string, actions: string[]): Promise<SimulationResult> {
    const res = await apiClient.post<SimulationResult>('/ml/simulate', {
      customer_id: id,
      actions
    });
    return res.data;
  }
};
