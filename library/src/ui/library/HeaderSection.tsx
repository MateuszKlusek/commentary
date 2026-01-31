import type { CommentItem } from "@shared/src/types/core";
import { type Dispatch, type SetStateAction } from "react";
import {
  CommentBlockProvider,
  useCommentBlock,
} from "../../context/CommentBlockContext";
import { useCopy } from "../../context/CopyContext";
import { useUser } from "../../context/UserContext";
import { handlePluralization } from "../../copy/utils";
import { useLockedValue } from "../../hooks/useLockedValue";
import { useNoUserPopover } from "../../hooks/useNoUserPopover";
import { cn } from "../../utils/style";
import { HStack } from "../layout/HStack";
import { AddCommentBlock } from "./atoms/AddCommentBlock";
import ImageWithLoader from "./atoms/ImageWithLoader";
import { GenericSkeletonItem } from "./atoms/SkeletonLoaders";
import { SortingStrategySelector } from "./atoms/SortingStrategySelector";

type Props<T> = {
  commentsCount: number;
  setNewComments: Dispatch<SetStateAction<CommentItem[]>>;
  sortBy: T;
  setSortBy: (sortBy: T) => void;
  newTopLevelCommentsCount: number;
  onMountLoading: boolean;
};

export const HeaderSectionContent = <T,>({
  commentsCount,
  sortBy,
  setSortBy,
  setNewComments,
  newTopLevelCommentsCount,
  onMountLoading
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

  const frozenCount = useLockedValue({
    lockedValue: commentsCount,
    stableValue: newTopLevelCommentsCount,
    condition: commentsCount > 0
  })

  return (
    <commentary-header className="flex flex-col pb-5 gap-6">
      <HStack className="gap-4 items-center ">
        {onMountLoading ? (
          <GenericSkeletonItem className="h-[28px] w-[180px]" />
        ) : (
          <div className="text-[20px] text-[#ffffff] font-bold">
            {handlePluralization({
              quantity: frozenCount,
              rules: commentCopy,
            })}
          </div>)}
        {onMountLoading ? (
          <GenericSkeletonItem className="h-[28px] w-[80px]" />
        ) : (
          <>
            <SortingStrategySelector
              options={sortingOptions}
              value={sortBy?.toString()}
              onValueChange={(value) => setSortBy(value as T)}
            />
            <span className="text-[14px] text-[#f1f1f1] font-medium">{sortByLabel}</span>
          </>
        )}
      </HStack>
      <HStack className="w-full gap-4 min-h-10">
        <NoUserPopover>
          {onMountLoading ? (
            <GenericSkeletonItem className="h-[40px] w-[40px]" innerClassName="rounded-full" />
          ) : (
            <ImageWithLoader
              src={user?.avatarUrl || ""}
              className={cn(
                "rounded-full",
                commentBlockStatus === "closed" ? "min-w-6 min-h-6 w-6 h-6" : "min-w-10 min-h-10 w-10 h-10"
              )}
            />
          )}
        </NoUserPopover>

        {onMountLoading ? (
          <div className="flex flex-col gap-2 w-full self-start">
            <GenericSkeletonItem className="h-3.5 w-1/12" />
            <GenericSkeletonItem className="h-[2px] w-full" />
          </div>
        ) : (
          <AddCommentBlock
            parentId={null}
            placeholder={addCommentPlaceholder}
            actionButtonLabel={addCommentButtonLabel}
            cancelButtonLabel={addCommentCancelButtonLabel}
            type="comment"
            handlePopoverOpen={() => setIsOpen(true)}
            setNewComments={setNewComments}
          />)}
      </HStack>
    </commentary-header>
  );
};

export const HeaderSection = <T,>({
  commentsCount,
  newTopLevelCommentsCount,
  sortBy,
  setSortBy,
  setNewComments,
  onMountLoading,
}: Props<T>) => {
  return (
    <CommentBlockProvider>
      <HeaderSectionContent
        commentsCount={commentsCount}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setNewComments={setNewComments}
        newTopLevelCommentsCount={newTopLevelCommentsCount}
        onMountLoading={onMountLoading}
      />
    </CommentBlockProvider>
  );
};
