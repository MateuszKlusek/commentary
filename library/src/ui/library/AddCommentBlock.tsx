import { useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import { AutoTextarea } from "./AutoTextarea";
import { useCommentBlockStatus } from "../../context/CommentBlockStatusContext";

type Props = {
  parentId: string | null;
  setReplyInputShown?: (shown: boolean) => void;
  placeholder: string;
  actionButtonLabel: string;
  cancelButtonLabel: string;
};

export const AddCommentBlock = ({
  parentId,
  setReplyInputShown,
  actionButtonLabel,
  cancelButtonLabel,
  placeholder,
}: Props) => {
  const [replyComment, setReplyComment] = useState("");
  const { addComment, user } = useCommentaryAPI();
  const { commentBlockStatus, setCommentBlockStatus } = useCommentBlockStatus();
  const handleCancel = () => {
    setReplyInputShown?.(false);
    setCommentBlockStatus?.("closed");
  };

  const handleOnFocus = () => {
    setCommentBlockStatus?.("open-focused");
  };

  const handleOnBlur = () => {
    setCommentBlockStatus?.("open-blurred");
  };

  return (
    <div className="w-full">
      <AutoTextarea
        placeholder={placeholder}
        value={replyComment}
        id="reply-textarea"
        onChange={(e) => setReplyComment(e.target.value)}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
      {commentBlockStatus === "open-focused" && (
        <div className="flex justify-end gap-2">
          <button onClick={handleCancel}>{cancelButtonLabel}</button>
          <button
            onClick={() =>
              addComment(replyComment, user?.userId || "", parentId)
            }
          >
            {actionButtonLabel}
          </button>
        </div>
      )}
    </div>
  );
};
