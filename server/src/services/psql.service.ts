import type {
  CommentaryActionsWithDiscussionContext,
  PaginationParams,
  SnapshotTime,
  SortingStrategy,
} from "@shared/src/types/core";
import type { UserSentiment } from "@shared/src/types/data";
import type { Nullable } from "@shared/src/types/helpers";
import type { PoolClient } from "pg";
import { getPool } from "../db/postgresql/connection";
import { PsqlCommentaryRepository } from "../repository/psql.repository";

export class PsqlCommentaryService
  implements CommentaryActionsWithDiscussionContext
{
  private static instance: PsqlCommentaryService;
  private repo: PsqlCommentaryRepository;

  private constructor(repo: PsqlCommentaryRepository) {
    this.repo = repo;
  }

  // ------------------------ private methods -------------------

  private async runInTransaction<T>(
    fn: (connect: PoolClient) => Promise<T>
  ): Promise<T> {
    const pool = getPool();
    const connect = await pool.connect();
    try {
      await connect.query("BEGIN");
      const result = await fn(connect); // Pass the connection to the block
      await connect.query("COMMIT");
      return result;
    } catch (error) {
      await connect.query("ROLLBACK");
      throw error;
    } finally {
      connect.release();
    }
  }

  private calculateSentimentDelta(
    oldSentiment: UserSentiment["sentiment"],
    newSentiment: UserSentiment["sentiment"]
  ) {
    if (oldSentiment === -1) {
      return [Math.abs(newSentiment), -1];
    }

    if (oldSentiment === 1) {
      return [-1, Math.abs(newSentiment)];
    }

    return [newSentiment === 1 ? 1 : 0, newSentiment === -1 ? 1 : 0];
  }

  // ----------------------- singleton methods ------------------------
  public static getInstance(repo?: PsqlCommentaryRepository) {
    if (!PsqlCommentaryService.instance) {
      const targetRepo = repo || new PsqlCommentaryRepository();
      PsqlCommentaryService.instance = new PsqlCommentaryService(targetRepo);
    }
    return PsqlCommentaryService.instance;
  }

  // ----------------------- helpers methods ------------------------
  private async getComments(
    discussionId: string,
    params: PaginationParams & { sortBy: SortingStrategy } & {
      userId: Nullable<string>;
      parentId: Nullable<string>;
    } & SnapshotTime
  ) {
    const { limit, offset, sortBy, userId, parentId, snapshotTime } = params;

    try {
      return await this.runInTransaction(async (connect) => {
        const itemsCount = await this.repo.getCommentCount({
          discussionId,
          parentId,
          snapshotTime,
          connect,
        });

        const comments = await this.repo.getComments({
          discussionId,
          parentId,
          snapshotTime,
          sortBy,
          userId,
          limit,
          offset,
          connect,
        });

        return { items: comments, itemsCount };
      });
    } catch (error) {
      console.error("Error getting comments", error);
      throw new Error("Failed to get comments");
    }
  }
  // ----------------------- CommentaryAPI methods ------------------------

  async getTopLevelComments(
    discussionId: string,
    params: PaginationParams & { sortBy: SortingStrategy } & {
      userId: Nullable<string>;
    } & SnapshotTime
  ) {
    const { limit, offset, sortBy, userId, snapshotTime } = params;

    return await this.getComments(discussionId, {
      limit,
      offset,
      sortBy,
      userId,
      parentId: null,
      snapshotTime,
    });
  }

  async getReplies(
    discussionId: string,
    params: PaginationParams & { parentId: string; sortBy: SortingStrategy } & {
      userId: Nullable<string>;
    } & SnapshotTime
  ) {
    const { limit, offset, sortBy, userId, parentId, snapshotTime } = params;

    return await this.getComments(discussionId, {
      limit,
      offset,
      sortBy,
      userId,
      parentId,
      snapshotTime,
    });
  }

  async addComment(
    discussionId: string,
    content: string,
    userId: string,
    parentId: Nullable<string>
  ) {
    try {
      const commentId = crypto.randomUUID();

      return await this.runInTransaction(async (connect) => {
        await this.repo.insertComment({
          commentId,
          discussionId,
          userId,
          parentId,
          content,
          connect,
        });

        await this.repo.insertCommentStats({
          commentId,
          connect,
        });

        // incrementing reply count for parent comment (decrementing is handled by the sql trigger)
        if (parentId) {
          await this.repo.incrementParentReplyCount({
            parentId,
            connect,
          });
        }

        const comment = await this.repo.getFreshComment({
          commentId,
          userId,
          connect,
        });

        return comment;
      });
    } catch (error) {
      console.error("Error adding comment", error);
      throw new Error("Failed to add comment");
    }
  }

  async handleUserSentiment({ commentId, userId, sentiment }: UserSentiment) {
    try {
      return await this.runInTransaction(async (connect) => {
        const oldSentiment = await this.repo.getSentiment({
          userId,
          commentId,
          connect,
        });

        await this.repo.upsertSentiment({
          userId,
          commentId,
          sentiment,
          connect,
        });

        const [likeDelta, dislikeDelta] = this.calculateSentimentDelta(
          oldSentiment,
          sentiment
        );

        // the assumption the row is already there, you can't act on it without the row being there
        const commentStatsResult = await this.repo.getCommentStats({
          commentId,
          likeDelta,
          dislikeDelta,
          connect,
        });

        return commentStatsResult;
      });
    } catch (error) {
      console.error("Error handling user sentiment", error);
      throw new Error("Failed to handle user sentiment");
    }
  }
}

const psqlCommentaryService = PsqlCommentaryService.getInstance();

export { psqlCommentaryService };
