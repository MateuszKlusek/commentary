import type { CommentaryAPI } from "@shared/src/types/core";
import { useState } from "react";
import { AutoTextarea } from "./AutoTextarea";

type Props = {
  commentaryProps: CommentaryAPI;
  parentId: string | null;
  setReplyInputShown?: (shown: boolean) => void;
  placeholder?: string;
};

export const AddCommentBlock = ({
  commentaryProps,
  parentId,
  setReplyInputShown,
  placeholder = "",
}: Props) => {
  const [replyComment, setReplyComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <AutoTextarea
        placeholder={placeholder}
        value={replyComment}
        id="reply-textarea"
        onChange={(e) => setReplyComment(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && (
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
      )}
    </div>
  );
};
