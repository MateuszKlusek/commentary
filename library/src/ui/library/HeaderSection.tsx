import { useState } from "react";
import { AutoTextarea } from "./AutoTextarea";
import { HStack } from "../layout/HStack";

type Props = {
  commentsCount: number;
};

export const HeaderSection = ({ commentsCount }: Props) => {
  const [comment, setComment] = useState("");

  return (
    <commentary-header>
      <section id="header-section testing" className="">
        <HStack>
          <div>{commentsCount} Comments</div>
          <div> Sort By</div>
        </HStack>
        <HStack className="w-full gap-4">
          <div>P</div>
          <AutoTextarea
            placeholder="Add a comment..."
            value={comment}
            id="comment-textarea"
            onChange={(e) => setComment(e.target.value)}
          />
        </HStack>
      </section>
    </commentary-header>
  );
};
