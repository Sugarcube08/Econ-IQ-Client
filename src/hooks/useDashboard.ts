import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboard.service';

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => DashboardService.getOverview().then((res) => res.data),
  });
}

export function useDashboardCharts() {
  const commercialFlow = useQuery({
    queryKey: ['dashboard-commercial-flow'],
    queryFn: () => DashboardService.getCommercialFlow().then((res) => res.data),
  });

  const agingDistribution = useQuery({
    queryKey: ['dashboard-aging-distribution'],
    queryFn: () => DashboardService.getAgingDistribution().then((res) => res.data),
  });

  const stateDistribution = useQuery({
    queryKey: ['dashboard-state-distribution'],
    queryFn: () => DashboardService.getStateDistribution().then((res) => res.data),
  });

  return {
    commercialFlow,
    agingDistribution,
    stateDistribution,
    isLoading: commercialFlow.isLoading || agingDistribution.isLoading || stateDistribution.isLoading,
    isError: commercialFlow.isError || agingDistribution.isError || stateDistribution.isError,
  };
}

export function useDashboardQueues() {
  const deteriorating = useQuery({
    queryKey: ['dashboard-deteriorating'],
    queryFn: () => DashboardService.getDeterioratingCustomers().then((res) => res.data),
  });

  const improving = useQuery({
    queryKey: ['dashboard-improving'],
    queryFn: () => DashboardService.getImprovingCustomers().then((res) => res.data),
  });

  const highRisk = useQuery({
    queryKey: ['dashboard-high-risk'],
    queryFn: () => DashboardService.getHighRiskCustomers().then((res) => res.data),
  });

  return {
    deteriorating,
    improving,
    highRisk,
    isLoading: deteriorating.isLoading || improving.isLoading || highRisk.isLoading,
    isError: deteriorating.isError || improving.isError || highRisk.isError,
  };
}

export function useActivitySummary() {
  return useQuery({
    queryKey: ['dashboard-activity-summary'],
    queryFn: () => DashboardService.getActivitySummary().then((res) => res.data),
  });
}

export function useTopContributors() {
  return useQuery({
    queryKey: ['dashboard-top-contributors'],
    queryFn: () => DashboardService.getTopContributors().then((res) => res.data),
  });
}
