import type {
  CommentaryActionsWithDiscussionContext,
  CommentItem,
  PaginationParams,
  SortingStrategy,
} from "@shared/src/types/core";
import type {
  CommentSlice,
  CommentStats,
  User,
  UserReaction,
} from "@shared/src/types/data";
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

export class FileCommentaryServiceSingleton implements CommentaryActionsWithDiscussionContext {
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

  private async readMockFile<T>(name: MockFileName): Promise<T> {
    try {
      const file = await this.readFile(
        path.join(__dirname, "..", "mocks", `${name}.json`),
      );
      return JSON.parse(file) as T;
    } catch (error) {
      throw error;
    }
  }

  private async writeMockFile(name: MockFileName, data: unknown) {
    return fs.writeFileSync(
      path.join(__dirname, "..", "mocks", `${name}.json`),
      JSON.stringify(data, null, 2),
    );
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
          this.readMockFile<CommentItem[]>("comments"),
          this.readMockFile<UserReaction[]>("user-reactions"),
          this.readMockFile<CommentStats[]>("comment-stats"),
          this.readMockFile<User[]>("users"),
        ]);

      const comments = validateComments(commentsJson);
      const userReactions = validateUserReactions(userReactionsJson);
      const commentStats = validateCommentStats(commentStatsJson);
      const users = validateUsers(usersJson);

      const filteredOutComments = comments.filter(
        (comment) =>
          comment.parentId === parentId &&
          comment.discussionId === discussionId,
      );

      const sortedComments = filteredOutComments.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      const commentsSlice = sortedComments.slice(offset, offset + limit);

      const finalComments: CommentItem[] = commentsSlice.map((comment) => {
        return {
          comment,
          commentStats: commentStats.filter(
            (stat) => stat.commentId === comment.commentId,
          )[0],
          author: users.filter((user) => user.userId === comment.userId)[0],
          userReaction: userReactions.filter(
            (reaction) => reaction.commentId === comment.commentId,
          )[0],
        };
      });

      if (sortBy === "newest") {
        finalComments.sort(
          (a, b) =>
            new Date(b.comment.createdAt).getTime() -
            new Date(a.comment.createdAt).getTime(),
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
    params: PaginationParams & { sortBy: SortingStrategy },
  ) {
    return this.fetchComments({ discussionId, parentId: null, params });
  }

  async getReplies(
    discussionId: string,
    params: PaginationParams & { sortBy: SortingStrategy; parentId: string },
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
    user: User,
    parentId: Nullable<string>,
  ) {
    const [commentsJson, commentStatsJson, usersJson] = await Promise.all([
      this.readMockFile<CommentItem[]>("comments"),
      this.readMockFile<CommentStats[]>("comment-stats"),
      this.readMockFile<User[]>("users"),
    ]);

    const comments = validateComments(commentsJson);
    const commentStats = validateCommentStats(commentStatsJson);
    const users = validateUsers(usersJson);

    const newCommentId = crypto.randomUUID();

    const newCommentSlice: CommentSlice = {
      commentId: newCommentId,
      discussionId,
      userId: user.userId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId,
    };

    const newCommentStats: CommentStats = {
      commentId: newCommentId,
      likeCount: 0,
      dislikeCount: 0,
      replyCount: 0,
    };

    comments.push(newCommentSlice);
    commentStats.push(newCommentStats);

    // check if the author exists
    const author = users.find((user) => user.userId === user.userId);
    if (!author) {
      users.push(user);
      await this.writeMockFile("users", users);
    }
    await this.writeMockFile("comments", comments);
    await this.writeMockFile("comment-stats", commentStats);

    const newComment: CommentItem = {
      comment: newCommentSlice,
      commentStats: newCommentStats,
      author: user,
      userReaction: null,
    };

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
