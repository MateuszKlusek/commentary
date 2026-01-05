import { contract } from "@shared/src/contracts";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { Router } from "express";
import { commentaryService } from "../../services/file.service";
const router: Router = Router();

const s = initServer();
const tsRestRouter = s.router(contract, {
  getTopLevelCommentCount: async () => {
    const count = await commentaryService.getTopLevelCommentCount();
    return {
      status: 200,
      body: { count },
    };
  },

  getTopLevelComments: async ({ query: { offset, limit } }) => {
    console.log({ offset, limit });
    const comments = await commentaryService.getTopLevelComments(offset, limit);
    return {
      status: 200,
      body: {
        comments: comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
        })),
      },
    };
  },
  getReplies: async ({ query: { commentId, offset, limit } }) => {
    const replies = await commentaryService.getReplies(
      commentId,
      offset,
      limit
    );
    return {
      status: 200,
      body: {
        replies: replies.map((reply) => ({
          ...reply,
          createdAt: reply.createdAt.toISOString(),
          updatedAt: reply.updatedAt.toISOString(),
        })),
      },
    };
  },
});

createExpressEndpoints(contract, tsRestRouter, router);

export default router;
