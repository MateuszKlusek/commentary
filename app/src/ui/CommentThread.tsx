import type { CommentData } from "../types/core";
import { Comment } from "./Comment";

type Props = CommentData & {
  getReplies: (
    commentId: string,
    offset: number,
    limit: number
  ) => Promise<CommentData[]>;
  updateLike: (commentId: string, like: boolean) => Promise<void>;
  addComment: (
    content: string,
    userId: string,
    parentId: string | null
  ) => Promise<void>;
  userId: string | null | undefined;
};
export const CommentThread = ({
  getReplies,
  updateLike,
  addComment,
  userId,
  ...props
}: CommentaryRepository) => {
  return (
    <commentary-thread>
      <Comment
        {...props}
        getReplies={getReplies}
        updateLike={updateLike}
        addComment={addComment}
        userId={userId}
      />
    </commentary-thread>
  );
};
