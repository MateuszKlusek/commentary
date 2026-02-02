import type { CommentItem } from "@shared/src/types/core";
import type { Nullable } from "@shared/src/types/helpers";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useCommentaryAPI } from "../../../context/CommentaryAPIContext";
import { useCommentBlock } from "../../../context/CommentBlockContext";
import { useUser } from "../../../context/UserContext";
import { AutoTextarea } from "../AutoTextarea";
import type { CommentType } from "../Comment";
import { Button } from "./Button";

type Props = {
  parentId: Nullable<string>;
  setReplyInputShown?: (shown: boolean) => void;
  placeholder: string;
  actionButtonLabel: string;
  cancelButtonLabel: string;
  type: CommentType;
  handlePopoverOpen?: () => void;
  setNewComments?: Dispatch<SetStateAction<CommentItem[]>>;
  onCommentAdded?: () => void;
};

export const AddCommentBlock = ({
  parentId,
  setReplyInputShown,
  actionButtonLabel,
  cancelButtonLabel,
  placeholder,
  type,
  handlePopoverOpen,
  setNewComments,
  onCommentAdded,
}: Props) => {
  const [commentText, setCommentText] = useState("");
  const { addComment, user } = useCommentaryAPI();
  const { commentBlockStatus, setCommentBlockStatus } = useCommentBlock();
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

  const handleAddComment = async () => {
    if (!user?.userId || !setNewComments) return;
    try {
      const newComment = await addComment(commentText, user.userId, parentId);
      console.log("newComment", newComment);
      setNewComments((prev) => [newComment, ...prev]);
      setCommentText("");
      onCommentAdded?.();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }

  };

  return (
    <div className="flex flex-col w-full gap-2">
      <AutoTextarea
        placeholder={commentBlockStatus === "closed" ? placeholder : ""}
        value={commentText}
        id="reply-textarea"
        onChange={(e) => setCommentText(e.target.value)}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
      {commentBlockStatus === "open-focused" && (
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel}>{cancelButtonLabel}</Button>
          <Button onClick={handleAddComment}>{actionButtonLabel}</Button>
        </div>
      )}
    </div>
  );
};
