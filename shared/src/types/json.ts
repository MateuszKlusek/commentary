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
  updatedAt: string;
};

export type JsonUserReaction = {
  userId: string;
  commentId: string;
  reaction: 1 | -1 | 0;
  createdAt: string;
};

export type JsonUser = {
  userId: string;
  name: string;
  avatarUrl: string;
};
