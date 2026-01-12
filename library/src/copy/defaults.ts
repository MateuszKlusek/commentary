import type { Copy } from "@shared/src/types/copy";
import { SortingStrategySchema } from "@shared/src/types/core";

export const defaultCopy: Copy = {
  language: "en",
  comment: [
    {
      from: 0,
      label: "Comments",
    },
    {
      from: 1,
      label: "Comment",
    },
    {
      from: 2,
      label: "Comments",
    },
  ],
  addCommentButtonLabel: "Comment",
  addCommentPlaceholder: "Add a comment...",
  addReplyButtonLabel: "Comment",
  addCommentCancelButtonLabel: "Cancel",
  addReplyCancelButtonLabel: "Cancel",
  addReplyPlaceholder: "",
  sortingOptions: [
    { label: "Newest", value: SortingStrategySchema.enum.newest },
    { label: "Top", value: SortingStrategySchema.enum.top },
  ],
  sortByLabel: "Sort By",
};
