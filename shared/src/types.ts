export type CommentData = {
  id: string;
  commendId: string;
  // TODO: later on test markdown feasibility
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
  replyCount: number;
  parentId: string | null;
  userId: string;
};

export interface CommentaryAPI {
  getTopLevelCommentCount(): Promise<number>;
  getTopLevelComments(offset: number, limit: number): Promise<CommentData[]>;
  getReplies(
    commentId: string,
    offset: number,
    limit: number
  ): Promise<CommentData[]>;
  updateLike(commentId: string, like: boolean): Promise<void>;
  addComment(
    content: string,
    userId: string,
    parentId: string | null
  ): Promise<void>;

  // used for url, it can be a slug or a different identifier
  slug: string | null | undefined;
  userId: string | null | undefined;
  validationMode?: "warn" | "strict" | "silent";
}

export type ReactionData = {
  commentId: number;
  userId: number;
  reaction: 1 | -1 | 0; // 1 = like, -1 = dislike, 0 = none
  createdAt: string;
};
