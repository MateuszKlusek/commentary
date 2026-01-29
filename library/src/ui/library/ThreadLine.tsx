import { useCommentBlock } from "../../context/CommentBlockContext";
import { cn } from "../../utils/style";

type Props = {
    type: "comment" | "reply",
};

export const ParentThreadLine = () => {
    const { isHovered, setIsHovered, setShowReplies } = useCommentBlock();
    return (
        <commentary-thread-line className="w-full h-full flex justify-end mt-1 cursor-pointer"
            onClick={() => setShowReplies(prev => !prev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={cn(
                "w-1/2 h-full border-l border-thread-line",
                isHovered && "border-thread-line-hover"
            )}
            />
        </commentary-thread-line>
    );
};

export const CurvedThreadLine = ({ type }: Props) => {
    const { isHovered, setIsHovered, setShowReplies } = useCommentBlock();
    return (
        <commentary-thread-line
            className={cn(
                "flex gap-4 relative cursor-pointer",
                type === "comment" ? "min-w-[34px]" : "min-w-[24px]"
            )}
            onClick={() => setShowReplies(prev => !prev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-full h-full flex justify-end ">
                <div
                    className={cn(`
                                w-1/2 
                                h-[40%]
                                border-b 
                                border-l 
                                rounded-bl-full 
                                border-thread-line
                                ${isHovered && "border-thread-line-hover"}
                            `)}
                />
            </div>
        </commentary-thread-line>
    );
};

export const ReplyThreadLine = ({ type }: Props) => {
    const { isHovered, setIsHovered, setShowReplies } = useCommentBlock();
    return (
        <commentary-thread-line
            className={cn(
                "flex gap-4 relative cursor-pointer",
                type === "comment" ? "min-w-[34px]" : "min-w-[24px]"
            )}
            onClick={() => setShowReplies(prev => !prev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={cn(`absolute top-0 bottom-0 w-[34px]`, type === "comment" ? "left-[17px]" : "left-[12px]")}>
                <div
                    className={cn(
                        "w-1/2 h-[12px] border-b border-l rounded-bl-full border-thread-line",
                        isHovered && "border-thread-line-hover"
                    )}
                />
            </div>
            <div className="w-full h-full flex justify-end">
                <div className={cn(
                    "w-1/2 h-full border-l border-thread-line",
                    isHovered && "border-thread-line-hover"
                )}
                />
            </div>
        </commentary-thread-line>
    );
};