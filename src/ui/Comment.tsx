import { useState } from "react";
import type { CommentData } from "../types/core";

export const Comment = (
  props: CommentData & {
    getReplies: (
      commentId: string,
      offset: number,
      limit: number
    ) => Promise<CommentData[]>;
  }
) => {
  const [replies, setReplies] = useState<CommentData[]>([]);

  const handleReplyClick = async () => {
    const replies = await props.getReplies(props.commendId, 0, 10);
    setReplies(replies);
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
      <div className="flex gap-2 ">
        <div className="flex gap-1">
          <button>Like </button>
          <div>{props.likes}</div>
        </div>
        <div className="flex gap-1">
          <button>Dislike </button>
          <div>{props.dislikes}</div>
        </div>
        <button>Reply</button>
      </div>

      {/*replies  */}
      {props.replyCount > 0 ? (
        <div className="cursor-pointer" onClick={handleReplyClick}>
          Replies {props.replyCount}
        </div>
      ) : null}

      {replies.map((reply) => (
        <Comment key={reply.id} {...reply} getReplies={props.getReplies} />
      ))}
    </div>
  );
};
