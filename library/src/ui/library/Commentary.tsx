import type { CommentaryAPI, CommentItem, SortingStrategy } from "@shared/src/types/core";
import { useEffect, useState } from "react";
import { useCommentaryAPI } from "../../context/CommentaryAPIContext";
import { ContextWrapper } from "../../context/ContextWrapper";
import { useDynamicCss } from "../../hooks/useDynamicCss";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "../index.css";
import { IntersectionSentinel } from "./atoms/IntersectionSentinel";
import { CommentSkeleton } from "./atoms/SkeletonLoaders";
import { Content } from "./Content";
import { HeaderSection } from "./HeaderSection";
import { Thread } from "./Thread";

const CommentaryComponent = () => {
  const [sortBy, setSortBy] = useState<SortingStrategy>("newest");
  const [newTopLevelComments, setNewTopLevelComments] = useState<CommentItem[]>([]);

  const { getTopLevelComments, user, discussionId, customCss } =
    useCommentaryAPI();

  const { items, loadMore, isLoading: isTopLevelCommentsLoading, hasMore, totalCount, reset, isOnMountLoading } =
    useInfiniteQuery(
      (params) => getTopLevelComments({ sortBy, userId: user?.userId, ...params, }),
      10
    );

  useEffect(() => {
    reset();
    setNewTopLevelComments([]);
  }, [sortBy, user?.userId, discussionId]);

  const ref = useIntersectionObserver(loadMore, hasMore);

  const { isReady } = useDynamicCss(customCss);

  if (!isReady) return <commentary-app-loader />

  return (
    <commentary-container>
      <HeaderSection
        commentsCount={totalCount}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setNewComments={setNewTopLevelComments}
        newTopLevelCommentsCount={newTopLevelComments.length}
        isOnMountLoading={isOnMountLoading}
      />
      <Content>
        {[...newTopLevelComments, ...items]?.map((comment) => (
          <Thread key={comment.comment.commentId} comment={comment} />
        ))}

        {hasMore && <IntersectionSentinel ref={ref} />}

        {isTopLevelCommentsLoading && <CommentSkeleton count={3} />}
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
