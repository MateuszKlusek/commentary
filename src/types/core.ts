export type CommentData = {
  id: string;
  content: string; // later on test markdown
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
  replyCount: number;
  parentId: string | null;
  userId: string; // consider changing into user object
};

export interface CommentaryRepository {
  getTopLevelCommentCount(): Promise<number>;
  getTopLevelComments(offset: number, limit: number): Promise<CommentData[]>;
}
