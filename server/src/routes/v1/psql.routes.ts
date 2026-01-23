import { contract } from "@shared/src/contracts";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { Router } from "express";
import { psqlCommentaryService } from "../../services/psql.service";
const router: Router = Router();

const s = initServer();

const tsRestRouter = s.router(contract, {
  getTopLevelComments: async ({
    query: { offset, limit, discussionId, sortBy, userId },
  }) => {
    const comments = await psqlCommentaryService.getTopLevelComments(
      discussionId,
      {
        offset,
        limit,
        sortBy,
        userId,
      },
    );
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
    const replies = await psqlCommentaryService.getReplies(discussionId, {
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

  addComment: async ({ body: { content, user, parentId, discussionId } }) => {
    const res = await psqlCommentaryService.addComment(
      discussionId,
      content,
      user,
      parentId,
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
