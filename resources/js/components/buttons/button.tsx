import {Link} from "@inertiajs/react";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";
// @ts-ignore
import {UrlMethodPair} from "@inertiajs/core/types/types";


interface ButtonProps {
    textContent: string;
    icon?: LucideIcon | null;
    color?: 'default' | 'edit' | 'cta' | 'warning' | 'destructive';
    type?: 'button' | 'submit';
    href?: string | UrlMethodPair;
    onClick?: ((e: any) => void);
    className?: string;
}

export default function Button(
    {
        textContent,
        icon: Icon = null,
        color = 'default',
        type = 'button',
        href = '',
        className = '',
        // TODO remove later
        onClick = (e) => null,
    }: ButtonProps
): ReactNode {

    let style: string;
    switch (color) {
        case 'edit':
            style = 'bg-edit text-edit-foreground';
            break;
        case 'cta':
            style = 'bg-tertiary text-tertiary-foreground';
            break;
        case 'warning':
            style = 'bg-warning text-warning-foreground';
            break;
        case 'destructive':
            style = 'bg-danger text-danger-foreground';
            break;
        default:
            style = 'bg-primary text-primary-foreground';
            break;
    }

    if (href === '') {
        return (
            <button onClick={onClick} onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick(e);
            }} type={type}
                    className={cn('text-center p-2 px-4 text-lg font-semibold w-full max-w-md rounded-sm bg-secondary text-secondary-foreground cursor-pointer',
                        style, className)}>
                {Icon && <Icon/>}
                {textContent}
            </button>
        );
    }

    return (
        <Link href={href}
              className={cn('text-center p-2 px-4 text-lg font-semibold w-full max-w-md rounded-sm bg-secondary text-secondary-foreground',
                  style, className)}
              onClick={onClick}>
            {Icon && <Icon/>}
            {textContent}
        </Link>
    );
}
