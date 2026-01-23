import z from "zod";
import type { Copy } from "./copy";
import {
  CommentSliceSchema,
  CommentStatsSchema,
  UserReactionSchema,
  UserSchema,
  type User,
  type UserReaction,
} from "./data";
import type { Nullable } from "./helpers";

export const CommentItemSchema = z.object({
  comment: CommentSliceSchema,
  commentStats: CommentStatsSchema,
  author: UserSchema,
  userReaction: UserReactionSchema.nullish(),
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
  userReaction: UserReactionSchema.extend({
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
    { parentId: string; sortBy: SortingStrategy }
  >;
  handleUserReaction({
    commentId,
    userId,
    reaction,
  }: Omit<UserReaction, "createdAt">): Promise<void>;
  addComment(
    content: string,
    user: User,
    parentId: Nullable<string>,
  ): Promise<CommentItem>;
  onUserNameClick?: (userId: string) => void;
};

export type CommentaryConfig = {
  discussionId: Nullable<string>;
  user?: User;
  validationMode?: "warn" | "strict" | "silent";
  customCss?: Nullable<string>;
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
