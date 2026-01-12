import type {
  CommentaryActionsWithDiscussionContext,
  CommentData,
  SortingStrategy,
} from "@shared/src/types/core";
import { validateComments } from "@shared/src/validators";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  private async readCommentsFile() {
    return this.readFile(path.join(__dirname, "..", "mocks", "comments.json"));
  }

  private async readUserReactionsFile() {
    return this.readFile(
      path.join(__dirname, "..", "mocks", "user-reactions.json")
    );
  }

  // ---------------------- CommentaryAPI methods ------------------------

  async getTopLevelComments(
    discussionId: string,
    params: { offset: number; limit: number; sortBy: SortingStrategy }
  ) {
    const { offset, limit, sortBy } = params;
    try {
      const commentsJson = await this.readCommentsFile();
      const commentsArray = JSON.parse(commentsJson) as CommentData[];
      const result = validateComments(commentsArray);
      const topLevelComments = result.filter(
        (comment) =>
          comment.parentId === null && comment.discussionId === discussionId
      );
      if (sortBy === "newest") {
        topLevelComments.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      }

      return {
        items: topLevelComments.slice(offset, offset + limit),
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
    const commentsJson = await this.readCommentsFile();
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
    const commentsJson = await this.readCommentsFile();
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
        id: userId,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(
          Math.random() * 100
        )}`,
        name: `User${Math.floor(Math.random() * 70)}`,
      },
    };
    commentsArray.push(newComment);

    const parentComment = commentsArray.find(
      (comment) => comment.commentId === parentId
    );

    if (parentComment) {
      parentComment.replyCount++;
    }

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
