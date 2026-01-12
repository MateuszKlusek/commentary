import type { CommentaryAPI } from "@shared/src/types/core";
import { createContext, useContext } from "react";

const CommentaryAPIContext = createContext<CommentaryAPI | null>(null);

export const CommentaryAPIProvider = ({
  commentaryAPI,
  children,
}: {
  commentaryAPI: CommentaryAPI;
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
