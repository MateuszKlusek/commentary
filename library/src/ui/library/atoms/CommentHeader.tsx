import type { CommentItem } from "@shared/src/types/core";
import { cn } from "../../../utils/style";

type Props = {
  comment: CommentItem;
  onUserNameClick?: (userId: string) => void;
};
export const CommentHeader = ({ comment, onUserNameClick }: Props) => {
  return (
    <div className="flex items-center gap-0.5 h-5 " id="comment-header">
      <div
        className={cn(
          "font-bold text-[13px] text-[#f1f1f1]",
          onUserNameClick && "cursor-pointer"
        )}
        onClick={() => onUserNameClick?.(comment.author?.id || "")}
      >
        @{comment.author?.name || "Anonymous"}
      </div>

      <div className="text-[12px] text-[#AAAAAA]">
        {new Date(comment.comment.createdAt).toLocaleString()}
      </div>
    </div>
  );
};
