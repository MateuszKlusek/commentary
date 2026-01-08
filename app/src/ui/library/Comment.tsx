import type { CommentaryAPI, CommentData } from "@shared/src/types";
import { useState } from "react";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { AutoTextarea } from "./AutoTextarea";

export const Comment = ({
  commentaryProps,
  comment,
}: {
  commentaryProps: CommentaryAPI;
  comment: CommentData;
}) => {
  const [repliesShown, setRepliesShown] = useState(false);
  const [replyInputShown, setReplyInputShown] = useState(false);
  const [replyComment, setReplyComment] = useState("");

  const handleReplyClick = async () => {
    setRepliesShown(true);
  };

  const { items, loadMore, loading, hasMore } = useInfiniteQuery(
    (params) =>
      commentaryProps.getReplies({
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
    <div className="w-full p-2">
      {/* header */}
      <div className="flex ">
        <div>icon</div>

        <div>{commentaryProps.userId}</div>

        <div>{new Date(comment.createdAt).toLocaleDateString()}</div>
      </div>

      {/* content */}
      <div className="text-sm">{comment.content}</div>

      {/* actions */}
      <div className="flex gap-2 flex-col">
        <div className="flex gap-1">
          <div className="flex gap-1">
            <button
              onClick={() =>
                commentaryProps.updateLike(comment.commentId, true)
              }
            >
              Like{" "}
            </button>
            <div>{comment.likes}</div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() =>
                commentaryProps.updateLike(comment.commentId, false)
              }
            >
              Dislike{" "}
            </button>
            <div>{comment.dislikes}</div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setReplyInputShown(true)}>Reply</button>
          </div>
        </div>
        {replyInputShown ? (
          <div className="">
            <AutoTextarea
              placeholder="Add a reply..."
              value={replyComment}
              id="reply-textarea"
              onChange={(e) => setReplyComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setReplyInputShown(false)}>Cancel</button>
              <button
                onClick={() =>
                  commentaryProps.addComment(
                    comment.content,
                    commentaryProps.userId || "",
                    comment.commentId
                  )
                }
              >
                Reply
              </button>
            </div>
          </div>
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
          <Comment
            key={reply.id}
            commentaryProps={commentaryProps}
            comment={reply}
          />
        ))}
        {hasMore && <div ref={sentinelRef} className="h-0.5 bg-red-100" />}

        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
};
