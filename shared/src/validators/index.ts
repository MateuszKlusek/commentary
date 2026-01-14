import z from "zod";
import { CommentItemSchema, type CommentItem } from "../types/core";
import {
  CommentSliceSchema,
  CommentStatsSchema,
  UserReactionSchema,
  UserSchema,
  type CommentSlice,
  type CommentStats,
  type User,
  type UserReaction,
} from "../types/data";

// --------------------------- comments ---------------------------
export function validateComments(data: unknown): CommentSlice[] {
  return z.array(CommentSliceSchema).parse(data);
}

export function safeValidateComments(data: unknown) {
  return z.array(CommentSliceSchema).safeParse(data);
}

// --------------------------- comment stats ---------------------------
export function validateCommentStats(data: unknown): CommentStats[] {
  return z.array(CommentStatsSchema).parse(data);
}

export function safeValidateCommentStats(data: unknown) {
  return z.array(CommentStatsSchema).safeParse(data);
}

// --------------------------- users ---------------------------
export function validateUsers(data: unknown): User[] {
  return z.array(UserSchema).parse(data);
}

export function safeValidateUsers(data: unknown) {
  return z.array(UserSchema).safeParse(data);
}

// --------------------------- user reactions ---------------------------
export function validateUserReactions(data: unknown): UserReaction[] {
  return z.array(UserReactionSchema).parse(data);
}

export function safeValidateUserReactions(data: unknown) {
  return z.array(UserReactionSchema).safeParse(data);
}

// --------------------------- comment data ---------------------------
export function validateCommentData(data: unknown): CommentItem[] {
  return z.array(CommentItemSchema).parse(data);
}

export function safeValidateCommentData(data: unknown) {
  return z.array(CommentSliceSchema).safeParse(data);
}
