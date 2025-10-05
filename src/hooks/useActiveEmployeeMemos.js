import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { getActiveEmployeeMemos } from '@/app/services/api/memos';

export const useActiveEmployeeMemos = () => {
  const employeeId = useSelector((state) => state.auth.jobId);

  const { data, error, isLoading, mutate } = useSWR(
    employeeId ? `/memos/employee/${employeeId}/active` : null,
    () => getActiveEmployeeMemos(employeeId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    memos: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};
