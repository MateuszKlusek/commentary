import * as z from "zod/v4";
import { CommentItemSchema, type CommentItem } from "../types/core";
import {
  CommentSliceSchema,
  CommentStatsSchema,
  UserSchema,
  UserSentimentSchema,
  type CommentSlice,
  type CommentStats,
  type User,
  type UserSentiment,
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

// --------------------------- user sentiments ---------------------------
export function validateUserSentiments(data: unknown): UserSentiment[] {
  return z.array(UserSentimentSchema).parse(data);
}

export function safeValidateUserSentiments(data: unknown) {
  return z.array(UserSentimentSchema).safeParse(data);
}

// --------------------------- comment data ---------------------------
export function validateCommentData(data: unknown): CommentItem[] {
  return z.array(CommentItemSchema).parse(data);
}

export function safeValidateCommentData(data: unknown) {
  return z.array(CommentSliceSchema).safeParse(data);
}
