import type { CommentaryActions } from "@shared/src/types/core";
import type { CommentaryAPI } from "../embed/react";
import { CommentaryIntegrationError } from "./errors";

export const validateAPI = (api: CommentaryAPI) => {
  const REQUIRED_ACTIONS: (keyof CommentaryActions)[] = [
    "getTopLevelComments",
    "getReplies",
    "addComment",
    "handleUserSentiment",
  ];

  const missing = REQUIRED_ACTIONS.filter(
    (method) => typeof api[method] !== "function"
  );

  if (missing.length > 0) {
    const errorMsg = `Missing required methods in API: ${missing.join(", ")}`;

    if (api.validationMode === "strict")
      throw new CommentaryIntegrationError(errorMsg);
    if (api.validationMode === "warn") console.warn(errorMsg);
    return false;
  }

  return true;
};
