import type { CommentaryAPI } from "../embed/react";
import { CommentaryAPIProvider } from "./CommentaryAPIContext";
import { CopyProvider } from "./CopyContext";

export const ContextWrapper = ({
  commentaryAPI,
  children,
}: {
  commentaryAPI: CommentaryAPI;
  children: React.ReactNode;
}) => {
  return (
    <CommentaryAPIProvider commentaryAPI={commentaryAPI}>
      <CopyProvider copy={commentaryAPI.copy}>{children}</CopyProvider>
    </CommentaryAPIProvider>
  );
};
