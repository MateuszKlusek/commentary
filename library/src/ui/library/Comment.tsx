import type { CommentItem } from "@shared/src/types/core";
import { Activity, type Dispatch, type SetStateAction, useState } from "react";
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
import { IntersectionSentinel } from "./atoms/IntersectionSentinel";
import { RepliesControl } from "./atoms/RepliesControl";
import { CommentSkeleton } from "./atoms/SkeletonLoaders";
import { UserSentimentBlock } from "./atoms/UserSentimentBlock";
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
  const [newReplies, setNewReplies] = useState<CommentItem[]>([]);

  // --------------------------------- hooks ---------------------------------

  const { getReplies, onUserNameClick } =
    useCommentaryAPI();
  const { isUserSet, user } = useUser();

  const {
    addReplyButtonLabel,
    addReplyCancelButtonLabel,
    addReplyPlaceholder,
  } = useCopy();

  const { items: replies, loadMore, isLoading: isRepliesLoading, hasMore, offset } = useInfiniteQuery(
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
              type === "comment" && "min-w-9 min-h-9 w-9 h-9",
              type === "reply" && "min-w-6 min-h-6 w-6 h-6"
            )}
            id={type === "comment" ? "comment-avatar" : "reply-avatar"}
          />
          {(hasReplies || newReplies.length > 0) && (
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
                  setNewComments={setNewReplies}
                  type="reply"
                />
              </div>
            ) : null}
          </div>


        </div>

      </commentary-parent-comment>

      {/* new replies */}
      {newReplies?.map((reply, idx) => (
        <commentary-reply-thread className="flex flex-row gap-4" key={reply.comment.commentId}>
          <ReplyThreadLine type={type} parts={showReplies || idx !== newReplies.length - 1 || replies.length > 0 ? ["straight", "curved"] : ["curved"]} />
          <VStack>
            <ThreadContainer
              key={reply.comment.commentId}
              comment={reply}
              type="reply"
              fetchMode="auto"
              setNewComments={setNewReplies}
            />
          </VStack>
        </commentary-reply-thread>
      ))}

      {/* replies */}
      <Activity mode={showReplies ? "visible" : "hidden"}>
        {replies?.map((reply) => (
          <commentary-reply-thread className="flex flex-row gap-4" key={reply.comment.commentId}>
            <ReplyThreadLine type={type} />
            <VStack>
              <ThreadContainer
                key={reply.comment.commentId}
                comment={reply}
                type="reply"
                fetchMode="auto"
                setNewComments={setNewReplies}
              />
            </VStack>
          </commentary-reply-thread>
        ))}

      </Activity>

      {hasMore && <IntersectionSentinel ref={ref} />}

      {/* skeleton loader */}
      {isRepliesLoading && (new Array(3).fill(0).map((_, idx) => (
        <commentary-reply-skeleton className="flex flex-row gap-4">
          <ReplyThreadLine type={type} parts={idx !== 2 ? ["curved", "straight"] : ["curved"]} />
          <CommentSkeleton key={`skeleton-${idx}`} className="pb-4 w-full" skeletonAvatarSize={6} count={1} />
        </commentary-reply-skeleton>
      ))
      )}

      <RepliesControl
        comment={comment}
        type={type}
        hasReplies={hasReplies}
        loading={isRepliesLoading}
      />
    </>
  );
};

export const ThreadContainer = (props: {
  comment: CommentItem;
  type: CommentType;
  fetchMode: FetchMode;
  setNewComments?: Dispatch<SetStateAction<CommentItem[]>>;
}) => {
  return (
    <CommentBlockProvider>
      <ThreadContent {...props} />
    </CommentBlockProvider>
  );
};
