import { cn } from "../../../library/src/utils/style";

export const Input = ({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "border-2 border-yellow-400 rounded-md p-2 w-full",
        className
      )}
    />
  );
};
