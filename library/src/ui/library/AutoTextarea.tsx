import { useLayoutEffect, useRef, useState } from "react";
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
  placeholder,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
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
    <div className="w-full flex flex-col gap-1">
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        rows={1}
        onFocus={() => {
          onFocus?.();
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        className={cn(
          `
        p-1
        w-full
        resize-none
        overflow-hidden
        focus:outline-none
        border-none
        px-0
        py-0
        bg-transparent
        text-[14px] 
        leading-[14px]
        outline-none
        `,
          className
        )}
        style={{
          height: '14px',
          lineHeight: '20px',
          minHeight: '14px'
        }}
        placeholder={placeholder}
        {...props}
      />
      <div className={cn("h-0.25 bg-[#717171]", isFocused && "bg-white")} />
    </div>
  );
};
