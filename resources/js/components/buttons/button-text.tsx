import {LucideArrowRight, LucideIcon} from "lucide-react";
import {Link} from "@inertiajs/react";
import React, {ReactNode} from "react";
import {cn} from "@/lib/utils";


interface ButtonTextProps {
    icon?: LucideIcon | null;
    textContent: string;
    href?: string;
    title?: string | null;
    type?: 'button' | 'submit';
    color?: "default" | "destructive";
    autoFocus?: boolean;
    onClick?: ((e: any) => void);
    className?: string;
}

// Shouldn't we name it "Text link" ? Or another name
/**
 * Displays a button with a clickable text appearance.
 */
export default function ButtonText(
    {
        icon: Icon = null,
        textContent,
        href = '',
        type = 'button',
        color = 'default',
        autoFocus = false,
        onClick = () => null,
        className = '',
    }: ButtonTextProps): ReactNode {

    let style: string = '';
    switch (color) {
        case 'destructive':
            style = 'text-danger-md hover:text-danger-foreground hover:bg-danger focus:text-danger-foreground focus:bg-danger';
            break;
        case 'default':
            style = '';
            break;
    }

    if (href === '') {
        return (
            <button onClick={onClick} type={type} className={cn('button-text', style, className)} autoFocus={autoFocus}>
                {Icon ? <Icon/> : ''}
                {textContent}
            </button>
        );

    }
    return (
        <Link href={href} as={'a'} className={cn('button-text', style, className)} autoFocus={autoFocus}>
            {Icon ? <Icon/> : ''}
            {textContent}
        </Link>
    );
}
