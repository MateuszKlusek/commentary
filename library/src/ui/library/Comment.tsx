import type { CommentData } from "@shared/src/types/core";
import { useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { cn } from "../../utils/style";
import { AddCommentBlock } from "./AddCommentBlock";
import ImageWithLoader from "./atoms/ImageWithLoader";

export const Comment = ({ comment }: { comment: CommentData }) => {
  const [repliesShown, setRepliesShown] = useState(false);
  const [replyInputShown, setReplyInputShown] = useState(false);

  const { getReplies, onUserNameClick, updateLike } = useCommentaryAPI();

  const handleReplyClick = async () => {
    setRepliesShown(true);
  };

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

  return (
    <div className="w-full p-2 flex gap-2">
      <ImageWithLoader
        src={comment.author.avatarUrl || ""}
        alt={comment.author.id}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <div
            className={cn("font-bold", onUserNameClick && "cursor-pointer")}
            onClick={() => onUserNameClick?.(comment.author.id)}
          >
            @{comment.author.name}
          </div>

          <div>{new Date(comment.createdAt).toLocaleDateString()}</div>
        </div>

        {/* content */}
        <div className="text-sm">{comment.content}</div>

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
              <button onClick={() => setReplyInputShown(true)}>Reply</button>
            </div>
          </div>
          {replyInputShown ? (
            <AddCommentBlock
              parentId={comment.commentId}
              setReplyInputShown={setReplyInputShown}
            />
          ) : null}
        </div>

        {comment.replyCount > 0 && !repliesShown ? (
          <div
            className="cursor-pointer text-amber-600 w-fit"
            onClick={handleReplyClick}
          >
            Replies {comment.replyCount}
          </div>
        ) : null}

        <div className="ml-4">
          {items?.map((reply) => (
            <Comment key={reply.id} comment={reply} />
          ))}
          {hasMore && <div ref={sentinelRef} className="h-0.5 bg-red-100" />}

          {loading && <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
};
