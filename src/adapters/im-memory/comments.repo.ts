import type { CommentaryRepository, CommentData } from "../../types/core";
import { comments } from "./mocks";

export class InMemoryCommentsRepo implements CommentaryRepository {
  private comments: CommentData[] | null = null;
  private ready: Promise<void>;

  constructor(delay = 200) {
    this.ready = new Promise((resolve) => {
      setTimeout(() => {
        this.comments = comments;
        resolve();
      }, delay);
    });
  }

  private async ensureReady() {
    await this.ready;
  }

  async getTopLevelCommentCount(): Promise<number> {
    await this.ensureReady();
    return this.comments?.length ?? 0;
  }

  async getTopLevelComments(
    offset: number,
    limit: number
  ): Promise<CommentData[]> {
    await this.ensureReady();
    return (
      this.comments
        ?.filter((comment) => comment.parentId === null)
        ?.slice(offset, offset + limit) ?? []
    );
  }

  async getReplies(
    commentId: string,
    offset: number,
    limit: number
  ): Promise<CommentData[]> {
    await this.ensureReady();
    return (
      this.comments
        ?.filter((comment) => comment.parentId === commentId)
        ?.slice(offset, offset + limit) ?? []
    );
  }
}
