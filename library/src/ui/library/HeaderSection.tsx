import {
  CommentBlockStatusProvider,
  useCommentBlockStatus,
} from "../../context/CommentBlockStatusContext";
import { useCopy } from "../../context/CopyContext";
import { useUser } from "../../context/UserContext";
import { handlePluralization } from "../../copy/utils";
import { useNoUserPopover } from "../../hooks/useNoUserPopover";
import { cn } from "../../utils/style";
import { HStack } from "../layout/HStack";
import { AddCommentBlock } from "./atoms/AddCommentBlock";
import ImageWithLoader from "./atoms/ImageWithLoader";
import { SortingStrategySelector } from "./atoms/SortingStrategySelector";

type Props<T> = {
  commentsCount: number;
  sortBy: T;
  setSortBy: (sortBy: T) => void;
};

export const HeaderSectionContent = <T,>({
  commentsCount,
  sortBy,
  setSortBy,
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

  const { commentBlockStatus } = useCommentBlockStatus();
  const { NoUserPopover, setIsOpen } = useNoUserPopover({
    mode: "manual",
    enabled: !isUserSet,
  });

  return (
    <commentary-header>
      <section className="pb-8">
        <HStack className="gap-4 items-center h-7 mb-6">
          <div className="text-[20px] text-[#ffffff] font-bold">
            {handlePluralization({
              quantity: commentsCount,
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
                commentBlockStatus === "closed" ? "w-6 h-6" : "w-10 h-10"
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
          />
        </HStack>
      </section>
    </commentary-header>
  );
};

export const HeaderSection = <T,>({
  commentsCount,
  sortBy,
  setSortBy,
}: Props<T>) => {
  return (
    <CommentBlockStatusProvider>
      <HeaderSectionContent
        commentsCount={commentsCount}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </CommentBlockStatusProvider>
  );
};
