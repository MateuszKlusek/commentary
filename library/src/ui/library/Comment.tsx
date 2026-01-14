import type { CommentData } from "@shared/src/types/core";
import { Activity, useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import {
  CommentBlockStatusProvider,
  useCommentBlockStatus,
} from "../../context/CommentBlockStatusContext";
import { useCopy } from "../../copy/CopyContext";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { cn } from "../../utils/style";
import { AddCommentBlock } from "./AddCommentBlock";
import { CommentHeader } from "./atoms/CommentHeader";
import { CommentRender } from "./atoms/CommentRender";
import ImageWithLoader from "./atoms/ImageWithLoader";
import CommentLoader from "./misc/CommentLoader";
import { RepliesControl } from "./misc/RepliesControl";

export const CommentContent = ({
  comment,
  type,
  fetchMode,
}: {
  comment: CommentData;
  type: "comment" | "reply";
  fetchMode: "auto" | "manual";
}) => {
  const [repliesShown, setRepliesShown] = useState(false);
  const [replyInputShown, setReplyInputShown] = useState(false);

  const { getReplies, onUserNameClick, updateLike, user } = useCommentaryAPI();
  const {
    addReplyButtonLabel,
    addReplyCancelButtonLabel,
    addReplyPlaceholder,
  } = useCopy();

  const { items, loadMore, loading, hasMore, offset } = useInfiniteQuery(
    (params) =>
      getReplies({
        parentId: comment.comment.commentId,
        ...params,
      }),
    10,
    { initialFetch: false, enabled: repliesShown }
  );

  const sentinelRef = useIntersectionObserver(
    loadMore,
    hasMore &&
      repliesShown &&
      // allow autofetch for top-level comments and for first page of replies
      (fetchMode === "auto" || offset === 0)
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
        src={comment.author?.avatarUrl}
        alt={comment.author?.id || ""}
        className={cn(
          "rounded-full",
          type === "comment" && "w-9 h-9",
          type === "reply" && "w-6 h-6"
        )}
        id={type === "comment" ? "comment-avatar" : "reply-avatar"}
      />

      <div className="flex flex-col gap-2 w-full">
        <CommentHeader
          comment={comment}
          onUserNameClick={() => onUserNameClick?.(comment.author?.id || "")}
        />

        <CommentRender text={comment.comment.content} />

        {/* actions */}
        <div className="flex gap-2 flex-col">
          <div className="flex gap-1">
            <div className="flex gap-1">
              <button
                onClick={() => updateLike(comment.comment.commentId, true)}
              >
                Like{" "}
              </button>
              <div>{comment.commentStats?.likeCount || 0}</div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => updateLike(comment.comment.commentId, false)}
              >
                Dislike{" "}
              </button>
              <div>{comment.commentStats?.dislikeCount || 0}</div>
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
                parentId={comment.comment.commentId}
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
            <Comment
              key={reply.comment.id}
              comment={reply}
              type="reply"
              fetchMode="manual"
            />
          ))}
        </Activity>

        <RepliesControl
          comment={comment}
          loading={loading}
          repliesShown={repliesShown}
          handleHideReplies={handleHideReplies}
          handleShowMoreReplies={handleShowMoreReplies}
        />

        {hasMore && (
          <div ref={sentinelRef} className="h-0.5 bg-red-100 opacity-20" />
        )}

        {loading && <CommentLoader count={3} />}
      </div>
    </div>
  );
};

export const Comment = (props: {
  comment: CommentData;
  type: "comment" | "reply";
  fetchMode: "auto" | "manual";
}) => {
  return (
    <CommentBlockStatusProvider>
      <CommentContent {...props} />
    </CommentBlockStatusProvider>
  );
};
