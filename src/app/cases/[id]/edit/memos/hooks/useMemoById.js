import useSWR from 'swr';
import { getMemoById } from '@/app/services/api/memos';

/**
 * Custom hook to fetch a single memo by ID with SWR
 * @param {number} memoId - The memo ID to fetch
 * @param {boolean} shouldFetch - Whether to fetch the memo (default: true)
 * @returns {object} { memo, isLoading, error, mutate }
 */
export const useMemoById = (memoId, shouldFetch = true) => {
  const { data, error, mutate } = useSWR(
    shouldFetch && memoId ? `memo-${memoId}` : null,
    () => getMemoById(memoId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    memo: data?.success ? data.data : null,
    isLoading: !data && !error,
    error,
    mutate,
  };
};
