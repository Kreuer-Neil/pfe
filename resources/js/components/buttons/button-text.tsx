import {LucideArrowRight, LucideIcon} from "lucide-react";
import {Link} from "@inertiajs/react";
import React, {ReactNode} from "react";
import {cn} from "@/lib/utils";



interface ButtonTextProps {
    icon?: LucideIcon | null,
    textContent: string,
    href?: string,
    className?: string,
    type?: "default" | "destroy",
}

export default function ButtonText ({
                    icon: Icon = null,
                    textContent,
                    href = '#',
                    className = '',
                    type = 'default'
                }: ButtonTextProps): ReactNode {

    let style: string = '';
    switch (type) {
        case 'destroy':
            style = 'text-danger-md hover:text-danger-foreground hover:bg-danger';
            break;
        case 'default':
            style = '';
            break;
    }

    return (
        <Link href={href} as={'a'} className={cn('button-text', style, className)}>
            {Icon ? <Icon/> : ''}
            {textContent}
        </Link>
    );
}
