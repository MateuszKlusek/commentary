import { contract } from "@shared/src/contracts";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { Router } from "express";
import { commentaryService } from "../../services/file.service";
const router: Router = Router();

const s = initServer();

const tsRestRouter = s.router(contract, {
  getTopLevelComments: async ({ query: { offset, limit, discussionId } }) => {
    const comments = await commentaryService.getTopLevelComments(discussionId, {
      offset,
      limit,
    });
    return {
      status: 200,
      body: {
        items: comments.items.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
        })),
        itemsCount: comments.itemsCount,
      },
    };
  },

  getReplies: async ({ query: { parentId, offset, limit } }) => {
    const replies = await commentaryService.getReplies({
      parentId,
      offset,
      limit,
    });
    return {
      status: 200,
      body: {
        items: replies.items.map((reply) => ({
          ...reply,
          createdAt: reply.createdAt.toISOString(),
          updatedAt: reply.updatedAt.toISOString(),
        })),
        itemsCount: replies.itemsCount,
      },
    };
  },

  addComment: async ({ body: { content, userId, parentId, discussionId } }) => {
    const res = await commentaryService.addComment(
      discussionId,
      content,
      userId,
      parentId
    );
    return {
      status: 200,
      body: {},
    };
  },
});

createExpressEndpoints(contract, tsRestRouter, router);

export default router;
