type Props = {
  count?: number;
};

const CommentLoader = ({ count = 3 }: Props) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex space-x-3 animate-pulse">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>

          {/* Comment content */}
          <div className="flex-1 space-y-2">
            {/* Username */}
            <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>

            {/* Comment lines */}
            <div className="space-y-1">
              <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Timestamp */}
            <div className="h-3 w-1/6 bg-gray-300 dark:bg-gray-700 rounded mt-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentLoader;
