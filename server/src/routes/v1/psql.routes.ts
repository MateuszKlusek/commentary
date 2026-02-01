import { contract } from "@shared/src/contracts";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { Router } from "express";
import { psqlCommentaryService } from "../../services/psql.service";
const router: Router = Router();

const s = initServer();

const tsRestRouter = s.router(contract, {
  getTopLevelComments: async ({
    query: { offset, limit, discussionId, sortBy, userId, snapshotTime },
  }) => {
    const commentsPayload = await psqlCommentaryService.getTopLevelComments(
      discussionId,
      {
        offset,
        limit,
        sortBy,
        userId,
        snapshotTime,
      }
    );
    return {
      status: 200,
      body: commentsPayload,
    };
  },

  getReplies: async ({
    query: {
      parentId,
      offset,
      limit,
      discussionId,
      sortBy,
      userId,
      snapshotTime,
    },
  }) => {
    const repliesPayload = await psqlCommentaryService.getReplies(
      discussionId,
      {
        parentId,
        offset,
        limit,
        sortBy,
        userId,
        snapshotTime,
      }
    );
    return {
      status: 200,
      body: repliesPayload,
    };
  },

  addComment: async ({ body: { content, userId, parentId, discussionId } }) => {
    const commentPayload = await psqlCommentaryService.addComment(
      discussionId,
      content,
      userId,
      parentId
    );
    return {
      status: 200,
      body: commentPayload,
    };
  },

  handleUserSentiment: async ({ body: { commentId, userId, sentiment } }) => {
    const userSentimentPayload =
      await psqlCommentaryService.handleUserSentiment({
        commentId,
        userId,
        sentiment,
      });
    return {
      status: 200,
      body: userSentimentPayload,
    };
  },
});

createExpressEndpoints(contract, tsRestRouter, router);

export default router;
