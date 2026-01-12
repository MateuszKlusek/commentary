import { useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import { AutoTextarea } from "./AutoTextarea";

type Props = {
  parentId: string | null;
  setReplyInputShown?: (shown: boolean) => void;
  placeholder?: string;
};

export const AddCommentBlock = ({
  parentId,
  setReplyInputShown,
  placeholder = "",
}: Props) => {
  const [replyComment, setReplyComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { addComment, userId } = useCommentaryAPI();
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
            onClick={() => addComment(replyComment, userId || "", parentId)}
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
};
