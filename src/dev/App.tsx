import { Commentary } from "@ui/CommentaryContainer/CommentaryContainer";
import { InMemoryCommentsRepo } from "../adapters/im-memory/comments.repo";

function App() {
  const commentsRepo = new InMemoryCommentsRepo(400);

  return (
    <div className="w-full p-10">
      <Commentary
        getTopLevelCommentCount={() => commentsRepo.getTopLevelCommentCount()}
        getTopLevelComments={(offset, limit) =>
          commentsRepo.getTopLevelComments(offset, limit)
        }
        getReplies={(commentId, offset, limit) =>
          commentsRepo.getReplies(commentId, offset, limit)
        }
      />
    </div>
  );
}

export default App;
