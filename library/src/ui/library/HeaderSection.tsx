import type { CommentaryAPI } from "@shared/src/types/core";
import { useCopy } from "../../copy/CopyContext";
import { HStack } from "../layout/HStack";
import { AddCommentBlock } from "./AddCommentBlock";
import { SelectComponent } from "./atoms/Select";

type Props<T> = {
  commentsCount: number;
  commentaryProps: CommentaryAPI;
  sortBy: T;
  setSortBy: (sortBy: T) => void;
};

export const HeaderSection = <T,>({
  commentsCount,
  commentaryProps,
  sortBy,
  setSortBy,
}: Props<T>) => {
  const { comment: commentCopy } = useCopy();
  console.log(commentCopy);
  return (
    <commentary-header>
      <section>
        <HStack className="gap-4">
          <div>
            {/* TODO Add range handling generic function */}
            {commentsCount} {commentCopy[0].label}
          </div>
          <div> Sort By</div>
          <SelectComponent
            options={[
              { label: "Newest", value: "newest" },
              { label: "Top", value: "top" },
            ]}
            value={sortBy?.toString()}
            onValueChange={(value) => setSortBy(value as T)}
          />
        </HStack>
        <HStack className="w-full gap-4 px-2">
          <div>P</div>
          <AddCommentBlock
            commentaryProps={commentaryProps}
            parentId={null}
            placeholder="Add a comment..."
          />
        </HStack>
      </section>
    </commentary-header>
  );
};
