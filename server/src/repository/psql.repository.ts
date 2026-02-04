import type { CommentItem, SortingStrategy } from "@shared/src/types/core";
import type { UserSentiment } from "@shared/src/types/data";
import type { Nullable } from "@shared/src/types/helpers";
import type { PoolClient } from "pg";

export class PsqlCommentaryRepository {
  private mapRowToCommentItem = (row: any): CommentItem => {
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
        // defaulting to 0 crucial, it won't pass through the validator since we are using [-1, 0, 1]
        sentiment: row.user_sentiment ?? 0,
      },
    };
  };

  public getCommentStats = async ({
    commentId,
    likeDelta,
    dislikeDelta,
    connect,
  }: {
    commentId: string;
    likeDelta: number;
    dislikeDelta: number;
    connect: PoolClient;
  }) => {
    const commentStatsResult = await connect.query<{
      like_count: number;
      dislike_count: number;
    }>(
      `
        UPDATE comment_stats SET like_count = like_count + $1, dislike_count = dislike_count + $2 WHERE comment_id = $3
        RETURNING like_count, dislike_count
        `,
      [likeDelta, dislikeDelta, commentId]
    );

    return {
      likeCount: commentStatsResult.rows[0].like_count || 0,
      dislikeCount: commentStatsResult.rows[0].dislike_count || 0,
    };
  };

  public getSentiment = async ({
    userId,
    commentId,
    connect,
  }: {
    userId: string;
    commentId: string;
    connect: PoolClient;
  }) => {
    const oldSentiment = await connect.query<{
      sentiment: UserSentiment["sentiment"];
    }>(
      `
            SELECT sentiment FROM user_sentiments WHERE user_id = $1 AND comment_id = $2
            `,
      [userId, commentId]
    );

    return oldSentiment.rows[0]?.sentiment;
  };

  public upsertSentiment = async ({
    userId,
    commentId,
    sentiment,
    connect,
  }: {
    userId: string;
    sentiment: UserSentiment["sentiment"];
    commentId: string;
    connect: PoolClient;
  }) => {
    await connect.query(
      `
            INSERT INTO user_sentiments (user_id, comment_id, sentiment)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, comment_id) DO UPDATE SET sentiment = $3
            `,
      [userId, commentId, sentiment]
    );
  };

  public getCommentCount = async ({
    discussionId,
    parentId,
    snapshotTime,
    connect,
  }: {
    parentId: Nullable<string>;
    snapshotTime: string;
    discussionId: string;
    connect: PoolClient;
  }) => {
    const countResult = await connect.query<{ total: string }>(
      `
            SELECT COUNT(*) as total
            FROM comments
            WHERE discussion_id = $1 AND parent_id IS NOT DISTINCT FROM $2
            AND created_at <= $3
            `,
      [discussionId, parentId, snapshotTime]
    );
    return parseInt(countResult.rows[0].total, 10);
  };

  public getComments = async ({
    discussionId,
    parentId,
    snapshotTime,
    sortBy,
    userId,
    limit,
    offset,
    connect,
  }: {
    parentId: Nullable<string>;
    snapshotTime: string;
    discussionId: string;
    sortBy: SortingStrategy;
    userId: Nullable<string>;
    limit: number;
    offset: number;
    connect: PoolClient;
  }) => {
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
      AND c.created_at <= $4
      ORDER BY c.created_at ${sortBy === "newest" ? "DESC" : "ASC"}
      LIMIT $5 OFFSET $6
      `,
      [discussionId, userId, parentId, snapshotTime, limit, offset]
    );

    const rows: CommentItem[] = result.rows.map(this.mapRowToCommentItem);

    return rows;
  };

  public insertComment = async ({
    commentId,
    discussionId,
    userId,
    parentId,
    content,
    connect,
  }: {
    commentId: string;
    discussionId: string;
    userId: string;
    parentId: Nullable<string>;
    content: string;
    connect: PoolClient;
  }) => {
    await connect.query(
      `
            INSERT INTO comments (comment_id, discussion_id, user_id, parent_id, content)
            VALUES ($1, $2, $3, $4, $5)
            `,
      [commentId, discussionId, userId, parentId, content]
    );
  };

  public insertCommentStats = async ({
    commentId,
    connect,
  }: {
    commentId: string;
    connect: PoolClient;
  }) => {
    await connect.query(
      `
            INSERT INTO comment_stats (comment_id, like_count, dislike_count, reply_count)
            VALUES ($1, 0, 0, 0)
      `,
      [commentId]
    );
  };

  public incrementParentReplyCount = async ({
    parentId,
    connect,
  }: {
    parentId: string;
    connect: PoolClient;
  }) => {
    await connect.query(
      `
            UPDATE comment_stats SET reply_count = reply_count + 1 WHERE comment_id = $1
            `,
      [parentId]
    );
  };

  public getFreshComment = async ({
    commentId,
    userId,
    connect,
  }: {
    commentId: string;
    userId: string;
    connect: PoolClient;
  }) => {
    const commentResult = await connect.query(
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
            WHERE c.comment_id = $1
            `,
      [commentId, userId]
    );

    const rows: CommentItem[] = commentResult.rows.map(
      this.mapRowToCommentItem
    );
    return rows[0];
  };
}
