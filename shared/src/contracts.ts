import { initContract } from "@ts-rest/core";
import * as z from "zod/v4";
import { CommentItemSchema, SortingStrategySchema } from "./types/core";
import { UserSchema, UserSentimentSchema } from "./types/data";

const c = initContract();

export const contract = c.router({
  getTopLevelComments: {
    method: "GET",
    path: "/comments/top-level",
    query: z.object({
      discussionId: z.string().nonempty(),
      userId: UserSchema.shape.userId.nullish(),
      sortBy: SortingStrategySchema,
      offset: z.coerce.number().min(0),
      limit: z.coerce.number().min(1),
      snapshotTime: z.string(),
    }),
    responses: {
      200: z.object({
        items: z.array(CommentItemSchema),
        itemsCount: z.number().int().min(0),
      }),
      500: z.object({
        error: z.string().nonempty(),
      }),
    },
  },

  getReplies: {
    method: "GET",
    path: "/comments/replies",
    query: z.object({
      parentId: z.string().nonempty(),
      discussionId: z.string().nonempty(),
      userId: UserSchema.shape.userId.nullish(),
      sortBy: SortingStrategySchema,
      offset: z.coerce.number(),
      limit: z.coerce.number(),
      snapshotTime: z.string(),
    }),
    responses: {
      200: z.object({
        items: z.array(CommentItemSchema),
        itemsCount: z.number().int().min(0),
      }),
      500: z.object({
        error: z.string().nonempty(),
      }),
    },
  },

  addComment: {
    method: "POST",
    path: "/comment",
    body: z.object({
      content: z.string().nonempty(),
      parentId: z.string().nullish(),
      userId: UserSchema.shape.userId,
      discussionId: z.string().nonempty(),
    }),
    responses: {
      200: CommentItemSchema,
      500: z.object({
        error: z.string().nonempty(),
      }),
    },
  },

  handleUserSentiment: {
    method: "POST",
    path: "/comment/sentiment",
    body: UserSentimentSchema,
    responses: {
      200: z.object({
        likeCount: z.number().int().min(0),
        dislikeCount: z.number().int().min(0),
      }),
      500: z.object({
        error: z.string().nonempty(),
      }),
    },
  },
});
