import type {
  CommentaryActionsWithDiscussionContext,
  CommentItem,
  PaginationParams,
  SnapshotTime,
  SortingStrategy,
} from "@shared/src/types/core";
import type { UserSentiment } from "@shared/src/types/data";
import type { Nullable } from "@shared/src/types/helpers";
import { getPool } from "../db/postgresql/connection";

export class PsqlCommentaryServiceSingleton implements CommentaryActionsWithDiscussionContext {
  private static instance: PsqlCommentaryServiceSingleton;

  private constructor() {}

  public static getInstance() {
    if (!PsqlCommentaryServiceSingleton.instance) {
      PsqlCommentaryServiceSingleton.instance =
        new PsqlCommentaryServiceSingleton();
    }
    return PsqlCommentaryServiceSingleton.instance;
  }

  // ----------------------- helpers methods ------------------------
  private async getComments(
    discussionId: string,
    params: PaginationParams & { sortBy: SortingStrategy } & {
      userId: Nullable<string>;
      parentId: Nullable<string>;
    } & SnapshotTime,
  ) {
    const pool = getPool();
    const connect = await pool.connect();
    const { limit, offset, sortBy, userId, parentId, snapshotTime } = params;

    try {
      const countResult = await connect.query<{ total: string }>(
        `
      SELECT COUNT(*) as total
      FROM comments
      WHERE discussion_id = $1 AND parent_id IS NOT DISTINCT FROM $2
      AND created_at < $3
      `,
        [discussionId, parentId, snapshotTime],
      );
      const itemsCount = parseInt(countResult.rows[0].total, 10);

      const result = await connect.query(
        `
      SELECT
        c.comment_id as comment_id,
        c.discussion_id,
        c.user_id,
        c.parent_id,
        c.content,
        c.created_at,
        c.updated_at,
        cs.like_count,
        cs.dislike_count,
        cs.reply_count,
        u.user_id as author_user_id,
        u.name as author_name,
        u.avatar_url as author_avatar_url,
        us.sentiment as user_sentiment
      FROM comments c
      LEFT JOIN comment_stats cs ON cs.comment_id = c.comment_id 
      LEFT JOIN users u ON u.user_id = c.user_id
      LEFT JOIN user_sentiments us ON us.comment_id = c.comment_id AND us.user_id = $2
      WHERE c.discussion_id = $1 AND c.parent_id IS NOT DISTINCT FROM $3
      AND c.created_at < $4
      ORDER BY c.created_at ${sortBy === "newest" ? "DESC" : "ASC"}
      LIMIT $5 OFFSET $6
      `,
        [discussionId, userId, parentId, snapshotTime, limit, offset],
      );

      const rows: CommentItem[] = result.rows.map((row) => {
        return {
          comment: {
            commentId: row.comment_id,
            discussionId: row.discussion_id,
            userId: row.user_id,
            parentId: row.parent_id,
            content: row.content,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
          commentStats: {
            commentId: row.comment_id,
            likeCount: row.like_count,
            dislikeCount: row.dislike_count,
            replyCount: row.reply_count,
          },
          author: {
            userId: row.author_user_id,
            name: row.author_name,
            avatarUrl: row.author_avatar_url,
          },
          userSentiment: {
            commentId: row.comment_id,
            userId: row.user_id,
            sentiment: row.user_sentiment,
          },
        };
      });

      return { items: rows, itemsCount };
    } catch (error) {
      throw error;
    } finally {
      connect.release();
    }
  }
  // ----------------------- CommentaryAPI methods ------------------------

  async getTopLevelComments(
    discussionId: string,
    params: PaginationParams & { sortBy: SortingStrategy } & {
      userId: Nullable<string>;
    } & SnapshotTime,
  ) {
    const { limit, offset, sortBy, userId, snapshotTime } = params;

    return this.getComments(discussionId, {
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
    } & SnapshotTime,
  ) {
    const { limit, offset, sortBy, userId, parentId, snapshotTime } = params;

    return this.getComments(discussionId, {
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
    parentId: Nullable<string>,
  ) {
    const pool = getPool();
    const connect = await pool.connect();

    try {
      const commentId = crypto.randomUUID();

      await connect.query("BEGIN");
      const commentResult = await connect.query(
        `
      INSERT INTO comments (comment_id, discussion_id, user_id, parent_id, content)
      VALUES ($1, $2, $3, $4, $5)
      `,
        [commentId, discussionId, userId, parentId, content],
      );

      await connect.query(
        `
      INSERT INTO comment_stats (comment_id, like_count, dislike_count, reply_count)
      VALUES ($1, 0, 0, 0)
      `,
        [commentId],
      );

      // incrementing reply count for parent comment (decrementing is handled by the sql trigger)
      if (parentId) {
        await connect.query(
          `
        UPDATE comment_stats SET reply_count = comment_stats.reply_count + 1 WHERE comment_id = $1
          `,
          [parentId],
        );
      }

      await connect.query("COMMIT");
      return commentResult.rows[0];
    } catch (error) {
      await connect.query("ROLLBACK");
      throw error;
    } finally {
      connect.release();
    }
  }

  async handleUserSentiment({ commentId, userId, sentiment }: UserSentiment) {
    const pool = getPool();
    const connect = await pool.connect();

    try {
      await connect.query("BEGIN");

      const oldSentiment = await connect
        .query<{
          sentiment: number;
        }>(
          `
      SELECT sentiment FROM user_sentiments WHERE user_id = $1 AND comment_id = $2
        `,
          [userId, commentId],
        )
        .then((res) => res.rows[0]?.sentiment);

      await connect.query(
        `
        INSERT INTO user_sentiments (user_id, comment_id, sentiment)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, comment_id) DO UPDATE SET sentiment = $3
        `,
        [userId, commentId, sentiment],
      );

      const [likeDelta, dislikeDelta] = (() => {
        if (oldSentiment === -1) {
          return [Math.abs(sentiment), -1];
        }

        if (oldSentiment === 1) {
          return [-1, Math.abs(sentiment)];
        }

        return [sentiment === 1 ? 1 : 0, sentiment === -1 ? 1 : 0];
      })();

      // the assumption the row is already there, you can't act on it without the row being there
      const commentStatsResult = await connect.query<{
        like_count: number;
        dislike_count: number;
      }>(
        `
        UPDATE comment_stats SET like_count = like_count + $1, dislike_count = dislike_count + $2 WHERE comment_id = $3
        RETURNING like_count, dislike_count
        `,
        [likeDelta, dislikeDelta, commentId],
      );
      await connect.query("COMMIT");

      return {
        likeCount: commentStatsResult?.rows[0]?.like_count || 0,
        dislikeCount: commentStatsResult?.rows[0]?.dislike_count || 0,
      };
    } catch (error) {
      await connect.query("ROLLBACK");
      throw error;
    } finally {
      connect.release();
    }
  }
}

const psqlCommentaryService = PsqlCommentaryServiceSingleton.getInstance();

export { psqlCommentaryService };
