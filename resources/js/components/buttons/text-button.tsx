import {LucideArrowRight, LucideIcon} from "lucide-react";
import {Link} from "@inertiajs/react";
import React, {ReactNode} from "react";
import {cn} from "@/lib/utils";


interface TextButtonProps {
    icon?: LucideIcon | null,
    textContent: string,
    href?: string,
    className?: string,
    type?: "default" | "destroy",
}

export default ({
                    icon: Icon = null,
                    textContent,
                    href = '#',
                    className = '',
                    type = 'default'
                }: TextButtonProps): ReactNode => {

    let style: string;
    switch (type) {
        case 'default':
            style = 'text-secondary hover:bg-primary';
            break;
        case 'destroy':
            style = 'text-danger-md hover:text-danger-foreground hover:bg-danger';
            break;
    }

    return (
        <Link href={href} as={'a'} className={cn('button-text', style, className)}>
            {Icon ? <Icon/> : ''}
            {textContent}
        </Link>
    );
}
