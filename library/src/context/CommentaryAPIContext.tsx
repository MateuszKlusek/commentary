import type { CommentaryActions, CommentaryAPI } from "@shared/src/types/core";
import type { Nullable } from "@shared/src/types/helpers";
import { createContext, useContext } from "react";

const CommentaryAPIContext = createContext<Nullable<CommentaryAPI>>(undefined);

const validateAPI = (api: CommentaryAPI) => {
  const REQUIRED_ACTIONS: (keyof CommentaryActions)[] = [
    "getTopLevelComments",
    "getReplies",
    "addComment",
    "handleUserSentiment"
  ];

  const missing = REQUIRED_ACTIONS.filter(method => typeof api[method] !== 'function');

  if (missing.length > 0) {
    const errorMsg = `Missing required methods in API: ${missing.join(", ")}`;

    if (api.validationMode === "strict") throw new Error(errorMsg);
    if (api.validationMode === "warn") console.warn(errorMsg);
    return false
  }

  return true;
};

export const CommentaryAPIProvider = ({
  commentaryAPI,
  children,
}: {
  commentaryAPI: CommentaryAPI;
  children: React.ReactNode;
}) => {

  const mergedApi: CommentaryAPI = {
    ...{ mode: "development", validationMode: "warn" },
    ...commentaryAPI,
  };

  if (process.env.NODE_ENV !== 'production') {
    validateAPI(mergedApi);
  }

  return (
    <CommentaryAPIContext.Provider value={mergedApi}>
      {children}
    </CommentaryAPIContext.Provider>
  );
};

export const useCommentaryAPI = () => {
  const context = useContext(CommentaryAPIContext);
  if (!context) {
    throw new Error(
      "useCommentaryAPI must be used within a CommentaryAPIProvider"
    );
  }
  return context;
};
