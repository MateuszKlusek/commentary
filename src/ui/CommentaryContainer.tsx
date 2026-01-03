import { comments } from "../../mock/comments";
import { CommentThread } from "./CommentThread";
import { Content } from "./Content";
import { HeaderSection } from "./HeaderSection";

type Props = {
  commentsCount: number;
};

const Commentary = ({ commentsCount }: Props) => {
  return (
    <commentary-container>
      <HeaderSection commentsCount={commentsCount} />
      <Content>
        {comments.map((comment) => (
          <CommentThread key={comment.id} {...comment} />
        ))}
      </Content>
    </commentary-container>
  );
};

export default Commentary;
