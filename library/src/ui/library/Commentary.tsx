import type { CommentaryAPI, SortingStrategy } from "@shared/src/types";
import { useEffect, useState, type JSX } from "react";
import { useDynamicCss } from "../../hooks/useDynamicCss";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { CommentThread } from "./CommentThread";
import { Content } from "./Content";
import { HeaderSection } from "./HeaderSection";

import "../index.css";

export function Commentary(props: CommentaryAPI): JSX.Element {
  const [sortBy, setSortBy] = useState<SortingStrategy>("newest");

  const { items, loadMore, loading, hasMore, totalCount, reset } =
    useInfiniteQuery(
      (params) => props.getTopLevelComments({ sortBy, ...params }),
      10
    );

  useEffect(() => {
    reset();
  }, [sortBy, props.userId, props.discussionId]);

  const sentinelRef = useIntersectionObserver(loadMore, hasMore);

  const { isReady } = useDynamicCss(props.customCss);
  // TODO add loader
  if (!isReady) return <div>Loading...</div>;

  return (
    <commentary-container id="commentary-container">
      <HeaderSection
        commentsCount={totalCount}
        commentaryProps={props}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <Content>
        {items?.map((comment) => (
          <CommentThread
            key={comment.id}
            commentaryProps={props}
            comment={comment}
          />
        ))}
        {hasMore && <div ref={sentinelRef} className="h-1 bg-red-500" />}

        {loading && <div>Loading...</div>}
      </Content>
    </commentary-container>
  );
}
