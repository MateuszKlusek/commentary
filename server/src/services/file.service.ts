import type {
  CommentaryActionsWithDiscussionContext,
  CommentData,
  SortingStrategy,
} from "@shared/src/types/core";
import type {
  Comment,
  CommentStats,
  User,
  UserReaction,
} from "@shared/src/types/data";
import {
  validateComments,
  validateCommentStats,
  validateUserReactions,
  validateUsers,
} from "@shared/src/validators";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type MockFileName = "comments" | "user-reactions" | "comment-stats" | "users";

export class FileCommentaryServiceSingleton
  implements CommentaryActionsWithDiscussionContext
{
  private static instance: FileCommentaryServiceSingleton;

  private constructor() {}

  public static getInstance() {
    if (!FileCommentaryServiceSingleton.instance) {
      FileCommentaryServiceSingleton.instance =
        new FileCommentaryServiceSingleton();
    }
    return FileCommentaryServiceSingleton.instance;
  }

  // ----------------------- helpers methods ------------------------

  private async readFile(path: string) {
    return fs.readFileSync(path, "utf8");
  }

  private async readMockFile(name: MockFileName) {
    return this.readFile(path.join(__dirname, "..", "mocks", `${name}.json`));
  }

  // ---------------------- CommentaryAPI methods ------------------------

  async getTopLevelComments(
    discussionId: string,
    params: { offset: number; limit: number; sortBy: SortingStrategy }
  ) {
    const { offset, limit, sortBy } = params;
    try {
      const [commentsJson, userReactionsJson, commentStatsJson, usersJson] =
        await Promise.all([
          this.readMockFile("comments"),
          this.readMockFile("user-reactions"),
          this.readMockFile("comment-stats"),
          this.readMockFile("users"),
        ]);

      const commentsInvalidated = JSON.parse(commentsJson) as Comment[];
      const userReactionsInvalidated = JSON.parse(
        userReactionsJson
      ) as UserReaction[];
      const commentStatsInvalidated = JSON.parse(
        commentStatsJson
      ) as CommentStats[];
      const usersInvalidated = JSON.parse(usersJson) as User[];

      const comments = validateComments(commentsInvalidated);
      const userReactions = validateUserReactions(userReactionsInvalidated);
      const commentStats = validateCommentStats(commentStatsInvalidated);
      const users = validateUsers(usersInvalidated);

      const topLevelComments = comments.filter(
        (comment) =>
          comment.parentId === null && comment.discussionId === discussionId
      );

      const topLevelCommentsSliced = topLevelComments.slice(
        offset,
        offset + limit
      );

      const topLevelCommentsMapped: CommentData[] = topLevelCommentsSliced.map(
        (comment) => {
          return {
            comment,
            commentStats: commentStats.find(
              (stat) => stat.commentId === comment.commentId
            ),
            author: users.find((user) => user.userId === comment.userId),
            userReaction: userReactions.find(
              (reaction) => reaction.commentId === comment.commentId
            ),
          };
        }
      );

      if (sortBy === "newest") {
        topLevelCommentsMapped.sort(
          (a, b) =>
            new Date(b.comment.createdAt).getTime() -
            new Date(a.comment.createdAt).getTime()
        );
      }

      return {
        items: topLevelCommentsMapped,
        itemsCount: topLevelComments.length,
      };
    } catch (error) {
      throw error;
    }
  }

  async getReplies(params: {
    offset: number;
    limit: number;
    parentId: string;
  }) {
    const { offset, limit, parentId } = params;
    const commentsJson = await this.readMockFile("comments");
    const commentsArray = JSON.parse(commentsJson) as CommentData[];
    const result = validateComments(commentsArray);

    const replies = result
      .filter((comment) => comment.parentId === parentId)
      .slice(offset, offset + limit);

    return {
      items: replies,
      itemsCount: replies.length,
    };
  }

  async addComment(
    discussionId: string,
    content: string,
    userId: string,
    parentId: string | null
  ) {
    const commentsJson = await this.readMockFile("comments");
    const commentsArray = JSON.parse(commentsJson) as CommentData[];
    const newComment: CommentData = {
      id: crypto.randomUUID(),
      commentId: crypto.randomUUID(),
      discussionId,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      dislikes: 0,
      replyCount: 0,
      content,
      userId,
      parentId,
      author: {
        userId,
        id: crypto.randomUUID(),
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(
          Math.random() * 100
        )}`,
        name: `User${Math.floor(Math.random() * 70)}`,
      },
    };
    commentsArray.push(newComment);

    await fs.writeFileSync(
      path.join(__dirname, "..", "mocks", "comments.json"),
      JSON.stringify(commentsArray)
    );
    return newComment;
  }

  async updateLike(commentId: string, like: boolean): Promise<void> {
    void commentId;
    void like;
    return;
  }

  slug: string | null | undefined;
  userId: string | null | undefined;
}

const fileCommentaryService = FileCommentaryServiceSingleton.getInstance();

export { fileCommentaryService as commentaryService };
