import { cn } from "../../../utils/style";

type Props = {
  count?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  skeletonAvatarSize?: number
};

export const CommentSkeleton = ({ count = 3, colorTo = "bg-[#ffffff33]", className, skeletonAvatarSize = 9 }: Props) => {
  const avatarSize = skeletonAvatarSize || 9;

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse ">
          <div className="flex gap-4 w-full">
            {/* Avatar */}
            <div className={cn(`h-${avatarSize} w-${avatarSize} rounded-full`, colorTo)} />

            {/* Comment content */}
            <div className="flex flex-col gap-1.5 w-full">
              <div className={cn("h-3.5 w-1/4 rounded-full", colorTo)} />

              <div className={cn("h-3.5 w-full rounded-full", colorTo)} />
              <div className={cn("h-3.5 w-full rounded-full", colorTo)} />

              <div className="flex gap-1">
                <div className={cn("h-3.5 w-1/20 rounded-full", colorTo)} />
                <div className={cn("h-3.5 w-1/20 rounded-full", colorTo)} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

type GenericSkeletonItemProps = Props & {
  innerClassName?: string;
};

export const GenericSkeletonItem = ({ colorTo = "bg-[#ffffff33]", className, innerClassName }: GenericSkeletonItemProps) => {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className={cn("h-full w-full rounded", colorTo, innerClassName)} />
    </div>
  );
};