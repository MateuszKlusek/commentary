import type { CommentaryAPI, CommentData } from "@shared/types";
import { validateComments } from "@shared/validators";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileCommentaryServiceSingleton implements CommentaryAPI {
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
  private async delay(): Promise<void> {
    const delayMs = Math.floor(Math.random() * (1000 - 250 + 1)) + 250;
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

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
  async getTopLevelCommentCount(): Promise<number> {
    try {
      const commentsJson = await this.readCommentsFile();
      const commentsArray = JSON.parse(commentsJson) as CommentData[];
      return commentsArray.length;
    } catch (error) {
      throw error;
    }
  }

  async getTopLevelComments(
    offset: number,
    limit: number
  ): Promise<CommentData[]> {
    try {
      const commentsJson = await this.readCommentsFile();
      const commentsArray = JSON.parse(commentsJson) as CommentData[];
      const result = validateComments(commentsArray);
      return result.slice(offset, offset + limit);
    } catch (error) {
      throw error;
    }
  }
  async getReplies(
    commentId: string,
    offset: number,
    limit: number
  ): Promise<CommentData[]> {
    void commentId;
    void offset;
    void limit;
    return [];
  }
  async updateLike(commentId: string, like: boolean): Promise<void> {
    void commentId;
    void like;
    return;
  }
  async addComment(
    content: string,
    userId: string,
    parentId: string | null
  ): Promise<void> {
    void content;
    void userId;
    void parentId;
    return;
  }
  slug: string | null | undefined;
  userId: string | null | undefined;
}

const fileCommentaryService = FileCommentaryServiceSingleton.getInstance();

export { fileCommentaryService as commentaryService };
