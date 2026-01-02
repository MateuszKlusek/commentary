import { cn } from "../../utils/style";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export const HStack = ({ children, className }: Props) => {
  return <div className={cn("flex flex-row ", className)}>{children}</div>;
};
