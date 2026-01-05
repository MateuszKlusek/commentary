import type { CommentaryAPI, CommentData } from "@shared/src/types";
import axios from "axios";
import { endpoints } from "./endpoint-map";

export class GenericRestClient implements CommentaryAPI {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTopLevelCommentCount() {
    const res = await axios.get<{ count: number }>(
      `${this.baseUrl}${endpoints.getTopLevelCommentCount()}`
    );
    console.log(res.data);
    return res.data.count;
  }

  async getTopLevelComments(offset: number, limit: number) {
    const res = await axios.get<{ comments: CommentData[] }>(
      `${this.baseUrl}${endpoints.getTopLevelComments(offset, limit)}`
    );
    return res.data.comments;
  }

  async getReplies(commentId: string, offset: number, limit: number) {
    console.log({ commentId, offset, limit });
    const res = await axios.get<{ replies: CommentData[] }>(
      `${this.baseUrl}${endpoints.getReplies(commentId, offset, limit)}`
    );
    return res.data.replies;
  }
  addComment(
    content: string,
    userId: string,
    parentId: string | null
  ): Promise<void> {
    void content;
    void userId;
    void parentId;
    return Promise.resolve();
  }

  updateLike(commentId: string, like: boolean): Promise<void> {
    void commentId;
    void like;
    return Promise.resolve();
  }
  slug: string | null | undefined;
  userId: string | null | undefined;
}
