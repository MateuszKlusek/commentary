import type {
  CommentaryActionsWithDiscussionContext,
  CommentItem,
  CommentItemWithId,
  PaginationParams,
  SortingStrategy,
} from "@shared/src/types/core";
import type { CommentStats, User, UserReaction } from "@shared/src/types/data";
import type { Nullable } from "@shared/src/types/helpers";
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

  private async fetchComments({
    discussionId,
    parentId,
    params,
  }: {
    discussionId: string;
    parentId: Nullable<string>;
    params: PaginationParams & { sortBy: SortingStrategy };
  }) {
    const { offset, limit, sortBy } = params;
    try {
      const [commentsJson, userReactionsJson, commentStatsJson, usersJson] =
        await Promise.all([
          this.readMockFile("comments"),
          this.readMockFile("user-reactions"),
          this.readMockFile("comment-stats"),
          this.readMockFile("users"),
        ]);

      const commentsInvalidated = JSON.parse(commentsJson) as CommentItem[];
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

      const filteredOutComments = comments.filter(
        (comment) =>
          comment.parentId === parentId && comment.discussionId === discussionId
      );

      const commentsSlice = filteredOutComments.slice(offset, offset + limit);

      const finalComments: CommentItem[] = commentsSlice.map((comment) => {
        return {
          comment,
          commentStats: commentStats.filter(
            (stat) => stat.commentId === comment.commentId
          )[0],
          author: users.filter((user) => user.userId === comment.userId)[0],
          userReaction: userReactions.filter(
            (reaction) => reaction.commentId === comment.commentId
          )[0],
        };
      });

      if (sortBy === "newest") {
        finalComments.sort(
          (a, b) =>
            new Date(b.comment.createdAt).getTime() -
            new Date(a.comment.createdAt).getTime()
        );
      }

      return {
        items: finalComments,
        itemsCount: filteredOutComments.length,
      };
    } catch (error) {
      throw error;
    }
  }

  // ---------------------- CommentaryAPI methods ------------------------

  async getTopLevelComments(
    discussionId: string,
    params: PaginationParams & { sortBy: SortingStrategy }
  ) {
    return this.fetchComments({ discussionId, parentId: null, params });
  }

  async getReplies(
    discussionId: string,
    params: PaginationParams & { sortBy: SortingStrategy; parentId: string }
  ) {
    return this.fetchComments({
      discussionId,
      parentId: params.parentId,
      params,
    });
  }

  async addComment(
    discussionId: string,
    content: string,
    userId: string,
    parentId: Nullable<string>
  ) {
    const commentsJson = await this.readMockFile("comments");
    const commentsArray = JSON.parse(commentsJson);
    const commentId = crypto.randomUUID();

    const newComment: CommentItemWithId = {
      comment: {
        id: crypto.randomUUID(),
        commentId,
        discussionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content,
        userId,
        parentId,
      },
      commentStats: {
        id: crypto.randomUUID(),
        commentId,
        likeCount: 0,
        dislikeCount: 0,
        replyCount: 0,
      },
      author: {
        id: crypto.randomUUID(),
        userId,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(
          Math.random() * 100
        )}`,
        name: `User${Math.floor(Math.random() * 70)}`,
      },
      userReaction: {
        id: crypto.randomUUID(),
        commentId,
        userId,
        reaction: 0,
        createdAt: new Date().toISOString(),
      },
    };
    commentsArray.push(newComment);

    return newComment;
  }

  async handleUserReaction({
    commentId,
    userId,
    reaction,
  }: Omit<UserReaction, "createdAt">): Promise<void> {
    void commentId;
    void userId;
    void reaction;
    return;
  }

  slug: Nullable<string>;
  userId: Nullable<string>;
}

const fileCommentaryService = FileCommentaryServiceSingleton.getInstance();

export { fileCommentaryService as commentaryService };
