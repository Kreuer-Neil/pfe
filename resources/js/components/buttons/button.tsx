import {Link} from "@inertiajs/react";
import {ElementType, ReactNode} from "react";
import {cn} from "@/lib/utils";
import {Button as ButtonElement} from "@headlessui/react";


interface ButtonProps {
    textContent: string,
    as?: ElementType,
    onClick?: () => void,
    className?: string,
    type?: 'default' | 'cta' | 'warning' | 'destructive',
}

export default function Button(
    {
        textContent,
        as = "button",
        type = 'default',
        className = '',
        onClick = (() => null),
    }: ButtonProps
): ReactNode {
    let style: string = '';
    switch (type) {
        case 'cta':
            style = 'bg-tertiary text-tertiary-foreground';
            break;
        case 'warning':
            style = 'bg-warning text-warning-foreground';
            break;
        case 'destructive':
            style = 'bg-danger text-danger-foreground';
            break;
    }

    return (
        <Link as={as} onClick={onClick}
              className={cn('text-center p-2 px-4 text-lg font-semibold w-full max-w-md rounded-sm bg-secondary text-secondary-foreground',
                  style, className)}>
            {textContent}
        </Link>
    );
}
