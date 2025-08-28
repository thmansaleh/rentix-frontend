import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useCarBrands = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/car-brands-new.json', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0, // No auto refresh since brands don't change often
    dedupingInterval: 300000, // 5 minutes cache deduplication
  });
  
  return {
    brands: data?.brands || [],
    isLoading,
    isError: error,
    refresh: mutate // Function to manually refresh the data
  };
};
