import type {
  CommentaryActionsWithDiscussionContext,
  CommentItem,
  PaginationParams,
  SortingStrategy,
} from "@shared/src/types/core";
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
    },
  ) {
    const pool = getPool();
    const connect = await pool.connect();
    const { limit, offset, sortBy, userId, parentId } = params;

    try {
      const countResult = await connect.query<{ total: string }>(
        `
      SELECT COUNT(*) as total
      FROM comments
      WHERE discussion_id = $1 AND parent_id IS NOT DISTINCT FROM $2
      `,
        [discussionId, parentId],
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
        ur.reaction as user_reaction
      FROM comments c
      LEFT JOIN comment_stats cs ON cs.comment_id = c.comment_id 
      LEFT JOIN users u ON u.user_id = c.user_id
      LEFT JOIN user_reactions ur ON ur.comment_id = c.comment_id AND ur.user_id = $2
      WHERE c.discussion_id = $1 AND c.parent_id IS NOT DISTINCT FROM $3
      ORDER BY c.created_at ${sortBy === "newest" ? "DESC" : "ASC"}
      LIMIT $4 OFFSET $5
      `,
        [discussionId, userId, parentId, limit, offset],
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
          userReaction: {
            commentId: row.comment_id,
            userId: row.user_id,
            reaction: row.user_reaction,
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
    },
  ) {
    const { limit, offset, sortBy, userId } = params;

    return this.getComments(discussionId, {
      limit,
      offset,
      sortBy,
      userId,
      parentId: null,
    });
  }

  async getReplies(
    discussionId: string,
    params: PaginationParams & { parentId: string; sortBy: SortingStrategy } & {
      userId: Nullable<string>;
    },
  ) {
    const { limit, offset, sortBy, userId, parentId } = params;

    return this.getComments(discussionId, {
      limit,
      offset,
      sortBy,
      userId,
      parentId,
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
}

const psqlCommentaryService = PsqlCommentaryServiceSingleton.getInstance();

export { psqlCommentaryService };
