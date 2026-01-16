import * as Popover from "@radix-ui/react-popover";
import { useCallback, useState } from "react";

export const useNoUserPopover = () => {
  const [isOpen, setIsOpen] = useState(false);

  const NoUserPopover = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Anchor>{children}</Popover.Anchor>
          <Popover.Content side="left" avoidCollisions>
            <div className="p-4 bg-red-500">
              <h3>Want to join the conversation?</h3>
              <p>Sign in to continue</p>
              <button>Sign in</button>
            </div>
          </Popover.Content>
        </Popover.Root>
      );
    },
    [isOpen]
  );

  return { isOpen, setIsOpen, NoUserPopover };
};
