import type { CompleteCopy } from "@shared/src/types/copy";
import { SortingStrategySchema } from "@shared/src/types/core";

export const defaultCopy: CompleteCopy = {
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
    {
      title: "Top",
      subtitle: "Show featured comments",
      value: SortingStrategySchema.enum.top,
    },
    {
      title: "Newest",
      subtitle: "Show recent comments, including potential spam",
      value: SortingStrategySchema.enum.newest,
    },
  ],
  sortByLabel: "Sort by",
  commentActionLabels: {
    hideReplies: "Hide replies",
    showMoreReplies: "Show more replies",
    repliesCount: [
      { from: 0, label: "Replies" },
      { from: 1, label: "Reply" },
      { from: 2, label: "Replies" },
    ],
  },
  readMoreActionLabels: {
    readMore: "Read more",
    showLess: "Show less",
  },
  noUserTooltip: {
    title: "Want to join the conversation?",
    description: "Sign in to continue",
    buttonLabel: "Sign in",
  },
};
