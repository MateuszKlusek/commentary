import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import type { CommentData } from "@shared/src/types/core";
import { useCopy } from "../../../context/CopyContext";
import { handlePluralization } from "../../../copy/utils";

type Props = {
  comment: CommentData;
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
  return (
    <>
      {comment.commentStats?.replyCount > 0 && !loading && (
        <div className="cursor-pointer w-fit flex text-[#ffffff] text-[16px] font-medium">
          {repliesShown ? (
            <button onClick={handleHideReplies} className="cursor-pointer">
              {commentActionLabels.hideReplies}
            </button>
          ) : (
            <button onClick={handleShowMoreReplies} className="cursor-pointer">
              {handlePluralization({
                quantity: comment.commentStats?.replyCount || 0,
                rules: commentActionLabels.repliesCount,
              })}
            </button>
          )}

          {repliesShown ? (
            <ChevronUpIcon width={24} height={24} strokeWidth={2} />
          ) : (
            <ChevronDownIcon width={24} height={24} strokeWidth={4} />
          )}
        </div>
      )}
    </>
  );
};
