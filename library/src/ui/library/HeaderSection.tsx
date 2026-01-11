import type { CommentaryAPI } from "@shared/src/types";
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
  return (
    <commentary-header>
      <section id="header-section testing" className="">
        <HStack className="gap-4">
          <div>{commentsCount} Comments</div>
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
          <AddCommentBlock commentaryProps={commentaryProps} parentId={null} />
        </HStack>
      </section>
    </commentary-header>
  );
};
