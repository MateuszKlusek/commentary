import type { ReactNode } from "react";
import * as z from "zod/v4";
import type { Copy } from "./copy";
import {
  CommentSliceSchema,
  CommentStatsSchema,
  UserSchema,
  UserSentimentSchema,
  type User,
  type UserSentiment,
} from "./data";
import type { Nullable } from "./helpers";

export const CommentItemSchema = z.object({
  comment: CommentSliceSchema,
  commentStats: CommentStatsSchema,
  author: UserSchema,
  userSentiment: UserSentimentSchema.nullish(),
});

export type CommentItem = z.infer<typeof CommentItemSchema>;

export const CommentItemWithIdSchema = z.object({
  comment: CommentSliceSchema.extend({
    id: z.string(),
  }),
  commentStats: CommentStatsSchema.extend({
    id: z.string(),
  }),
  author: UserSchema.extend({
    id: z.string(),
  }),
  userSentiment: UserSentimentSchema.extend({
    id: z.string(),
  }),
});

export type CommentItemWithId = z.infer<typeof CommentItemWithIdSchema>;

export type CommentaryActions = {
  getTopLevelComments: InfiniteFetcher<
    CommentItem,
    { sortBy: SortingStrategy } & { userId: Nullable<User["userId"]> }
  >;
  getReplies: InfiniteFetcher<
    CommentItem,
    { parentId: string; sortBy: SortingStrategy } & {
      userId: Nullable<User["userId"]>;
    }
  >;
  addComment(
    content: string,
    userId: User["userId"],
    parentId: Nullable<string>
  ): Promise<CommentItem>;
  handleUserSentiment({
    commentId,
    userId,
    sentiment,
  }: UserSentiment): Promise<{ likeCount: number; dislikeCount: number }>;
  onUserNameClick?: (userId: string) => void;
};

export type CommentaryConfig = {
  discussionId: Nullable<string>;
  user?: User;
  customCss?: Nullable<string>;
  copy?: Copy;
  validationMode?: "warn" | "strict" | "silent";
  mode?: "development" | "production";
  errorBoundaryFallback?: ReactNode;
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

export type PaginationParams = {
  offset: number;
  limit: number;
};

export type SnapshotTime = { snapshotTime: string };

export type InfiniteFetcher<T, P = {}> = (
  _: PaginationParams & P & SnapshotTime
) => Promise<{
  items: T[];
  itemsCount: number;
}>;

export type GetParams<T extends (...args: any[]) => any> = Parameters<T>[0];

export const SortingStrategySchema = z.enum(["newest", "top"]);
export type SortingStrategy = z.infer<typeof SortingStrategySchema>;
