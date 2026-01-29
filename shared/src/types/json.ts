import type { UserSentiment } from "./data";

export type JsonCommentStats = {
  commentId: string;
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
};

export type JsonComment = {
  commentId: string;
  discussionId: string;
  userId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
};

export type JsonUserSentiment = {
  userId: string;
  commentId: string;
  sentiment: UserSentiment["sentiment"];
  createdAt: string;
};

export type JsonUser = {
  userId: string;
  name: string;
  avatarUrl: string;
};
