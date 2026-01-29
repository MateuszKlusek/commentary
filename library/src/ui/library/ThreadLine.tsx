import { cn } from "../../utils/style";

type Props = {
    type: "comment" | "reply",
};

export const ParentThreadLine = () => {
    return (
        <commentary-thread-line className="w-full h-full flex justify-end mt-1">
            <div className="w-1/2 h-full border-l border-thread-line" />
        </commentary-thread-line>
    );
};

export const CurvedThreadLine = ({ type }: Props) => {
    return (
        <commentary-thread-line
            className={cn(
                "flex gap-4 relative",
                type === "comment" ? "min-w-[34px]" : "min-w-[24px]"
            )}
        >
            <div className="w-full h-full flex justify-end">
                <div
                    className={`
                                w-1/2 
                                h-[40%]
                                border-b 
                                border-l 
                                rounded-bl-full 
                                border-thread-line
                                `}
                />
            </div>
        </commentary-thread-line>
    );
};

export const ReplyThreadLine = ({ type }: Props) => {
    return (
        <commentary-thread-line
            className={cn(
                "flex gap-4 relative ",
                type === "comment" ? "min-w-[34px]" : "min-w-[24px]"
            )}
        >
            <div className={cn(`absolute top-[-12px] bottom-0 w-[34px]`, type === "comment" ? "left-[17px]" : "left-[12px]")}>
                <div
                    className={`
                                w-1/2 
                                h-[24px]
                                border-b 
                                border-l 
                                rounded-bl-full 
                                border-thread-line
                `}
                />
            </div>
            <div className="w-full h-full flex justify-end">
                <div className="w-1/2 h-full border-l border-thread-line" />
            </div>
        </commentary-thread-line>
    );
};