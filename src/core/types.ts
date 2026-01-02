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

// web components

export type WebComponentProps<T extends object = object> =
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & T, HTMLElement>;
