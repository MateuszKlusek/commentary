import type { CommentData } from "@shared/src/types/core";
import { Comment } from "./Comment";

export const CommentThread = ({ comment }: { comment: CommentData }) => {
  return (
    <commentary-thread>
      <Comment comment={comment} type="comment" fetchMode="auto" />
    </commentary-thread>
  );
};
