import { contract } from "@shared/src/contracts";
import type { CommentaryActions, GetParams } from "@shared/src/types/core";
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

  getTopLevelComments = async ({
    offset,
    limit,
    sortBy,
  }: GetParams<CommentaryActions["getTopLevelComments"]>) => {
    const res = await this.client.getTopLevelComments({
      query: { offset, limit, discussionId: this.discussionId, sortBy },
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

  getReplies = async ({
    offset,
    limit,
    parentId,
  }: GetParams<CommentaryActions["getReplies"]>) => {
    const res = await this.client.getReplies({
      query: {
        offset,
        limit,
        parentId,
      },
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

  addComment = async (
    content: string,
    userId: string,
    parentId: string | null
  ) => {
    const res = await this.client.addComment({
      body: { content, userId, parentId, discussionId: this.discussionId },
    });

    if (res.status === 200) {
      return res.body;
    }
    throw new Error("Failed to add comment");
  };

  updateLike(commentId: string, like: boolean): Promise<void> {
    void commentId;
    void like;
    return Promise.resolve();
  }
  slug: string | null | undefined;
  userId: string | null | undefined;
}
