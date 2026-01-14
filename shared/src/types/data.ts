import z from "zod";

// ------------------------- Comments -------------------------

export const CommentSliceSchema = z.object({
  commentId: z.string(),
  discussionId: z.string(),
  userId: z.string(),
  parentId: z.string().nullish(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type CommentSlice = z.infer<typeof CommentSliceSchema>;
// ---------------------- Comment Stats -----------------------

export const CommentStatsSchema = z.object({
  commentId: z.string(),
  likeCount: z.number(),
  dislikeCount: z.number(),
  replyCount: z.number(),
});
export type CommentStats = z.infer<typeof CommentStatsSchema>;

// --------------------------- User ---------------------------

export const UserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatarUrl: z.string(),
});
export type User = z.infer<typeof UserSchema>;

// ---------------------- User Reactions ----------------------

export const UserReactionSchema = z.object({
  userId: z.string(),
  commentId: z.string(),
  reaction: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
  createdAt: z.string(),
});
export type UserReaction = z.infer<typeof UserReactionSchema>;
