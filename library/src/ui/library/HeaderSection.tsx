import type { CommentaryAPI } from "@shared/src/types";
import { HStack } from "../layout/HStack";
import { AddCommentBlock } from "./AddCommentBlock";

type Props = {
  commentsCount: number;
  commentaryProps: CommentaryAPI;
};

export const HeaderSection = ({ commentsCount, commentaryProps }: Props) => {
  return (
    <commentary-header>
      <section id="header-section testing" className="">
        <HStack>
          <div>{commentsCount} Comments</div>
          <div> Sort By</div>
        </HStack>
        <HStack className="w-full gap-4">
          <div>P</div>
          <AddCommentBlock commentaryProps={commentaryProps} parentId={null} />
        </HStack>
      </section>
    </commentary-header>
  );
};
