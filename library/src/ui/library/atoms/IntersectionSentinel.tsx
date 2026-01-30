import type { RefObject } from "react";

export const IntersectionSentinel = ({ ref }: { ref: RefObject<HTMLDivElement | null> }) => {
    return <div ref={ref} className="h-0.25" />;
};