import { contract } from "@shared/src/contracts";
import type {
  CommentaryActions,
  CommentData,
  InfiniteFetcher,
} from "@shared/src/types";
import { initClient, type InitClientArgs } from "@ts-rest/core";

export class GenericRestClient implements CommentaryActions {
  private discussionId: string;
  private client: ReturnType<
    typeof initClient<typeof contract, InitClientArgs>
  >;

  constructor({
    baseUrl,
    discussionId,
  }: {
    baseUrl: string;
    discussionId: string;
  }) {
    this.discussionId = discussionId;
    this.client = initClient(contract, {
      baseUrl,
      baseHeaders: {
        "Content-Type": "application/json",
      },
    });
  }

  getTopLevelComments: InfiniteFetcher<CommentData> = async (params: {
    offset: number;
    limit: number;
  }) => {
    const { offset, limit } = params;
    const res = await this.client.getTopLevelComments({
      query: { offset, limit, discussionId: this.discussionId },
    });

    if (res.status === 200) {
      return {
        items: res.body.items,
        itemsCount: res.body.itemsCount,
      };
    }

    return {
      items: [],
      itemsCount: 0,
    };
  };

  async getReplies(commentId: string, offset: number, limit: number) {
    const res = await this.client.getReplies({
      query: { commentId, offset, limit, discussionId: this.discussionId },
      params: { commentId },
    });
    if (res.status === 200) {
      return res.body.replies;
    }
    return [];
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
