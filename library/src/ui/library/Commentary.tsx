import type { CommentaryAPI, SortingStrategy } from "@shared/src/types/core";
import { useEffect, useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import { ContextWrapper } from "../../context/ContextWrapper";
import { useDynamicCss } from "../../hooks/useDynamicCss";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "../index.css";
import { CommentThread } from "./CommentThread";
import { Content } from "./Content";
import { HeaderSection } from "./HeaderSection";

const CommentaryComponent = () => {
  const [sortBy, setSortBy] = useState<SortingStrategy>("newest");

  const { getTopLevelComments, user, discussionId, customCss } =
    useCommentaryAPI();

  const { items, loadMore, loading, hasMore, totalCount, reset } =
    useInfiniteQuery(
      (params) => getTopLevelComments({ sortBy, ...params }),
      10
    );

  useEffect(() => {
    reset();
  }, [sortBy, user?.userId, discussionId]);

  const sentinelRef = useIntersectionObserver(loadMore, hasMore);
  const { isReady } = useDynamicCss(customCss);

  // TODO add loader
  if (!isReady) return <div>Loading...</div>;

  return (
    <commentary-container>
      <HeaderSection
        commentsCount={totalCount}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <Content>
        {items?.map((comment) => (
          <CommentThread key={comment.id} comment={comment} />
        ))}
        {hasMore && <div ref={sentinelRef} className="h-1 bg-red-500" />}

        {loading && <div>Loading...</div>}
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
