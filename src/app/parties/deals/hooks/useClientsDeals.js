import useSWR from 'swr'
import { getAllClientsDeals } from '@/app/services/api/clientsDeals'

/**
 * Custom hook to manage clients deals data with SWR
 * @param {object} params - Query parameters for filtering data
 * @returns {object} { deals, pagination, isLoading, error, mutate }
 */
export const useClientsDeals = (params = {}) => {
  // Create a stable key for SWR that includes all parameters
  const key = params ? ['clients-deals', JSON.stringify(params)] : null

  const { data, error, mutate, isLoading } = useSWR(
    key,
    () => getAllClientsDeals(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      // Keep previous data while loading new data
      keepPreviousData: true,
    }
  )

  return {
    deals: data?.success ? data.data : [],
    pagination: data?.pagination || null,
    totalCount: data?.pagination?.total || 0,
    currentPage: data?.pagination?.currentPage || 1,
    totalPages: data?.pagination?.totalPages || 1,
    isLoading: isLoading,
    isError: !!error,
    error,
    mutate,
    // Helper method to refresh data
    refresh: () => mutate(),
  }
}