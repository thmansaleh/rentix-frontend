'use client';

import { SWRConfig } from 'swr';

// Global SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1 minute
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  fetcher: (url) => fetch(url).then((res) => res.json()),
  onError: (error, key) => {

  },
};

export default function SWRProvider({ children }) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}
