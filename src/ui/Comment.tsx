import type { CommentData } from "@core/types";

export const Comment = (props: CommentData) => {
  console.log(props);
  return (
    <div className="w-full p-2">
      {/* header */}
      <div className="flex ">
        <div>icon</div>

        <div>{props.userId}</div>

        <div>{new Date(props.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
};
