import { createContext, useContext, useState } from "react";

const CommentBlockStatusContext = createContext<{
  commentBlockStatus: "open-focused" | "open-blurred" | "closed";
  setCommentBlockStatus: (
    status: "open-focused" | "open-blurred" | "closed"
  ) => void;
}>({
  commentBlockStatus: "closed",
  setCommentBlockStatus: () => {},
});

export const CommentBlockStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [commentBlockStatus, setCommentBlockStatus] = useState<
    "open-focused" | "open-blurred" | "closed"
  >("closed");

  return (
    <CommentBlockStatusContext.Provider
      value={{ commentBlockStatus, setCommentBlockStatus }}
    >
      {children}
    </CommentBlockStatusContext.Provider>
  );
};

export const useCommentBlockStatus = () => {
  const context = useContext(CommentBlockStatusContext);
  if (!context) {
    throw new Error(
      "useCommentBlockStatus must be used within a CommentBlockStatusProvider"
    );
  }
  return context;
};
