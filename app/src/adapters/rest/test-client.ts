import type { CommentaryAPI } from "@shared/types/library";
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
    return Promise.resolve([{ id: "1", content: "test" }]);
    const res = await axios.get(
      `${this.baseUrl}${endpoints.getTopLevelComments(offset, limit)}`
    );
    return res.data;
  }
  async getUser(id: string) {
    const res = await axios.get(`${this.baseUrl}${endpoints.getUser(id)}`);
    return res.data;
  }

  async getReplies(commentId: string, offset: number, limit: number) {
    const res = await axios.get(
      `${this.baseUrl}${endpoints.getReplies(commentId, offset, limit)}`
    );
    return res.data;
  }

  async updateLike(commentId: string, like: boolean) {
    const res = await axios.put(
      `${this.baseUrl}${endpoints.updateLike(commentId, like)}`
    );
    return res.data;
  }

  async addComment(content: string, userId: string, parentId: string | null) {}

  async updateUser(user: any) {
    await axios.put(`${this.baseUrl}${endpoints.updateUser(user)}`, user);
  }

  async deleteUser(id: string) {
    await axios.delete(`${this.baseUrl}${endpoints.deleteUser(id)}`);
  }
}
