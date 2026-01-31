import type { PropsWithChildren } from "react";
import { cn } from "../../../utils/style";

type ButtonProps = PropsWithChildren<{
    onClick: () => void;
    className?: string;
}>

export const Button = ({ onClick, className, children }: ButtonProps) => {
    return (
        <button
            className={cn(`
                w-fit flex text-[#ffffff] cursor-pointer hover:bg-white/20 rounded-full px-2 py-2 gap-1 `,
                className)}
            onClick={onClick}>
            {children}
        </button>
    );
};