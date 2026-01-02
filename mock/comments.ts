import type { CommentData } from "@core/types";

export const comments: CommentData[] = [
  {
    id: "1",
    content: "This is a comment",
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: 0,
    dislikes: 0,
    parentId: null,
    userId: "1",
    replies: [
      {
        id: "2",
        content: "This is a reply",
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        dislikes: 0,
        parentId: "1",
        userId: "2",
      },
      {
        id: "3",
        content: "This is a reply",
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        dislikes: 0,
        parentId: "1",
        userId: "3",
      },
    ],
  },
];
