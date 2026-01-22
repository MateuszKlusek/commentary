import * as Select from "@radix-ui/react-select";

type SelectOption = {
  title: string;
  subtitle: string;
  value: string;
};

type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
};

export function SortingStrategySelector({
  value,
  onValueChange,
  options,
}: SelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className="inline-flex items-center justify-between gap-2 rounded-md text-sm shadow-sm outline-none hover:cursor-pointer"
        aria-label="Select"
      >
        <Select.Value className="sr-only" >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M3 12H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M3 17H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </Select.Value>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="
            z-50 
            overflow-hidden 
            rounded-md 
            bg-[#212121] 
            py-2
          "
          position="popper"
          sideOffset={4}
          align="start"
          avoidCollisions

        >
          <Select.Viewport >
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="
                  relative 
                  flex 
                  cursor-pointer 
                  select-none 
                  items-center 
                  px-4 
                  text-sm 
                  outline-none 
                  focus:bg-[rgba(255,255,255,0.2)] 
                  data-[state=checked]:bg-[rgba(255,255,255,0.2)]
                "
              >
                <Select.ItemText className="flex flex-col ">
                  <div className="flex flex-col h-[72px] justify-center">
                    <span className="text-[14px] text-[#f1f1f1]">
                      {option.title}
                    </span>
                    <span className="text-[12px] text-[#aaaaaa]">
                      {option.subtitle}
                    </span>
                  </div>
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
