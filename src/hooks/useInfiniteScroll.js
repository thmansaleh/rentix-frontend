import { useEffect, useRef } from 'react';

export function useInfiniteScroll(loadMore, hasMore) {
  const observer = useRef();

  const lastElementRef = (node) => {
    if (observer.current) observer.current.disconnect();
    if (!hasMore) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  };

  return lastElementRef;
}