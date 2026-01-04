import type { CommentaryAPI, CommentData } from "@shared/types/library";
import { comments as initialComments } from "./mocks/comments";

const STORAGE_KEY = "commentary_comments";

export class InMemoryCommentsRepo implements CommentaryAPI {
  private comments: CommentData[] | null = null;
  private ready: Promise<void>;
  userId: string | null | undefined;
  slug: string | null | undefined;

  constructor(delay = 200) {
    this.ready = new Promise((resolve) => {
      setTimeout(() => {
        this.loadComments();
        resolve();
      }, delay);
    });
  }

  private loadComments(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<{
          id: string;
          commendId: string;
          content: string;
          createdAt: string;
          updatedAt: string;
          likes: number;
          dislikes: number;
          replyCount: number;
          parentId: string | null;
          userId: string;
        }>;
        // Convert date strings back to Date objects
        this.comments = parsed.map((comment) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt),
        }));
      } else {
        // Initialize with mock data if nothing in storage
        this.comments = [...initialComments];
        this.saveComments();
      }
    } catch (error) {
      console.error("Failed to load comments from localStorage:", error);
      this.comments = [...initialComments];
    }
  }

  private saveComments(): void {
    if (this.comments) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.comments));
      } catch (error) {
        console.error("Failed to save comments to localStorage:", error);
      }
    }
  }

  private async ensureReady() {
    await this.ready;
  }

  async getTopLevelCommentCount(): Promise<number> {
    await this.ensureReady();
    return (
      this.comments?.filter((comment) => comment.parentId === null).length ?? 0
    );
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

  async addComment(
    content: string,
    userId: string,
    parentId: string | null
  ): Promise<void> {
    await this.ensureReady();
    const newComment: CommentData = {
      id: crypto.randomUUID(),
      parentId,
      userId,
      content,
      commendId: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      dislikes: 0,
      replyCount: 0,
    };

    if (this.comments) {
      this.comments.push(newComment);
      // Update parent's replyCount if it's a reply
      if (parentId) {
        const parent = this.comments.find((c) => c.id === parentId);
        if (parent) {
          parent.replyCount = (parent.replyCount || 0) + 1;
        }
      }
      this.saveComments();
    }
  }

  async updateLike(commentId: string, like: boolean): Promise<void> {
    await this.ensureReady();
    if (this.comments) {
      const comment = this.comments.find((c) => c.id === commentId);
      if (comment) {
        if (like) {
          comment.likes += 1;
        } else {
          comment.dislikes += 1;
        }
        comment.updatedAt = new Date();
        this.saveComments();
      }
    }
  }
}
