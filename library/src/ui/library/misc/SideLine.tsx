import { cn } from "../../../utils/style";

// SideLine.tsx
export const ThreadLine = ({
    type,
    hasReplies,
    repliesShown,
    className
}: {
    type: "comment" | "reply",
    hasReplies: boolean,
    repliesShown: boolean,
    className?: string
}) => {
    return (
        <svg
            className={cn("absolute left-0 top-0 h-full w-[40px] pointer-events-none", className)}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 40 100"
        >
            <g
                fill="none"
                stroke="#272727"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
            >
                {/* THE VERTICAL STEM: The anchor point at x=18 */}
                <line x1="18" y1="0" x2="18" y2="100" />

                {/* TOP BRANCH: If this is a reply, reach back to the parent stem */}
                {type === "reply" && (
                    <path d="M-20 18 L 20 18 Z M-20 18 L 20 18" />
                )}

                {/* BOTTOM BRANCH: Curving to the "Replies" button */}
                {hasReplies && !repliesShown && (
                    <path d="M 18,80 Q 18,92 30,92" />
                )}
            </g>
        </svg>
    );
};