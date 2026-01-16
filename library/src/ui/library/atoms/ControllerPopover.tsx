import * as Popover from "@radix-ui/react-popover";

type Props = React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: React.ReactNode;
}>;

export const ControlleredPopover = ({
  open,
  onOpenChange,
  anchor,
  children,
}: Props) => {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Anchor asChild>{anchor}</Popover.Anchor>
      <Popover.Content side="left" avoidCollisions>
        {children}
      </Popover.Content>
    </Popover.Root>
  );
};
