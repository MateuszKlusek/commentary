import type { Nullable } from "@shared/src/types/helpers";
import { useState } from "react";
import { useCommentaryAPI } from "../../../context/CommentaryAPIContext";
import { useCommentBlockStatus } from "../../../context/CommentBlockStatusContext";
import { useUser } from "../../../context/UserContext";
import { AutoTextarea } from "../AutoTextarea";
import type { CommentType } from "../Comment";

type Props = {
  parentId: Nullable<string>;
  setReplyInputShown?: (shown: boolean) => void;
  placeholder: string;
  actionButtonLabel: string;
  cancelButtonLabel: string;
  type: CommentType;
  handlePopoverOpen?: () => void;
};

export const AddCommentBlock = ({
  parentId,
  setReplyInputShown,
  actionButtonLabel,
  cancelButtonLabel,
  placeholder,
  type,
  handlePopoverOpen,
}: Props) => {
  const [replyComment, setReplyComment] = useState("");
  const { addComment, user } = useCommentaryAPI();
  const { commentBlockStatus, setCommentBlockStatus } = useCommentBlockStatus();
  const { isUserSet } = useUser();

  const handleCancel = () => {
    setReplyInputShown?.(false);
    setCommentBlockStatus?.("closed");
  };

  const handleOnFocus = () => {
    if (type === "comment" && !isUserSet) {
      handlePopoverOpen?.();
      return;
    }
    setCommentBlockStatus?.("open-focused");
  };

  const handleOnBlur = () => {
    setCommentBlockStatus?.("open-blurred");
  };

  return (
    <div className="w-full">
      <AutoTextarea
        placeholder={commentBlockStatus === "closed" ? placeholder : ""}
        value={replyComment}
        id="reply-textarea"
        onChange={(e) => setReplyComment(e.target.value)}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
      {commentBlockStatus === "open-focused" && (
        <div className="flex justify-end gap-2">
          <button
            className="text-[#ffffff] cursor-pointer"
            onClick={handleCancel}
          >
            {cancelButtonLabel}
          </button>
          <button
            className="text-[#ffffff] cursor-pointer"
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
