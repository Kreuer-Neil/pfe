import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";
import {Link} from "@inertiajs/react";

interface IconButtonProps {
    icon: LucideIcon,
    textContent: string,
    showText?: boolean,
    title?: string,
    alt?: boolean,
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
        onClick = (e) => e.preventDefault(),
        alt,
        href = '',
        className = '',
    }: IconButtonProps): ReactNode {
    // TODO show it's clickable !!!
    const baseStyle = alt ? 'icon-btn-alt' : 'icon-btn';

    const textSpanStyle = showText ? '' : 'sr-only';

    const iconStyle = showText ? 'w-4' : 'w-5';

    if (href === '') {
        return <button title={title} className={cn(baseStyle, className)} onClick={onClick} onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onClick(e);
        }}><span
            className={textSpanStyle}>{textContent}</span><Icon className={iconStyle}/></button>;
    }

    return <Link title={title} href={href} className={cn(baseStyle, className)}><span
        className={textSpanStyle}>{textContent}</span><Icon className={iconStyle}/></Link>;


}
