import { useEffect, useState } from "react";
import { useIsLoading } from "../../../hooks/useIsLoading";
import type { CommentData } from "../../../types/core";

type UseLoadInitDataParams = {
  getTopLevelCommentCount: () => Promise<number>;
  getTopLevelComments: (
    offset: number,
    limit: number
  ) => Promise<CommentData[]>;
  initialOffset?: number;
  initialLimit?: number;
};

export const useLoadInitData = ({
  getTopLevelCommentCount,
  getTopLevelComments,
  initialOffset = 0,
  initialLimit = 10,
}: UseLoadInitDataParams) => {
  const loading = useIsLoading();
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        loading.startLoading();
        const [commentsCount, comments] = await Promise.all([
          getTopLevelCommentCount(),
          getTopLevelComments(initialOffset, initialLimit),
        ]);

        setCommentsCount(commentsCount);
        setComments(comments);
      } catch (error) {
        console.error(error);
      } finally {
        loading.stopLoading();
      }
    };
    fetchCommentsCount();
  }, []);

  return {
    commentsCount,
    comments,
    isLoading: loading.isLoading,
  };
};
