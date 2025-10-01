import useSWR from 'swr';
import { getCaseTasks } from '@/app/services/api/tasks';

export function useCaseTasks(caseId) {
  const { data, error, isLoading, mutate } = useSWR(
    caseId ? `case-tasks-${caseId}` : null,
    () => getCaseTasks(caseId)
  );

  return {
    tasks: data?.data || [],
    isLoading,
    isError: error,
    mutate // For updating the cache after operations
  };
}