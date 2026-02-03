import type { InfiniteFetcher } from "@shared/src/types/core";
import { useEffect, useState } from "react";
import type { ZodSafeParseResult } from "zod/v4";
import { useCommentaryAPI } from "../context/CommentaryAPIContext";
import { PayloadValidationError } from "../utils/errors";
import { validationManager } from "../utils/validation";

/**
 * @param validator - Pass safe validator to validate the data after it is fetched.
 */

export function useInfiniteQuery<T>(
  fetcher: InfiniteFetcher<T>,
  pageSize: number,
  options?: {
    initialFetch?: boolean;
    enabled?: boolean;
    validator?: (data: T) => ZodSafeParseResult<T>;
  }
) {
  const {
    initialFetch = false,
    enabled = true,
    validator,
  }: {
    initialFetch?: boolean;
    enabled?: boolean;
    validator?: (data: T) => ZodSafeParseResult<T>;
  } = options || {};

  const [items, setItems] = useState<T[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnMountLoading, setIsOnMountLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { validationMode } = useCommentaryAPI();
  const [snapshotTime, setSnapshotTime] = useState(() =>
    new Date().toISOString()
  );

  const reset = () => {
    setItems([]);
    setOffset(0);
    setTotalCount(0);
    setIsLoading(false);
    setHasMore(true);

    setSnapshotTime(new Date().toISOString());
  };

  const loadMore = async () => {
    try {
      if (isLoading || !hasMore || !enabled) return;
      console.log("loading more", offset, pageSize);

      setIsLoading(true);

      const res = await fetcher({
        offset,
        limit: pageSize,
        snapshotTime,
      });

      if (validator) {
        const cleanItems: T[] = [];
        for (const item of res.items) {
          const result = validator(item);
          if (result.success) {
            cleanItems.push(item);
          } else {
            validationManager(
              new PayloadValidationError(result.error.message),
              validationMode
            );
          }
        }

        setItems((prev) => [...prev, ...cleanItems]);
      } else {
        setItems((prev) => [...prev, ...res.items]);
      }

      setOffset((prev) => prev + res.items.length);
      setTotalCount(res.itemsCount);

      if (offset + res.items.length >= res.itemsCount) {
        setHasMore(false);
      }

      console.log("ending for: ", offset, pageSize);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
      setHasMore(false);

      // this will be triggered only once, since we start with onMountLoading = true
      setIsOnMountLoading(false);
    }
  };

  useEffect(() => {
    if (!initialFetch || !enabled) return;
    loadMore();
  }, [initialFetch, enabled]);

  return {
    offset,
    items,
    isLoading,
    isOnMountLoading,
    hasMore,
    totalCount,
    loadMore,
    reset,
    error,
  };
}
