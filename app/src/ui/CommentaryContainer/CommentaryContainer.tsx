import type { CommentaryAPI } from "@shared/src/types";
import { CommentThread } from "../CommentThread";
import { Content } from "../Content";
import { HeaderSection } from "../HeaderSection";
import { useLoadInitData } from "./hooks/useLoadInitData";

export const Commentary = ({
  getTopLevelCommentCount,
  getTopLevelComments,
  getReplies,
  updateLike,
  addComment,
  userId,
}: CommentaryAPI) => {
  const { commentsCount, comments, isLoading } = useLoadInitData({
    getTopLevelCommentCount,
    getTopLevelComments,
  });

  return (
    <commentary-container>
      <HeaderSection commentsCount={commentsCount} />
      <Content>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              {...comment}
              getReplies={getReplies}
              updateLike={updateLike}
              addComment={addComment}
              userId={userId}
            />
          ))
        )}
      </Content>
    </commentary-container>
  );
};
