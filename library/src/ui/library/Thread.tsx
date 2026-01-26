import type { CommentItem } from "@shared/src/types/core";
import { ThreadContainer } from "./Comment";

export const Thread = ({ comment }: { comment: CommentItem }) => {
  return (
    <commentary-thread>
      <ThreadContainer comment={comment} type="comment" fetchMode="auto" />
    </commentary-thread>
  );
};

