export const endpoints = {
  getReplies: (commentId: string, offset: number, limit: number) =>
    `/replies?commentId=${commentId}&offset=${offset}&limit=${limit}`,
  getTopLevelCommentCount: () => `/comments/count`,
  getTopLevelComments: (offset: number, limit: number) =>
    `/comments?offset=${offset}&limit=${limit}`,
};
