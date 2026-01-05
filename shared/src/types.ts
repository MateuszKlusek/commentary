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
});

export type CommentData = z.infer<typeof CommentDataSchema>;

export type CommentaryActions = {
  getTopLevelCommentCount(): Promise<number>;
  getTopLevelComments(offset: number, limit: number): Promise<CommentData[]>;
  getReplies(
    commentId: string,
    offset: number,
    limit: number
  ): Promise<CommentData[]>;
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
  | "getTopLevelCommentCount"
  | "getTopLevelComments"
  | "updateLike"
  | "addComment"
>;

export type CommentaryAPI = CommentaryActions & CommentaryConfig;

export type ReactionData = {
  commentId: number;
  userId: number;
  reaction: 1 | -1 | 0; // 1 = like, -1 = dislike, 0 = none
  createdAt: string;
};
