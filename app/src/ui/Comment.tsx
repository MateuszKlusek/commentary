import type { CommentaryAPI, CommentData } from "@shared/src/types";
import { useState } from "react";

export const Comment = ({
  commentaryProps,
  comment,
}: {
  commentaryProps: CommentaryAPI;
  comment: CommentData;
}) => {
  const [replies, setReplies] = useState<CommentData[]>([]);
  const [repliesShown, setRepliesShown] = useState(false);
  const [replyInputShown, setReplyInputShown] = useState(false);

  const handleReplyClick = async () => {
    const replies = await commentaryProps.getReplies(comment.commentId, 0, 10);
    console.log({ replies });
    setReplies(replies || []);
    setRepliesShown(true);
  };

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
          <div className="border-2 border-gray-300 rounded-md p-2">
            <textarea className="w-full" />
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

      {/*replies  */}
      {comment.replyCount > 0 && !repliesShown ? (
        <div
          className="cursor-pointer text-amber-600 w-fit"
          onClick={handleReplyClick}
        >
          Replies {comment.replyCount}
        </div>
      ) : null}

      <div className="ml-4">
        {replies?.map((reply) => (
          <Comment
            key={reply.commentId}
            commentaryProps={commentaryProps}
            comment={reply}
          />
        ))}
      </div>
    </div>
  );
};
