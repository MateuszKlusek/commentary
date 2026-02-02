import type { PropsWithChildren } from "react";
import { cn } from "../../../utils/style";

type ButtonProps = PropsWithChildren<{
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}>

export const Button = ({ onClick, className, children, disabled = false }: ButtonProps) => {
    return (
        <button
            disabled={disabled}
            className={cn(`
                w-fit flex text-[#ffffff] cursor-pointer hover:bg-white/20 rounded-full px-2 py-2 gap-1 disabled:opacity-50 disabled:bg-white/20 disabled:cursor-auto`,
                className)}
            onClick={onClick}>
            {children}
        </button>
    );
};