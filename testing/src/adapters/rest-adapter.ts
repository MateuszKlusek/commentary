import { contract } from "@shared/src/contracts";
import type { CommentaryActions, GetParams } from "@shared/src/types/core";
import type { User, UserSentiment } from "@shared/src/types/data";
import type { Nullable } from "@shared/src/types/helpers";
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
    userId,
    snapshotTime,
  }: GetParams<CommentaryActions["getTopLevelComments"]>) => {
    const res = await this.client.getTopLevelComments({
      query: {
        offset,
        limit,
        discussionId: this.discussionId,
        sortBy,
        userId,
        snapshotTime,
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

  getReplies = async ({
    offset,
    limit,
    parentId,
    sortBy,
    userId,
    snapshotTime,
  }: GetParams<CommentaryActions["getReplies"]>) => {
    const res = await this.client.getReplies({
      query: {
        offset,
        limit,
        parentId,
        discussionId: this.discussionId,
        sortBy,
        userId,
        snapshotTime,
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
    userId: User["userId"],
    parentId: Nullable<string>
  ) => {
    const res = await this.client.addComment({
      body: {
        content,
        userId,
        parentId,
        discussionId: this.discussionId,
      },
    });

    if (res.status === 200) {
      return res.body;
    }

    throw new Error("Failed to add comment");
  };

  handleUserSentiment = async ({
    commentId,
    userId,
    sentiment,
  }: UserSentiment) => {
    const res = await this.client.handleUserSentiment({
      body: {
        commentId,
        userId,
        sentiment,
      },
    });
    if (res.status === 200) {
      return res.body;
    }
    throw new Error("Failed to handle user sentiment");
  };
  slug: Nullable<string>;
  userId: Nullable<string>;
}
