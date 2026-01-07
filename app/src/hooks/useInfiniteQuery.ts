import type { InfiniteFetcher } from "@shared/src/types";
import { useEffect, useState } from "react";

export function useInfiniteQuery<T>(
  fetcher: InfiniteFetcher<T>,
  pageSize: number,
  options?: {
    initialFetch?: boolean;
  }
) {
  const { initialFetch = false } = options || {};

  const [items, setItems] = useState<T[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;

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
  };

  useEffect(() => {
    if (!initialFetch) return;
    queueMicrotask(() => void loadMore());
  }, [initialFetch]);

  return {
    items,
    loadMore,
    loading,
    hasMore,
    totalCount,
  };
}
