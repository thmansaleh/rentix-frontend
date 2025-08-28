import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useDefaultSafetySpecs() {
  const { data, error, isLoading } = useSWR('/api/default-safety-specs.json', fetcher);

  return {
    defaultSafetySpecs: data,
    isLoading,
    isError: error
  };
}
