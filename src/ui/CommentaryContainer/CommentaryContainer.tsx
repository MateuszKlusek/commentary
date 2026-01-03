import type { CommentaryRepository } from "../../types/core";
import { CommentThread } from "../CommentThread";
import { Content } from "../Content";
import { HeaderSection } from "../HeaderSection";
import { useLoadInitData } from "./hooks/useLoadInitData";

export const Commentary = ({
  getTopLevelCommentCount,
  getTopLevelComments,
  getReplies,
}: CommentaryRepository) => {
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
            />
          ))
        )}
      </Content>
    </commentary-container>
  );
};
