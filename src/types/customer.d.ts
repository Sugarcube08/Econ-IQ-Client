export interface CustomerScores {
  health_score: number;
  risk_score: number;
  growth_score: number;
  trust_score: number;
  opportunity_score: number;
  credit_score: number;
  collection_score: number;
  relationship_score: number;
  outstanding_current: number;
  outstanding_previous: number;
}

export interface CustomerDeltas {
  health_score: number;
  risk_score: number;
  growth_score: number;
  trust_score: number;
  opportunity_score: number;
  credit_score: number;
  collection_score: number;
  relationship_score: number;
  outstanding_delta: number;
  contribution_score?: number;
}

export interface Customer {
  customer_id: string;
  customer_name: string | null;
  city: string | null;
  health_score: number;
  risk_score: number;
  growth_score: number;
  trust_score: number;
  opportunity_score: number;
  credit_score: number;
  collection_score: number;
  relationship_score: number;
  state: string;
  outstanding_current: number;
  outstanding_previous: number;
  contribution_current: number;
  contribution_previous: number;
  last_purchase_date: string | null;
  deltas: CustomerDeltas;
}

export interface CustomerProfile {
  customer_id: string;
  customer_name: string | null;
  city: string | null;
  scores: CustomerScores;
  deltas: CustomerDeltas;
  behavior_state: string;
  organization_contribution: {
    current_percentage: number;
    delta: number;
  };
  last_purchased_at: string | null;
  updated_at: string;
}

export interface GraphPoint {
  date: string;
  value: number;
  volume?: number;
  count?: number;
  sales_volume?: number;
  collection_volume?: number;
  outstanding_exposure?: number;
  balance?: number;
  amount?: number;
}

export interface PredictionDetail {
  customer_id: string;
  prediction_date: string;
  score: number;
  confidence: number;
  model_version: string;
  features_snapshot: Record<string, any>;
  key_drivers: string[];
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  growth_potential?: 'CONTRACTION' | 'STABLE' | 'EXPANSION' | 'ACCELERATING';
  health_grade?: 'A' | 'B' | 'C' | 'D' | 'F';
  is_churn_risk?: boolean;
  repayment_probability?: number;
  expected_delay_days?: number;
  opportunity_tier?: 'LOW' | 'MEDIUM' | 'HIGH' | 'STIMULUS';
  expected_upsell_value?: number;
}

export interface CustomerPredictions {
  risk: PredictionDetail;
  growth: PredictionDetail;
  health: PredictionDetail;
  churn: PredictionDetail;
  collection: PredictionDetail;
  opportunity: PredictionDetail;
}

export interface Recommendation {
  type: 'CREDIT_LIMIT' | 'PAYMENT_TERMS' | 'RETENTION_STRATEGY' | 'COLLECTION_STRATEGY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  affected_score: 'credit_score' | 'collection_score' | 'relationship_score';
  expected_impact: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  action_category: 'INCREASE_CREDIT_LIMIT' | 'TIGHTEN_PAYMENT_TERMS' | 'PROACTIVE_RETENTION_REACH_OUT' | 'ACCELERATED_COLLECTION' | 'EXTEND_PAYMENT_TERMS';
  value: string;
}

export interface CustomerRecommendations {
  customer_id: string;
  generated_date: string;
  recommendations: Recommendation[];
}
