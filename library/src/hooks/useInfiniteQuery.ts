import type { InfiniteFetcher } from "@shared/src/types/core";
import { useEffect, useState } from "react";
import type { ZodSafeParseResult } from "zod/v4";
import { useCommentaryAPI } from "../context/CommentaryAPIContext";
import { PayloadValidationError } from "../utils/errors";
import { validationManager } from "../utils/validation";

type State<T> = {
  items: T[];
  offset: number;
  totalCount: number;
  isLoading: boolean;
  isOnMountLoading: boolean;
  hasMore: boolean;
  error: Error | null;
  snapshotTime: string;
};

const initialState = {
  items: [],
  offset: 0,
  totalCount: 0,
  isLoading: false,
  isOnMountLoading: true,
  hasMore: true,
  error: null,
  snapshotTime: new Date().toISOString(),
};

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

  const [state, setState] = useState<State<T>>(initialState);

  const { validationMode } = useCommentaryAPI();

  const reset = () => {
    setState((prev) => ({
      ...prev,
      ...initialState,
      snapshotTime: new Date().toISOString(),
    }));
  };

  const loadMore = async () => {
    if (state.isLoading || !state.hasMore || !enabled) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const res = await fetcher({
        offset: state.offset,
        limit: pageSize,
        snapshotTime: state.snapshotTime,
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

        setState((prev) => ({
          ...prev,
          items: [...prev.items, ...cleanItems],
        }));
      } else {
        setState((prev) => ({ ...prev, items: [...prev.items, ...res.items] }));
      }

      // offset deals with all items, not only validated ones
      setState((prev) => ({ ...prev, offset: prev.offset + res.items.length }));
      setState((prev) => ({ ...prev, totalCount: res.itemsCount }));

      if (state.offset + res.items.length >= res.itemsCount) {
        setState((prev) => ({ ...prev, hasMore: false }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
    } finally {
      // this will be triggered only once, since we start with onMountLoading = true
      setState((prev) => ({
        ...prev,
        isLoading: false,
        hasMore: false,
        isOnMountLoading: false,
      }));
    }
  };

  useEffect(() => {
    if (!initialFetch || !enabled) return;
    loadMore();
  }, [initialFetch, enabled]);

  return {
    ...state,
    loadMore,
    reset,
  };
}
