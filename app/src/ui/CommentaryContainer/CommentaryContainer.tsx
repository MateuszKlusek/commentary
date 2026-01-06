import type { CommentaryAPI } from "@shared/src/types";
import { CommentThread } from "../CommentThread";
import { Content } from "../Content";
import { HeaderSection } from "../HeaderSection";
import { useLoadInitData } from "./hooks/useLoadInitData";
import { useDynamicCss } from "../../hooks/useDynamicCss";

export const Commentary = (props: CommentaryAPI) => {
  const { commentsCount, comments, isLoading } = useLoadInitData({
    getTopLevelCommentCount: props.getTopLevelCommentCount,
    getTopLevelComments: props.getTopLevelComments,
  });

  const { isReady } = useDynamicCss(props.customCss);
  if (!isReady) return <div>Loading...</div>;

  return (
    <commentary-container id="commentary-container">
      <HeaderSection commentsCount={commentsCount} />
      <Content>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              commentaryProps={props}
              comment={comment}
            />
          ))
        )}
      </Content>
    </commentary-container>
  );
};
