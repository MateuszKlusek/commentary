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
    query: { parentId, offset, limit, discussionId, sortBy, userId },
  }) => {
    const replies = await psqlCommentaryService.getReplies(discussionId, {
      parentId,
      offset,
      limit,
      sortBy,
      userId,
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
    const res = await psqlCommentaryService.addComment(
      discussionId,
      content,
      userId,
      parentId,
    );
    return {
      status: 200,
      body: {
        ...res,
      },
    };
  },

  handleUserSentiment: async ({ body: { commentId, userId, sentiment } }) => {
    const res = await psqlCommentaryService.handleUserSentiment({
      commentId,
      userId,
      sentiment,
    });
    return {
      status: 200,
      body: {
        likeCount: res.likeCount,
        dislikeCount: res.dislikeCount,
      },
    };
  },
});

createExpressEndpoints(contract, tsRestRouter, router);

export default router;
