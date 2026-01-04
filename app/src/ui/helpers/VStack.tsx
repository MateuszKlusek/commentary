import { cn } from "../../utils/style";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export const VStack = ({ children, className }: Props) => {
  return <div className={cn("flex flex-col ", className)}>{children}</div>;
};
