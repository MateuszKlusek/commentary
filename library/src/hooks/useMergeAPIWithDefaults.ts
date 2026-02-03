import type { CommentaryAPI } from "@shared/src/types/core";
import { useMemo } from "storybook/internal/preview-api";

export const useMergeAPIWithDefaults = (api: CommentaryAPI) => {
  const mergedApi: CommentaryAPI = useMemo(
    () => ({
      ...{ mode: "development", validationMode: "warn" },
      ...api,
    }),
    [api]
  );

  return mergedApi;
};
