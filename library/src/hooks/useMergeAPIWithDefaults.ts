import type { CommentaryAPI } from "@shared/src/types/core";
import { useMemo } from "react";

export const useMergeAPIWithDefaults = (api: CommentaryAPI) => {
  const mergedApi: CommentaryAPI = useMemo(() => {
    return { ...{ mode: "development", validationMode: "warn" }, ...api };
  }, [api]);

  return mergedApi;
};
