import { cn } from "../../../utils/style";

type Props = {
  count?: number;
  colorFrom?: string;
  colorTo?: string;
};

const CommentLoader = ({ count = 3, colorTo = "bg-[#ffffff33]" }: Props) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse ">
          <div className="flex gap-4 w-full">
            {/* Avatar */}
            <div className={cn("h-9 w-9 rounded-full", colorTo)} />

            {/* Comment content */}
            <div className="flex flex-col gap-1.5 w-full">
              <div className={cn("h-3.5 w-1/4 rounded", colorTo)} />

              <div className={cn("h-3.5 w-full rounded", colorTo)} />
              <div className={cn("h-3.5 w-full rounded", colorTo)} />

              <div className="flex gap-1">
                <div className={cn("h-3.5 w-1/20 rounded", colorTo)} />
                <div className={cn("h-3.5 w-1/20 rounded", colorTo)} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentLoader;
