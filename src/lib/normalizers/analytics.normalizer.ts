import { safeArray, safeNumber, safeObject } from '@/lib/utils';

export function normalizeCommercialFlowPoint(raw: any) {
  return {
    period: String(raw?.period || raw?.period_start || ''),
    sales: safeNumber(raw?.sales ?? raw?.sales_volume),
    payments: safeNumber(raw?.payments ?? raw?.collection_volume),
    outstanding: safeNumber(raw?.outstanding ?? raw?.outstanding_exposure),
  };
}

export function normalizeCommercialFlow(rawList: any) {
  return safeArray(rawList).map(normalizeCommercialFlowPoint);
}

export function normalizeAgingBucketDetail(raw: any) {
  return {
    amount: safeNumber(raw?.amount),
    percentage: safeNumber(raw?.percentage),
  };
}

export function normalizeAgingDistribution(raw: any) {
  const data = safeObject<any>(raw);
  return {
    current: normalizeAgingBucketDetail(data.current || data.overdue_current),
    age_0_30: normalizeAgingBucketDetail(data['0_30'] || data['age_0_30'] || data.overdue_30),
    age_31_60: normalizeAgingBucketDetail(data['31_60'] || data['age_31_60'] || data.overdue_60),
    age_61_90: normalizeAgingBucketDetail(data['61_90'] || data['age_61_90'] || data.overdue_90),
    age_91_120: normalizeAgingBucketDetail(data['91_120'] || data['age_91_120'] || data.overdue_120),
    age_120_plus: normalizeAgingBucketDetail(data['120_plus'] || data['age_120_plus'] || data.overdue_120_plus),
  };
}
