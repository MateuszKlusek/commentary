import { useEffect, useRef, useState } from "react";
import { useCopy } from "../../../context/CopyContext";

export const CommentRender = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  const { readMoreActionLabels } = useCopy();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;

    const checkOverflow = () => {
      setCanExpand(el.scrollHeight > el.clientHeight);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <div>
      <div
        ref={ref}
        className={`text-[14px] font-normal text-[#f1f1f1] whitespace-pre-line ${
          expanded ? "" : "line-clamp-5"
        }`}
      >
        {text}
      </div>

      {canExpand && (
        <span
          onClick={() => setExpanded((p) => !p)}
          className="mt-1 text-[14px] text-[#aaa] hover:underline font-medium cursor-pointer"
        >
          {expanded
            ? readMoreActionLabels.showLess
            : readMoreActionLabels.readMore}
        </span>
      )}
    </div>
  );
};
