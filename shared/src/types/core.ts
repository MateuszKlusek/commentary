import z from "zod";
import type { Copy } from "./copy";
import {
  CommentSchema,
  CommentStatsSchema,
  UserReactionSchema,
  UserSchema,
} from "./data";

export const CommentDataSchema = z.object({
  comment: CommentSchema,
  commentStats: CommentStatsSchema.nullish(),
  author: UserSchema.nullish(),
  userReaction: UserReactionSchema.nullish(),
});

export type CommentData = z.infer<typeof CommentDataSchema>;

// actions

export type CommentaryActions = {
  getTopLevelComments: InfiniteFetcher<
    CommentData,
    { sortBy: SortingStrategy }
  >;
  getReplies: InfiniteFetcher<
    CommentData,
    { parentId: string; sortBy: SortingStrategy }
  >;
  updateLike(commentId: string, like: boolean): Promise<void>;
  addComment(
    content: string,
    userId: string,
    parentId: string | null
  ): Promise<CommentData>;
  onUserNameClick?: (userId: string) => void;
};

export type CommentaryConfig = {
  discussionId: string | null | undefined;
  user?: {
    userId: string;
    name: string;
    avatarUrl: string;
  };
  validationMode?: "warn" | "strict" | "silent";
  customCss?: string;
  copy?: Copy;
};

export type WithDiscussionId<T, I extends any, K extends keyof T> = {
  [P in keyof T]: P extends K
    ? T[P] extends (...args: infer A) => infer R
      ? (discussionId: I, ...args: A) => R
      : T[P]
    : T[P];
};

export type CommentaryActionsWithDiscussionContext = WithDiscussionId<
  CommentaryActions,
  string,
  "getTopLevelComments" | "addComment" | "getReplies"
>;

export type CommentaryAPI = CommentaryActions & CommentaryConfig;

export type ReactionData = {
  commentId: number;
  userId: number;
  reaction: 1 | -1 | 0; // 1 = like, -1 = dislike, 0 = none
  createdAt: string;
};

// TODO: consider using that for Mongodb-like databases with cursor pagination
// export type InfiniteFetcher<T> =
//   | ((params: {
//       offset: number;
//       limit: number;
//     }) => Promise<{ items: T[]; itemTotal: number }>)
//   | ((params: {
//       cursor?: string;
//       limit: number;
//     }) => Promise<{ items: T[]; nextCursor?: string }>);

export type PaginationParams = {
  offset: number;
  limit: number;
};

export type InfiniteFetcher<T, P = {}> = (_: PaginationParams & P) => Promise<{
  items: T[];
  itemsCount: number;
}>;

export type GetParams<T extends (...args: any[]) => any> = Parameters<T>[0];

export const SortingStrategySchema = z.enum(["newest", "top"]);
export type SortingStrategy = z.infer<typeof SortingStrategySchema>;
