import useSWR from 'swr';
import { getPartiesOrders } from '@/app/services/api/partiesOrders';

export const usePartiesOrders = (params = {}) => {
  const key = params ? ['/parties-orders', JSON.stringify(params)] : null;
  
  const { data, error, mutate, isValidating } = useSWR(
    key,
    () => getPartiesOrders(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000,
    }
  );

  return {
    orders: data?.data || [],
    pagination: data?.pagination || {},
    totalCount: data?.pagination?.total || 0,
    isLoading: !error && !data,
    isError: !!error,
    error: error,
    mutate,
    isValidating
  };
};
