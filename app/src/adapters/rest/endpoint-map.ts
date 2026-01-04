export const endpoints = {
  getUser: (id: string) => `/users/${id}`,
  updateUser: (userId: string) => `/users/${userId}`,
  deleteUser: (id: string) => `/users/${id}`,
  getTopLevelCommentCount: () => `/comments/count`,
  getTopLevelComments: (offset: number, limit: number) =>
    `/comments?offset=${offset}&limit=${limit}`,
};
