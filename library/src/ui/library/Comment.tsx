import type { CommentItem } from "@shared/src/types/core";
import { Activity, useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import {
  CommentBlockProvider,
  useCommentBlock,
} from "../../context/CommentBlockContext";
import { useCopy } from "../../context/CopyContext";
import { useUser } from "../../context/UserContext";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { useNoUserPopover } from "../../hooks/useNoUserPopover";
import { cn } from "../../utils/style";
import { VStack } from "../layout/VStack";
import { AddCommentBlock } from "./atoms/AddCommentBlock";
import { CommentHeader } from "./atoms/CommentHeader";
import { CommentRender } from "./atoms/CommentRender";
import ImageWithLoader from "./atoms/ImageWithLoader";
import { UserSentimentBlock } from "./atoms/UserSentimentBlock";
import CommentLoader from "./atoms/CommentLoader";
import { RepliesControl } from "./atoms/RepliesControl";
import { ParentThreadLine, ReplyThreadLine } from "./ThreadLine";

type FetchMode = "auto" | "manual";
export type CommentType = "comment" | "reply";

export const ThreadContent = ({
  comment,
  type,
  fetchMode,
}: {
  comment: CommentItem;
  type: CommentType;
  fetchMode: FetchMode;
}) => {
  const [replyInputShown, setReplyInputShown] = useState(false);
  const { showReplies } = useCommentBlock();

  // --------------------------------- hooks ---------------------------------

  const { getReplies, onUserNameClick } =
    useCommentaryAPI();
  const { isUserSet, user } = useUser();

  const {
    addReplyButtonLabel,
    addReplyCancelButtonLabel,
    addReplyPlaceholder,
  } = useCopy();

  const { items, loadMore, loading, hasMore, offset } = useInfiniteQuery(
    (params) =>
      getReplies({
        parentId: comment.comment.commentId,
        userId: user?.userId,
        sortBy: "newest",
        ...params,
      }),
    10,
    { initialFetch: false, enabled: showReplies }
  );

  const ref = useIntersectionObserver(
    loadMore,
    hasMore &&
    showReplies &&
    // allow autofetch for top-level comments and for first page of replies
    (fetchMode === "auto" || offset === 0)
  );

  const { setCommentBlockStatus } = useCommentBlock();
  const { NoUserPopover } = useNoUserPopover({
    enabled: !isUserSet,
  });

  const hasReplies = Boolean(comment.commentStats?.replyCount && comment.commentStats?.replyCount > 0);

  // --------------------------------- handlers ---------------------------------

  const handleReplyClick = () => {
    if (!isUserSet) {
      return;
    }
    setCommentBlockStatus("open-focused");
    setReplyInputShown(true);
  };




  return (
    <>
      <commentary-parent-comment className="w-full flex gap-4 relative">
        <div className="flex flex-col">
          <ImageWithLoader
            src={comment.author?.avatarUrl}
            alt={comment.author?.userId || ""}
            className={cn(
              "rounded-full",
              type === "comment" && "w-9 h-9",
              type === "reply" && "w-6 h-6"
            )}
            id={type === "comment" ? "comment-avatar" : "reply-avatar"}
          />
          {hasReplies && (
            <ParentThreadLine />
          )}

        </div>

        <div className="flex flex-col gap-0 w-full">
          <CommentHeader comment={comment} onUserNameClick={onUserNameClick} />

          <CommentRender text={comment.comment.content} />

          {/* actions */}
          <div className="flex gap-2 flex-col pb-2">
            <div className="flex gap-1">
              <UserSentimentBlock comment={comment} />
              <NoUserPopover>
                <div className="flex gap-1">
                  <button
                    onClick={handleReplyClick}
                    className="text-[#ffffff] cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </NoUserPopover>
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
                  type="reply"
                />
              </div>
            ) : null}
          </div>




          {hasMore && <div ref={ref} className="h-0.25" />}

          {loading && <CommentLoader count={3} className="pb-4" skeletonAvatarSize={6} />}
        </div>

      </commentary-parent-comment>

      <Activity mode={showReplies ? "visible" : "hidden"}>
        {items?.map((reply,) => (
          <commentary-reply-thread className="flex flex-column gap-4 " key={reply.comment.commentId}>
            <ReplyThreadLine type={type} />
            <VStack>
              <ThreadContainer
                key={reply.comment.commentId}
                comment={reply}
                type="reply"
                fetchMode="auto"
              />
            </VStack>
          </commentary-reply-thread>
        ))}


      </Activity>

      <RepliesControl
        comment={comment}
        type={type}
        hasReplies={hasReplies}
        loading={loading}
      />

    </>
  );
};

export const ThreadContainer = (props: {
  comment: CommentItem;
  type: CommentType;
  fetchMode: FetchMode;
}) => {
  return (
    <CommentBlockProvider>
      <ThreadContent {...props} />
    </CommentBlockProvider>
  );
};
