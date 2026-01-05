import type { CommentaryAPI, CommentData } from "@shared/src/types";
import { Comment } from "./Comment";

export const CommentThread = ({
  commentaryProps,
  comment,
}: {
  commentaryProps: CommentaryAPI;
  comment: CommentData;
}) => {
  return (
    <commentary-thread>
      <Comment commentaryProps={commentaryProps} comment={comment} />
    </commentary-thread>
  );
};
