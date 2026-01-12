import { useCopy } from "../../copy/CopyContext";
import { handlePluralization } from "../../copy/utils";
import { HStack } from "../layout/HStack";
import { AddCommentBlock } from "./AddCommentBlock";
import { SelectComponent } from "./atoms/Select";

type Props<T> = {
  commentsCount: number;
  sortBy: T;
  setSortBy: (sortBy: T) => void;
};

export const HeaderSection = <T,>({
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

  return (
    <commentary-header>
      <section>
        <HStack className="gap-4">
          <div>
            {handlePluralization({
              quantity: commentsCount,
              rules: commentCopy,
            })}
          </div>
          <div>{sortByLabel}</div>
          <SelectComponent
            options={sortingOptions}
            value={sortBy?.toString()}
            onValueChange={(value) => setSortBy(value as T)}
          />
        </HStack>
        <HStack className="w-full gap-4 px-2">
          <div>P</div>
          <AddCommentBlock
            parentId={null}
            placeholder={addCommentPlaceholder}
            actionButtonLabel={addCommentButtonLabel}
            cancelButtonLabel={addCommentCancelButtonLabel}
          />
        </HStack>
      </section>
    </commentary-header>
  );
};
