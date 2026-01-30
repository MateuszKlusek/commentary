import type { CommentItem } from "@shared/src/types/core";
import type { Dispatch, SetStateAction } from "react";
import {
  CommentBlockProvider,
  useCommentBlock,
} from "../../context/CommentBlockContext";
import { useCopy } from "../../context/CopyContext";
import { useUser } from "../../context/UserContext";
import { handlePluralization } from "../../copy/utils";
import { useFrozenValue } from "../../hooks/useFrozenValue";
import { useNoUserPopover } from "../../hooks/useNoUserPopover";
import { cn } from "../../utils/style";
import { HStack } from "../layout/HStack";
import { AddCommentBlock } from "./atoms/AddCommentBlock";
import ImageWithLoader from "./atoms/ImageWithLoader";
import { SortingStrategySelector } from "./atoms/SortingStrategySelector";

type Props<T> = {
  commentsCount: number;
  setNewComments: Dispatch<SetStateAction<CommentItem[]>>;
  sortBy: T;
  setSortBy: (sortBy: T) => void;
};

export const HeaderSectionContent = <T,>({
  commentsCount,
  sortBy,
  setSortBy,
  setNewComments,
}: Props<T>) => {
  const {
    comment: commentCopy,
    addCommentButtonLabel,
    addCommentCancelButtonLabel,
    sortingOptions,
    sortByLabel,
    addCommentPlaceholder,
  } = useCopy();

  const { isUserSet, user } = useUser();

  const { commentBlockStatus } = useCommentBlock();
  const { NoUserPopover, setIsOpen } = useNoUserPopover({
    mode: "manual",
    enabled: !isUserSet,
  });

  const frozenCount = useFrozenValue(commentsCount, commentsCount > 0)

  return (
    <commentary-header className="pb-8">
      <HStack className="gap-4 items-center h-7 mb-6">
        <div className="text-[20px] text-[#ffffff] font-bold">
          {handlePluralization({
            quantity: frozenCount,
            rules: commentCopy,
          })}
        </div>
        <SortingStrategySelector
          options={sortingOptions}
          value={sortBy?.toString()}
          onValueChange={(value) => setSortBy(value as T)}
        />
        <span className="text-[14px] text-[#f1f1f1] font-medium">{sortByLabel}</span>
      </HStack>
      <HStack className="w-full gap-4 ">
        <NoUserPopover>
          <ImageWithLoader
            src={user?.avatarUrl || ""}
            className={cn(
              "rounded-full",
              commentBlockStatus === "closed" ? "min-w-6 min-h-6 w-6 h-6" : "min-w-10 min-h-10 w-10 h-10"
            )}
          />
        </NoUserPopover>

        <AddCommentBlock
          parentId={null}
          placeholder={addCommentPlaceholder}
          actionButtonLabel={addCommentButtonLabel}
          cancelButtonLabel={addCommentCancelButtonLabel}
          type="comment"
          handlePopoverOpen={() => setIsOpen(true)}
          setNewComments={setNewComments}
        />
      </HStack>
    </commentary-header>
  );
};

export const HeaderSection = <T,>({
  commentsCount,
  sortBy,
  setSortBy,
  setNewComments,
}: Props<T>) => {
  return (
    <CommentBlockProvider>
      <HeaderSectionContent
        commentsCount={commentsCount}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setNewComments={setNewComments}
      />
    </CommentBlockProvider>
  );
};
