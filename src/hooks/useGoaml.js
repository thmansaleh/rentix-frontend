import useSWR from 'swr';
import { getAllGoamlRecords, getGoamlRecordById } from '@/app/services/api/goaml';

export function useGoamlRecords() {
  const { data, error, isLoading, mutate } = useSWR(
    'goaml-records',
    getAllGoamlRecords
  );

  return {
    records: data?.data || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate
  };
}

export function useGoamlRecord(id) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `goaml-record-${id}` : null,
    () => getGoamlRecordById(id)
  );

  return {
    record: data?.data || null,
    isLoading,
    isError: error,
    mutate
  };
}
