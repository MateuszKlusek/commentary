import { ControlleredPopover } from "./atoms/ControllerPopover";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: React.ReactNode;
};

export const NoUserPopover = ({ open, onOpenChange, anchor }: Props) => {
  return (
    <ControlleredPopover
      open={open}
      onOpenChange={onOpenChange}
      anchor={anchor}
    >
      <div className="p-4 bg-red-500">
        <h3>Want to join the conversation?</h3>
        <p>Sign in to continue</p>
        <button>Sign in</button>
      </div>
    </ControlleredPopover>
  );
};
