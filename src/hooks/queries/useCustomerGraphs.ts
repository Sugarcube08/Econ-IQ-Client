import { useQuery } from '@tanstack/react-query';
import { CustomersService } from '@/services/customers.service';

export function useCustomerGraphs(id: string, windowDays: number = 365, granularity = 'weekly') {
  const params = { window_days: windowDays, granularity };

  const purchase = useQuery({
    queryKey: ['customer-graph-purchase', id, params],
    queryFn: () => CustomersService.getPurchaseGraph(id, params).then((res) => res.data.graph),
    enabled: !!id,
  });

  const payment = useQuery({
    queryKey: ['customer-graph-payment', id, params],
    queryFn: () => CustomersService.getPaymentGraph(id, params).then((res) => res.data.graph),
    enabled: !!id,
  });

  const rg = useQuery({
    queryKey: ['customer-graph-rg', id, params],
    queryFn: () => CustomersService.getRgGraph(id, params).then((res) => res.data.graph),
    enabled: !!id,
  });

  const outstanding = useQuery({
    queryKey: ['customer-graph-outstanding', id, params],
    queryFn: () => CustomersService.getOutstandingGraph(id, params).then((res) => res.data.graph),
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
