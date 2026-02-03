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

    validationManager(
      new CommentaryIntegrationError(errorMsg),
      api.validationMode
    );
    return false;
  }

  return true;
};

export const validationManager = (
  error: Error,
  validationMode: CommentaryAPI["validationMode"] = "warn"
) => {
  switch (validationMode) {
    case "strict":
      throw error;
    case "warn":
      console.warn(`[${error.name}] ${error.message}`);
      return;
    case "silent":
      return;
  }
};
