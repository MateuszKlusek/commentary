import { useEffect, useRef, useState } from "react";
import { useCopy } from "../../../copy/CopyContext";

const MAX_LINES = 4;

export const CommentRender = ({ text }: { text: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [lineHeight, setLineHeight] = useState<number>(0);

  const { readMoreActionLabels } = useCopy();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const computed = window.getComputedStyle(el);
    const lh = parseFloat(computed.lineHeight);

    setLineHeight(lh);
    setOverflowing(el.scrollHeight > lh * MAX_LINES);
  }, [text]);

  return (
    <div>
      <div
        ref={ref}
        className="text-[14px] font-normal text-[#f1f1f1] overflow-hidden transition-[max-height] duration-200"
        style={{
          maxHeight:
            expanded || !lineHeight ? "none" : `${lineHeight * MAX_LINES}px`,
        }}
      >
        {text.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </div>

      {overflowing && (
        <span
          onClick={() => setExpanded((p) => !p)}
          className="mt-1 text-[14px] text-[#aaa] hover:underline font-medium cursor-pointer hover:underline"
        >
          {expanded
            ? readMoreActionLabels.showLess
            : readMoreActionLabels.readMore}
        </span>
      )}
    </div>
  );
};
