import { initContract } from "@ts-rest/core";
import z from "zod";
import { CommentDataSchema } from "./types";

const c = initContract();

export const contract = c.router({
  getTopLevelCommentCount: {
    method: "GET",
    path: "/comments/count",
    query: z.object({
      discussionId: z.string().nonempty(),
    }),
    responses: {
      200: z.object({
        count: z.number(),
      }),
    },
  },

  getTopLevelComments: {
    method: "GET",
    path: "/comments",
    query: z.object({
      offset: z.coerce.number().min(0),
      limit: z.coerce.number().min(1),
      discussionId: z.string().nonempty(),
    }),
    responses: {
      200: z.object({
        comments: z.array(CommentDataSchema),
      }),
    },
  },

  getReplies: {
    method: "GET",
    path: "/comments/:commentId/replies",
    query: z.object({
      offset: z.coerce.number(),
      limit: z.coerce.number(),
      commentId: z.string().nonempty(),
      discussionId: z.string().nonempty(),
    }),
    responses: {
      200: z.object({
        replies: z.array(CommentDataSchema),
      }),
    },
  },
});
