import type { InfiniteFetcher } from "@shared/src/types/core";
import { useEffect, useState } from "react";

export function useInfiniteQuery<T>(
  fetcher: InfiniteFetcher<T>,
  pageSize: number,
  options?: {
    initialFetch?: boolean;
    enabled?: boolean;
  }
) {
  const { initialFetch = false, enabled = true } = options || {};

  const [items, setItems] = useState<T[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const reset = () => {
    setItems([]);
    setOffset(0);
    setTotalCount(0);
    setLoading(false);
    setHasMore(true);
  };

  const loadMore = async () => {
    if (loading || !hasMore || !enabled) return;
    console.log("loading more", offset, pageSize);

    setLoading(true);

    const res = await fetcher({
      offset,
      limit: pageSize,
    });

    setItems((prev) => [...prev, ...res.items]);
    setOffset((prev) => prev + res.items.length);
    setTotalCount(res.itemsCount);

    if (offset + res.items.length >= res.itemsCount) {
      setHasMore(false);
    }

    setLoading(false);
    console.log("ending for: ", offset, pageSize);
  };

  useEffect(() => {
    if (!initialFetch || !enabled) return;
    queueMicrotask(() => void loadMore());
  }, [initialFetch, enabled]);

  return {
    offset,
    items,
    loading,
    hasMore,
    totalCount,
    loadMore,
    reset,
  };
}
