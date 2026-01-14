import z from "zod";
import {
  CommentSchema,
  CommentStatsSchema,
  UserReactionSchema,
  UserSchema,
  type Comment,
  type CommentStats,
  type User,
  type UserReaction,
} from "../types/data";
import { CommentDataSchema, type CommentData } from "../types/core";

// --------------------------- comments ---------------------------
export function validateComments(data: unknown): Comment[] {
  return z.array(CommentSchema).parse(data);
}

export function safeValidateComments(data: unknown) {
  return z.array(CommentSchema).safeParse(data);
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
export function validateCommentData(data: unknown): CommentData[] {
  return z.array(CommentDataSchema).parse(data);
}

export function safeValidateCommentData(data: unknown) {
  return z.array(CommentDataSchema).safeParse(data);
}
