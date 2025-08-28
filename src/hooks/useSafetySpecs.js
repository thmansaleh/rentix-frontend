import useSWR from 'swr';
import { useLanguage } from '@/contexts/LanguageContext';

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useSafetySpecs = () => {
  const { language } = useLanguage();
  
  const { data, error, isLoading, mutate } = useSWR('/api/safety-specs.json', fetcher);
  
  const safetySpecs = data?.[language]?.defaultSpecs || [];
  
  return {
    safetySpecs,
    isLoading,
    error,
    mutate
  };
};
