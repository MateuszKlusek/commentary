import type { CommentaryAPI } from "@shared/src/types";
import { useState } from "react";
import { AutoTextarea } from "./AutoTextarea";

type Props = {
  commentaryProps: CommentaryAPI;
  parentId: string | null;
  setReplyInputShown?: (shown: boolean) => void;
};

export const AddCommentBlock = ({
  commentaryProps,
  parentId,
  setReplyInputShown,
}: Props) => {
  const [replyComment, setReplyComment] = useState("");

  return (
    <div>
      <AutoTextarea
        placeholder="Add a reply..."
        value={replyComment}
        id="reply-textarea"
        onChange={(e) => setReplyComment(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button onClick={() => setReplyInputShown?.(false)}>Cancel</button>
        <button
          onClick={() =>
            commentaryProps.addComment(
              replyComment,
              commentaryProps.userId || "",
              parentId
            )
          }
        >
          Reply
        </button>
      </div>
    </div>
  );
};
