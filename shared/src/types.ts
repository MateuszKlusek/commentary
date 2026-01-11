import z from "zod";

export const CommentDataSchema = z.object({
  id: z.string(),
  discussionId: z.string().nonempty(),
  commentId: z.string().nonempty(),
  parentId: z.string().nullable(),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
  likes: z.number().int().min(0),
  dislikes: z.number().int().min(0),
  replyCount: z.number().int().min(0),
  content: z.string(),
  userId: z.string(),
  author: z.object({
    id: z.uuid().nonempty(),
    avatarUrl: z.url().nullable(),
    name: z.string().nullable(),
  }),
});

export type CommentData = z.infer<typeof CommentDataSchema>;

export type CommentaryActions = {
  getTopLevelComments: InfiniteFetcher<
    CommentData,
    { sortBy: SortingStrategy }
  >;
  getReplies: InfiniteFetcher<CommentData, { parentId: string }>;
  updateLike(commentId: string, like: boolean): Promise<void>;
  addComment(
    content: string,
    userId: string,
    parentId: string | null
  ): Promise<void>;
};

export type CommentaryConfig = {
  discussionId: string | null | undefined;
  userId: string | null | undefined;
  validationMode?: "warn" | "strict" | "silent";
  customCss?: string;
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
  "getTopLevelComments" | "addComment"
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
