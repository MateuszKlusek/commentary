import { useEffect, useRef, useState } from "react";

export const CommentRender = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setOverflowing(el.scrollHeight > el.clientHeight);
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkOverflow = () => {
      setOverflowing(el.scrollHeight > el.clientHeight);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    return () => observer.disconnect();
  }, [text]);

  return (
    <div>
      <div
        ref={ref}
        className={`text-[14px] font-normal text-[#f1f1f1] whitespace-pre-line
        ${expanded ? "" : "line-clamp-5"}
      `}
      >
        {text}
      </div>

      {overflowing && (
        <span
          onClick={() => setExpanded((p) => !p)}
          className="mt-1 text-[14px] text-[#aaa] hover:underline font-medium cursor-pointer"
        >
          {expanded ? "Show less" : "Read more"}
        </span>
      )}
    </div>
  );
};
