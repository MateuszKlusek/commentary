import { createContext, useContext, useState } from "react";

const CommentBlockContext = createContext<{
  commentBlockStatus: "open-focused" | "open-blurred" | "closed";
  setCommentBlockStatus: (
    status: "open-focused" | "open-blurred" | "closed"
  ) => void;
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
}>({
  commentBlockStatus: "closed",
  setCommentBlockStatus: () => { },
  isHovered: false,
  setIsHovered: () => { },
});

export const CommentBlockProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [commentBlockStatus, setCommentBlockStatus] = useState<
    "open-focused" | "open-blurred" | "closed"
  >("closed");

  const [isHovered, setIsHovered] = useState(false);
  return (
    <CommentBlockContext.Provider
      value={{ commentBlockStatus, setCommentBlockStatus, isHovered, setIsHovered }}
    >
      {children}
    </CommentBlockContext.Provider>
  );
};

export const useCommentBlock = () => {
  const context = useContext(CommentBlockContext);
  if (!context) {
    throw new Error(
      "useCommentBlockStatus must be used within a CommentBlockStatusProvider"
    );
  }
  return context;
};
