import type { CommentaryAPI } from "@shared/src/types/core";
import type { Nullable } from "@shared/src/types/helpers";
import { createContext, useContext } from "react";
import { useMergeAPIWithDefaults } from "../hooks/useMergeAPIWithDefaults";
import { validateAPI } from "../utils/validation";

const CommentaryAPIContext = createContext<Nullable<CommentaryAPI>>(undefined);
export const CommentaryAPIProvider = ({
  commentaryAPI,
  children,
}: {
  commentaryAPI: CommentaryAPI;
  children: React.ReactNode;
}) => {

  const mergedAPI = useMergeAPIWithDefaults(commentaryAPI);
  validateAPI(mergedAPI);

  return (
    <CommentaryAPIContext.Provider value={mergedAPI}>
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
