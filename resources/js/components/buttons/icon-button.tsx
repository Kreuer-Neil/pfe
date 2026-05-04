import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";

type iconButtonProps = {
    icon: LucideIcon,
    textContent: string,
    showText?: boolean,
    title?: string,
    className?: string,
}

export default function IconButton(
    {
        icon: Icon,
        textContent,
        showText = false,
        title = '',
        className = '',
    }: iconButtonProps): ReactNode {
    // TODO show it's clickable !!!
    const baseStyle = 'bg-button p-1 px-2 rounded-xs cursor-pointer'

    if (showText) return <button title={title} className={cn(baseStyle, "flex items-center gap-1", className)}>{textContent}<Icon/></button>;
    return <button title={title} className={cn(baseStyle, className)}><span className="sr-only">{textContent}</span><Icon/></button>;

}
