import type { Comment } from "@core/types";
import { useState } from "react";

export const MockCommentarySection = () => {
  const [comments] = useState<Comment[]>([]);

  return (
    <div>
      <h1>Commentary Section</h1>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};
