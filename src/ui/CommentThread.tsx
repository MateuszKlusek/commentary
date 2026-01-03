import type { CommentData } from "@core/types";
import { Comment } from "./Comment";

type Props = CommentData;
export const CommentThread = (props: Props) => {
  return (
    <commentary-thread>
      <Comment {...props} />
    </commentary-thread>
  );
};
