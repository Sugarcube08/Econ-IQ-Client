import { useQuery } from '@tanstack/react-query';
import { CustomerService } from '@/services/customer.service';

export function useCustomers(params: {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  search?: string;
  current_state?: string;
  [key: string]: any;
}) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => CustomerService.getCustomers(params),
  });
}

export function useCustomerProfile(id: string, windowDays: number = 365) {
  return useQuery({
    queryKey: ['customer-profile', id, windowDays],
    queryFn: () => CustomerService.getCustomer(id, windowDays).then((res) => res.data.customer),
    enabled: !!id,
  });
}

export function useCustomerPredictions(id: string) {
  return useQuery({
    queryKey: ['customer-predictions', id],
    queryFn: () => CustomerService.getPredictions(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCustomerRecommendations(id: string) {
  return useQuery({
    queryKey: ['customer-recommendations', id],
    queryFn: () => CustomerService.getRecommendations(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCustomerGraphs(id: string, windowDays: number = 365, granularity = 'weekly') {
  const params = { window_days: windowDays, granularity };

  const purchase = useQuery({
    queryKey: ['customer-graph-purchase', id, params],
    queryFn: () => CustomerService.getPurchaseGraph(id, params).then((res) => res.data.graph),
    enabled: !!id,
  });

  const payment = useQuery({
    queryKey: ['customer-graph-payment', id, params],
    queryFn: () => CustomerService.getPaymentGraph(id, params).then((res) => res.data.graph),
    enabled: !!id,
  });

  const rg = useQuery({
    queryKey: ['customer-graph-rg', id, params],
    queryFn: () => CustomerService.getRgGraph(id, params).then((res) => res.data.graph),
    enabled: !!id,
  });

  const outstanding = useQuery({
    queryKey: ['customer-graph-outstanding', id, params],
    queryFn: () => CustomerService.getOutstandingGraph(id, params).then((res) => res.data.graph),
    enabled: !!id,
  });

  return {
    purchase,
    payment,
    rg,
    outstanding,
    isLoading: purchase.isLoading || payment.isLoading || rg.isLoading || outstanding.isLoading,
    isError: purchase.isError || payment.isError || rg.isError || outstanding.isError,
  };
}
