import z from "zod";

export const CommentDataSchema = z.object({
  id: z.string(),
  commendId: z.string(),
  content: z.string(),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
  likes: z.number().int().min(0),
  dislikes: z.number().int().min(0),
  replyCount: z.number().int().min(0),
  parentId: z.string().nullable(),
  userId: z.string(),
});

export type CommentData = z.infer<typeof CommentDataSchema>;

export interface CommentaryAPI {
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

  // used for url, it can be a slug or a different identifier
  slug: string | null | undefined;
  userId: string | null | undefined;
  validationMode?: "warn" | "strict" | "silent";
}

export type ReactionData = {
  commentId: number;
  userId: number;
  reaction: 1 | -1 | 0; // 1 = like, -1 = dislike, 0 = none
  createdAt: string;
};
