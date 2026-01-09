import type { CommentaryAPI } from "@shared/src/types";
import type { JSX } from "react";
import { useDynamicCss } from "../../hooks/useDynamicCss";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { CommentThread } from "./CommentThread";
import { Content } from "./Content";
import { HeaderSection } from "./HeaderSection";
import "../index.css";

export function Commentary(props: CommentaryAPI): JSX.Element {
  const { items, loadMore, loading, hasMore, totalCount } = useInfiniteQuery(
    props.getTopLevelComments,
    10
  );

  const sentinelRef = useIntersectionObserver(loadMore, hasMore);

  const { isReady } = useDynamicCss(props.customCss);
  // TODO add loader
  if (!isReady) return <div>Loading...</div>;

  return (
    <commentary-container id="commentary-container">
      <HeaderSection commentsCount={totalCount} commentaryProps={props} />
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
