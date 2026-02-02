import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import type { CommentItem } from "@shared/src/types/core";
import { useCommentBlock } from "../../../context/CommentBlockContext";
import { useCopy } from "../../../context/CopyContext";
import { handlePluralization } from "../../../copy/utils";
import { CurvedThreadLine } from "../ThreadLine";

type Props = {
  comment: CommentItem;
  type: "comment" | "reply";
  hasReplies: boolean;
  loading: boolean;
  onRepliesToggle?: () => void;
};
export const RepliesControl = ({
  comment,
  type,
  hasReplies,
  loading,
  onRepliesToggle,
}: Props) => {
  const { commentActionLabels } = useCopy();
  const { showReplies, setShowReplies, setCommentBlockStatus } = useCommentBlock();


  const handleRepliesToggle = () => {
    onRepliesToggle?.();

    if (showReplies) {
      setShowReplies(false);
    } else {
      setCommentBlockStatus("open-focused");
      setShowReplies(true);
    }
  };

  if (loading) return null

  return (
    <commentary-replies-control className="flex flex-row">
      {hasReplies && (
        <CurvedThreadLine type={type} />
      )}
      {hasReplies && !loading && (
        <button
          className="
            w-fit 
            flex 
            text-[#ffffff] 
            cursor-pointer 
            hover:bg-white/20 
            rounded-full 
            px-2 
            py-2 
            gap-1
            mb-2
          "
          onClick={handleRepliesToggle}
        >
          <div className="text-[14px] font-medium h-[22px]">
            {showReplies ? (
              <div>{commentActionLabels.hideReplies}</div>
            ) : (
              <div>
                {handlePluralization({
                  quantity: comment.commentStats?.replyCount || 0,
                  rules: commentActionLabels.repliesCount,
                })}
              </div>
            )}
          </div>
          {showReplies ? (
            <ChevronUpIcon width={22} height={22} strokeWidth={2} />
          ) : (
            <ChevronDownIcon width={22} height={22} strokeWidth={2} />
          )}
        </button>
      )}
    </commentary-replies-control>
  );
};
