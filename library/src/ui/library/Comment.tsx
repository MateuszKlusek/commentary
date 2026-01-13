import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import type { CommentData } from "@shared/src/types/core";
import { Activity, useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import {
  CommentBlockStatusProvider,
  useCommentBlockStatus,
} from "../../context/CommentBlockStatusContext";
import { useCopy } from "../../copy/CopyContext";
import { handlePluralization } from "../../copy/utils";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { cn } from "../../utils/style";
import { AddCommentBlock } from "./AddCommentBlock";
import { CommentHeader } from "./atoms/CommentHeader";
import { CommentRender } from "./atoms/CommentRender";
import ImageWithLoader from "./atoms/ImageWithLoader";
import CommentLoader from "./misc/CommentLoader";

export const CommentContent = ({
  comment,
  type,
}: {
  comment: CommentData;
  type: "comment" | "reply";
}) => {
  const [repliesShown, setRepliesShown] = useState(false);
  const [replyInputShown, setReplyInputShown] = useState(false);

  const { getReplies, onUserNameClick, updateLike, user } = useCommentaryAPI();
  const {
    addReplyButtonLabel,
    addReplyCancelButtonLabel,
    addReplyPlaceholder,
    commentActionLabels,
  } = useCopy();

  const { items, loadMore, loading, hasMore } = useInfiniteQuery(
    (params) =>
      getReplies({
        parentId: comment.commentId,
        ...params,
      }),
    10,
    { initialFetch: false, enabled: repliesShown }
  );

  const sentinelRef = useIntersectionObserver(
    loadMore,
    hasMore && repliesShown
  );

  const { setCommentBlockStatus } = useCommentBlockStatus();

  const handleReplyClick = () => {
    setCommentBlockStatus("open-focused");
    setReplyInputShown(true);
  };

  const handleShowMoreReplies = () => {
    setCommentBlockStatus("open-focused");
    setRepliesShown(true);
  };

  const handleHideReplies = () => {
    setRepliesShown(false);
  };

  return (
    <div className="w-full flex gap-4 pb-4">
      <ImageWithLoader
        src={comment.author.avatarUrl || ""}
        alt={comment.author.id}
        className={cn(
          " rounded-full",
          type === "comment" && "w-9 h-9",
          type === "reply" && "w-6 h-6"
        )}
        id={type === "comment" ? "comment-avatar" : "reply-avatar"}
      />

      <div className="flex flex-col gap-2 w-full">
        <CommentHeader
          comment={comment}
          onUserNameClick={() => onUserNameClick?.(comment.author.id)}
        />

        <CommentRender text={comment.content} />

        {/* actions */}
        <div className="flex gap-2 flex-col">
          <div className="flex gap-1">
            <div className="flex gap-1">
              <button onClick={() => updateLike(comment.commentId, true)}>
                Like{" "}
              </button>
              <div>{comment.likes}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => updateLike(comment.commentId, false)}>
                Dislike{" "}
              </button>
              <div>{comment.dislikes}</div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleReplyClick}
                className="text-[#ffffff] cursor-pointer"
              >
                Reply
              </button>
            </div>
          </div>
          {replyInputShown ? (
            <div className="flex gap-4">
              <ImageWithLoader
                src={user?.avatarUrl || ""}
                className="rounded-full w-6 h-6"
              />
              <AddCommentBlock
                parentId={comment.commentId}
                placeholder={addReplyPlaceholder}
                actionButtonLabel={addReplyButtonLabel}
                cancelButtonLabel={addReplyCancelButtonLabel}
                setReplyInputShown={setReplyInputShown}
              />
            </div>
          ) : null}
        </div>

        <Activity mode={repliesShown ? "visible" : "hidden"}>
          {items?.map((reply) => (
            <Comment key={reply.id} comment={reply} type="reply" />
          ))}
        </Activity>

        {comment.replyCount > 0 && (
          <div className="cursor-pointer w-fit flex text-[#ffffff] text-[16px] font-medium">
            {repliesShown ? (
              <button onClick={handleHideReplies}>
                {commentActionLabels.hideReplies}
              </button>
            ) : (
              <button onClick={handleShowMoreReplies}>
                {handlePluralization({
                  quantity: comment.replyCount,
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

        {hasMore && (
          <div ref={sentinelRef} className="h-0.5 bg-red-100 opacity-20" />
        )}

        {loading && <CommentLoader count={3} />}
      </div>
    </div>
  );
};

export const Comment = ({
  comment,
  type,
}: {
  comment: CommentData;
  type: "comment" | "reply";
}) => {
  return (
    <CommentBlockStatusProvider>
      <CommentContent comment={comment} type={type} />
    </CommentBlockStatusProvider>
  );
};
