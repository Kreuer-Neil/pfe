import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";
import {Link} from "@inertiajs/react";

interface IconButtonProps {
    icon: LucideIcon,
    textContent: string,
    showText?: boolean,
    title?: string,
    className?: string,
    onClick?: ((e: any) => void),
    href?: string,
}

export default function IconButton(
    {
        icon: Icon,
        textContent,
        showText = false,
        title = '',
        onClick = () => null,
        href = '',
        className = '',
    }: IconButtonProps): ReactNode {
    // TODO show it's clickable !!!
    const baseStyle = 'bg-button p-1 px-2 rounded-xs cursor-pointer flex gap-1'
    const textSpanStyle = showText ? '' : 'sr-only';

    if (href === '')
        return <button title={title} className={cn(baseStyle, className)} onClick={onClick}><span
            className={textSpanStyle}>{textContent}</span><Icon/></button>;

    return <Link title={title} href={href} className={cn(baseStyle, className)}><span
        className={textSpanStyle}>{textContent}</span><Icon/></Link>;


}
