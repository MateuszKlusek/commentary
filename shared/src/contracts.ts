import { initContract } from "@ts-rest/core";
import z from "zod";
import { CommentItemSchema, SortingStrategySchema } from "./types/core";
import { UserSchema } from "./types/data";

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
    }),
    responses: {
      200: z.object({
        items: z.array(CommentItemSchema),
        itemsCount: z.number().int().min(0),
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
    }),
    responses: {
      200: z.object({
        items: z.array(CommentItemSchema),
        itemsCount: z.number().int().min(0),
      }),
    },
  },

  addComment: {
    method: "POST",
    path: "/comment",
    body: z.object({
      content: z.string().nonempty(),
      parentId: z.string().nullish(),
      user: UserSchema,
      discussionId: z.string().nonempty(),
    }),
    responses: {
      200: CommentItemSchema,
    },
  },
});
