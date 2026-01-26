import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import type { CommentItem } from "@shared/src/types/core";
import { useCopy } from "../../../context/CopyContext";
import { handlePluralization } from "../../../copy/utils";

type Props = {
  comment: CommentItem;
  loading: boolean;
  repliesShown: boolean;
  handleHideReplies: () => void;
  handleShowMoreReplies: () => void;
};
export const RepliesControl = ({
  comment,
  handleHideReplies,
  handleShowMoreReplies,
  loading,
  repliesShown,
}: Props) => {
  const { commentActionLabels } = useCopy();

  const handleRepliesToggle = () => {
    if (repliesShown) {
      handleHideReplies();
    } else {
      handleShowMoreReplies();
    }
  };

  return (
    <commentary-replies-control>
      {comment?.commentStats?.replyCount > 0 && !loading && (
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
            {repliesShown ? (
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
          {repliesShown ? (
            <ChevronUpIcon width={22} height={22} strokeWidth={2} />
          ) : (
            <ChevronDownIcon width={22} height={22} strokeWidth={2} />
          )}
        </button>
      )}
    </commentary-replies-control>
  );
};
