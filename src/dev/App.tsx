import { Comment } from "@ui/Comment";
import CommentaryContainer from "@ui/CommentaryContainer.tsx";
import { MockCommentarySection } from "@ui/MockCommentarySection";
import { useState } from "react";
import { comments } from "../../mock/comments";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full ">
      <h1 className="text-2xl font-bold">draft</h1>
      <button onClick={() => setCount(count + 1)}>click me {count}</button>
      <MockCommentarySection />
      {comments.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
      <CommentaryContainer />
    </div>
  );
}

export default App;
