import type { CommentaryAPI } from "../embed/react";
import { CommentaryAPIProvider } from "./CommentaryAPIContext";
import { CopyProvider } from "./CopyContext";
import { UserProvider } from "./UserContext";

export const ContextWrapper = ({
  commentaryAPI,
  children,
}: {
  commentaryAPI: CommentaryAPI;
  children: React.ReactNode;
}) => {
  return (
    <CommentaryAPIProvider commentaryAPI={commentaryAPI}>
      <UserProvider user={commentaryAPI.user}>
        <CopyProvider copy={commentaryAPI.copy}>{children}</CopyProvider>
      </UserProvider>
    </CommentaryAPIProvider>
  );
};
