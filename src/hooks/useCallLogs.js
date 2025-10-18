import useSWR from 'swr';
import { getAllCallLogs, getCallLogById } from '@/app/services/api/callLogs';

export function useCallLogs(params = {}) {
  const key = params ? `call-logs-${JSON.stringify(params)}` : 'call-logs';
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getAllCallLogs(params)
  );

  return {
    callLogs: data?.data || [],
    pagination: data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      limit: 10
    },
    isLoading,
    isError: error,
    mutate
  };
}

export function useCallLog(id) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `call-log-${id}` : null,
    () => getCallLogById(id)
  );

  return {
    callLog: data?.data || null,
    isLoading,
    isError: error,
    mutate
  };
}