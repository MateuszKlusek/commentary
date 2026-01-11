import { useLayoutEffect, useRef } from "react";
import { cn } from "../../utils/style";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  onFocus?: () => void;
} & React.ComponentProps<"textarea">;

export const AutoTextarea = ({
  value,
  onChange,
  className,
  onFocus,
  onBlur,
  ...props
}: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);

    el.style.height = `${lineHeight}px`;
    el.style.height = `${el.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    resize();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    resize();
    onChange(e);
  };

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={handleChange}
      rows={1}
      onFocus={onFocus}
      className={cn(
        `
        w-full
        resize-none
        overflow-hidden
        focus:outline-none
        border-b
        focus:border-white
        px-0
        py-1
        leading-6
        box-border
      `,
        className
      )}
      {...props}
    />
  );
};
