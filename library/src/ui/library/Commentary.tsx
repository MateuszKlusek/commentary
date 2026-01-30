import type { CommentaryAPI, CommentItem, SortingStrategy } from "@shared/src/types/core";
import { useEffect, useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import { ContextWrapper } from "../../context/ContextWrapper";
import { useDynamicCss } from "../../hooks/useDynamicCss";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "../index.css";
import CommentLoader from "./atoms/CommentLoader";
import { Content } from "./Content";
import { HeaderSection } from "./HeaderSection";
import { Thread } from "./Thread";

const CommentaryComponent = () => {
  const [sortBy, setSortBy] = useState<SortingStrategy>("newest");
  const [newTopLevelComments, setNewTopLevelComments] = useState<CommentItem[]>([]);

  const { getTopLevelComments, user, discussionId, customCss } =
    useCommentaryAPI();

  const { items, loadMore, loading, hasMore, totalCount, reset } =
    useInfiniteQuery(
      (params) => getTopLevelComments({ sortBy, userId: user?.userId, ...params, }),
      10
    );

  useEffect(() => {
    reset();
  }, [sortBy, user?.userId, discussionId]);

  const ref = useIntersectionObserver(loadMore, hasMore);
  const { isReady } = useDynamicCss(customCss);

  // TODO add loader
  if (!isReady) return <div>Loading...</div>;

  return (
    <commentary-container>
      <HeaderSection
        commentsCount={totalCount}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setNewComments={setNewTopLevelComments}
      />
      <Content>
        {[...newTopLevelComments, ...items]?.map((comment) => (
          <Thread key={comment.comment.commentId} comment={comment} />
        ))}

        {/* TODO: rethink approach */}
        {hasMore && <div ref={ref} className="h-0.5" />}

        {loading && <CommentLoader count={3} />}
      </Content>
    </commentary-container>
  );
};

export const Commentary = (commentaryAPI: CommentaryAPI) => {
  return (
    <ContextWrapper commentaryAPI={commentaryAPI}>
      <CommentaryComponent />
    </ContextWrapper>
  );
};
