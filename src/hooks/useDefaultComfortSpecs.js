import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useDefaultComfortSpecs() {
  const { data, error, isLoading } = useSWR('/api/default-comfort-specs.json', fetcher);

  return {
    defaultComfortSpecs: data || [],
    isLoading,
    isError: error
  };
}
