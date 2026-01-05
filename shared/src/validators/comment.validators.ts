import { z } from "zod";
import { CommentDataSchema, type CommentData } from "../types";

export function validateComments(data: unknown): CommentData[] {
  return z.array(CommentDataSchema).parse(data);
}

export function safeValidateComments(data: unknown) {
  return z.array(CommentDataSchema).safeParse(data);
}
