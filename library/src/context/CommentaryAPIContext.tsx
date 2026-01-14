import type { CommentaryAPI } from "@shared/src/types/core";
import type { Nullable } from "@shared/src/types/helpers";
import { createContext, useContext } from "react";

const CommentaryAPIContext = createContext<Nullable<CommentaryAPI>>(undefined);

export const CommentaryAPIProvider = ({
  commentaryAPI,

  children,
}: {
  commentaryAPI: Nullable<CommentaryAPI>;
  children: React.ReactNode;
}) => {
  return (
    <CommentaryAPIContext.Provider value={commentaryAPI}>
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
