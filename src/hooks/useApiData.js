import useSWR from 'swr';

// Fetcher function for API calls
const fetcher = (url) => fetch(url).then((res) => res.json());

// Hook to fetch emirates data
export function useEmirates() {
  const { data, error, isLoading } = useSWR('/api/emirates.json', fetcher);

  return {
    emirates: data || [],
    isLoading,
    isError: error,
  };
}

// Hook to fetch car brands data
export function useCarBrands() {
  const { data, error, isLoading } = useSWR('/api/car-brands-new.json', fetcher);

  return {
    carBrands: data || [],
    isLoading,
    isError: error,
  };
}

// Hook to fetch countries data
export function useCountries() {
  const { data, error, isLoading } = useSWR('/api/countries.json', fetcher);

  return {
    countries: data || [],
    isLoading,
    isError: error,
  };
}

// Hook to fetch fuel types data
export function useFuelTypes() {
  const { data, error, isLoading } = useSWR('/api/fuel-types.json', fetcher);

  return {
    fuelTypes: data || [],
    isLoading,
    isError: error,
  };
}

// Hook to fetch car details data
export function useCarDetails() {
  const { data, error, isLoading } = useSWR('/api/car-details.json', fetcher);

  return {
    carDetails: data || {},
    isLoading,
    isError: error,
  };
}

// Hook to fetch courts data
export function useCourts() {
  const { data, error, isLoading } = useSWR('/api/courts.json', fetcher);

  return {
    courts: data || [],
    isLoading,
    isError: error,
  };
}
