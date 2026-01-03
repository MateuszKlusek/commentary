import type { CommentData } from "../types/core";
import { Comment } from "./Comment";

type Props = CommentData & {
  getReplies: (
    commentId: string,
    offset: number,
    limit: number
  ) => Promise<CommentData[]>;
};
export const CommentThread = ({ getReplies, ...props }: Props) => {
  return (
    <commentary-thread>
      <Comment {...props} getReplies={getReplies} />
    </commentary-thread>
  );
};
