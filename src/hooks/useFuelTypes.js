'use client'
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useFuelTypes() {
  const { data, error, isLoading } = useSWR('/api/fuel-types.json', fetcher);

  return {
    fuelTypes: data || [],
    isLoading,
    isError: error
  };
}
