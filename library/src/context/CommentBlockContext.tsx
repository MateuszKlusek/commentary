import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

const CommentBlockContext = createContext<{
  commentBlockStatus: "open-focused" | "open-blurred" | "closed";
  setCommentBlockStatus: (
    status: "open-focused" | "open-blurred" | "closed"
  ) => void;
  isHovered: boolean;
  setIsHovered: Dispatch<SetStateAction<boolean>>
  showReplies: boolean;
  setShowReplies: Dispatch<SetStateAction<boolean>>
}>({
  commentBlockStatus: "closed",
  setCommentBlockStatus: () => { },
  isHovered: false,
  setIsHovered: () => { },
  showReplies: false,
  setShowReplies: () => { },
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
  const [showReplies, setShowReplies] = useState(false);

  return (
    <CommentBlockContext.Provider
      value={{ commentBlockStatus, setCommentBlockStatus, isHovered, setIsHovered, showReplies, setShowReplies }}
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
