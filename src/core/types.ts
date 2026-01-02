export type CommentData = {
  id: string;
  content: string; // later on test markdown
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
  replies?: CommentData[] | null;
  parentId: string | null;
  userId: string; // consider changing into user object
};
