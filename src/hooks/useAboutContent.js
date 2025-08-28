import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useAboutContent() {
  const { data, error, isLoading, mutate } = useSWR('/api/about-content', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
    fallbackData: {
      companyOverview: { ar: '', en: '' },
      mission: { ar: '', en: '' },
      vision: { ar: '', en: '' },
      values: { ar: '', en: '' }
    }
  });

  const updateAboutContent = async (newData) => {
    try {
      // Update optimistically
      await mutate(newData, false);
      
      // Make API call to save the data
      const response = await fetch('/api/about-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
      
      const result = await response.json();
      
      // Revalidate the data
      await mutate();
      
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Failed to update about content:', error);
      // Revert optimistic update
      await mutate();
      return { success: false, error: error.message };
    }
  };

  return {
    data,
    error,
    isLoading,
    updateAboutContent,
    mutate
  };
}
