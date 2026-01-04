import { useState } from "react";
import type { CommentaryRepository, CommentData } from "../types/core";

export const Comment = (props: CommentData & CommentaryRepository) => {
  const [replies, setReplies] = useState<CommentData[]>([]);
  const [repliesShown, setRepliesShown] = useState(false);
  const [replyInputShown, setReplyInputShown] = useState(false);

  const handleReplyClick = async () => {
    const replies = await props.getReplies(props.commendId, 0, 10);
    setReplies(replies);
    setRepliesShown(true);
  };

  const handleLikeClick = async () => {
    await props.updateLike(props.commendId, true);
  };

  const handleDislikeClick = async () => {
    await props.updateLike(props.commendId, false);
  };

  const handleReply = async () => {
    await props.addComment(props.content, props.userId, props.commendId);
  };

  return (
    <div className="w-full p-2">
      {/* header */}
      <div className="flex ">
        <div>icon</div>

        <div>{props.userId}</div>

        <div>{new Date(props.createdAt).toLocaleDateString()}</div>
      </div>

      {/* content */}
      <div className="text-sm">{props.content}</div>

      {/* actions */}
      <div className="flex gap-2 flex-col">
        <div className="flex gap-1">
          <div className="flex gap-1">
            <button onClick={handleLikeClick}>Like </button>
            <div>{props.likes}</div>
          </div>
          <div className="flex gap-1">
            <button onClick={handleDislikeClick}>Dislike </button>
            <div>{props.dislikes}</div>
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
              <button onClick={handleReply}>Reply</button>
            </div>
          </div>
        ) : null}
      </div>

      {/*replies  */}
      {props.replyCount > 0 && !repliesShown ? (
        <div
          className="cursor-pointer text-amber-600 w-fit"
          onClick={handleReplyClick}
        >
          Replies {props.replyCount}
        </div>
      ) : null}

      <div className="ml-4">
        {replies.map((reply) => (
          <Comment key={reply.id} {...props} />
        ))}
      </div>
    </div>
  );
};
