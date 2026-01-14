import { contract } from "@shared/src/contracts";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { Router } from "express";
import { commentaryService } from "../../services/file.service";
const router: Router = Router();

const s = initServer();

const tsRestRouter = s.router(contract, {
  getTopLevelComments: async ({
    query: { offset, limit, discussionId, sortBy },
  }) => {
    const comments = await commentaryService.getTopLevelComments(discussionId, {
      offset,
      limit,
      sortBy,
    });
    return {
      status: 200,
      body: {
        items: comments.items,
        itemsCount: comments.itemsCount,
      },
    };
  },

  getReplies: async ({
    query: { parentId, offset, limit, discussionId, sortBy },
  }) => {
    const replies = await commentaryService.getReplies(discussionId, {
     parentId,
      offset,
      limit,
      sortBy,
    });
    return {
      status: 200,
      body: {
        items: replies.items,
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
      body: {
        ...res,
      },
    };
  },
});

createExpressEndpoints(contract, tsRestRouter, router);

export default router;
