import type { CommentData } from "../types/core";
import { Comment } from "./Comment";

type Props = CommentData;
export const CommentThread = (props: Props) => {
  return (
    <commentary-thread>
      <Comment {...props} />
    </commentary-thread>
  );
};
