import { initContract } from "@ts-rest/core";
import z from "zod";
import { CommentDataSchema } from "./types";

const c = initContract();

export const contract = c.router({
  getTopLevelComments: {
    method: "GET",
    path: "/comments/top-level",
    query: z.object({
      offset: z.coerce.number().min(0),
      limit: z.coerce.number().min(1),
      discussionId: z.string().nonempty(),
    }),
    responses: {
      200: z.object({
        items: z.array(CommentDataSchema),
        itemsCount: z.number().int().min(0),
      }),
    },
  },

  getReplies: {
    method: "GET",
    path: "/comments/replies",
    query: z.object({
      offset: z.coerce.number(),
      limit: z.coerce.number(),
      parentId: z.string().nonempty(),
      discussionId: z.string().nonempty(),
    }),
    responses: {
      200: z.object({
        items: z.array(CommentDataSchema),
        itemsCount: z.number().int().min(0),
      }),
    },
  },

  addComment: {
    method: "POST",
    path: "/comment",
    body: z.object({
      content: z.string().nonempty(),
      parentId: z.string().nullable(),
      userId: z.string().nonempty(),
      discussionId: z.string().nonempty(),
    }),
    responses: {
      200: z.object({}),
    },
  },
});
