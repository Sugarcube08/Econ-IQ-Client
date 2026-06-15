export interface DashboardOverview {
  active_customers: number;
  sales_total: number;
  collections_total: number;
  outstanding_exposure: number;
  overdue_exposure?: number;
  health_index: number;
  last_data_date?: string;
  comparison_deltas: {
    active_customers?: number;
    sales_total?: number;
    collections_total?: number;
    outstanding_exposure?: number;
    health_index?: number;
  };
}

export interface CommercialFlowPoint {
  period_start: string;
  period_end: string;
  sales_volume: number;
  collection_volume: number;
  outstanding_exposure: number;
}

export interface StateDistributionDetail {
  count: number;
  percentage: number;
}

export type StateDistribution = Record<string, StateDistributionDetail>;

export interface AgingDistribution {
  current: number;
  overdue_30: number;
  overdue_60: number;
  overdue_90: number;
  overdue_120: number;
  overdue_120_plus: number;
}

export interface DashboardCustomerSummary {
  customer_id: string;
  customer_name: string | null;
  city: string | null;
  trust_score?: number;
  health_score?: number;
  risk_score?: number;
  outstanding_current?: number;
  trust_delta?: number;
  payment_delta?: number;
  repayment_health_delta?: number;
  outstanding_delta?: number;
  state: string;
  grade?: string;
  last_purchased_at?: string;
}

export interface ActivitySummaryAlert {
  id: string;
  alert_type: string;
  customer_id: string;
  customer_name: string | null;
  message: string;
  timestamp: string;
}

export interface TopContributor {
  customer_id: string;
  customer_name: string | null;
  contribution_percent: number;
  sales_total: number;
  outstanding_current?: number;
  trust_score?: number;
}
