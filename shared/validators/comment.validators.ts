import { z } from "zod";
import type { CommentData } from "../types";

export const CommentDataSchema = z.object({
  id: z.string(),
  commendId: z.string(),
  content: z.string(),
  createdAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  updatedAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  likes: z.number().int().min(0),
  dislikes: z.number().int().min(0),
  replyCount: z.number().int().min(0),
  parentId: z.string().nullable(),
  userId: z.string(),
}) satisfies z.ZodType<CommentData>;

export const CommentsArraySchema = z.array(CommentDataSchema);

export function validateComments(data: unknown): CommentData[] {
  return CommentsArraySchema.parse(data);
}

export function safeValidateComments(data: unknown) {
  return CommentsArraySchema.safeParse(data);
}
