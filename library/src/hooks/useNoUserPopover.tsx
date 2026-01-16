import * as Popover from "@radix-ui/react-popover";
import { useCallback, useState } from "react";
import { useCopy } from "../context/CopyContext";

export const useNoUserPopover = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    noUserTooltip: { title, description, buttonLabel },
  } = useCopy();

  const NoUserPopover = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Anchor>{children}</Popover.Anchor>
          <Popover.Content side="bottom" align="start" avoidCollisions>
            <div className="p-6 bg-[#212121] rounded-3xl gap-2 flex flex-col items-center">
              <h3 className="text-[#ffffff] text-[20px] font-bold">{title}</h3>
              <p className="text-[#AAAAAA] text-[14px] font-normal">
                {description}
              </p>
              <button className="text-[#0f0f0f] text-[14px] font-medium bg-[#f1f1f1] rounded-full px-4 py-2 mt-2 w-full cursor-pointer hover:bg-[#e1e1e1]">
                {buttonLabel}
              </button>
            </div>
          </Popover.Content>
        </Popover.Root>
      );
    },
    [isOpen]
  );

  return { isOpen, setIsOpen, NoUserPopover };
};
