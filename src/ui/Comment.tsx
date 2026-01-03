import type { CommentData } from "../types/core";

export const Comment = (props: CommentData) => {
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
      {props.replyCount > 0 ? <div>Replies {props.replyCount}</div> : null}
    </div>
  );
};
