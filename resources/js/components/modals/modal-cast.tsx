import {X} from "lucide-react";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface ModalCastProps {
    title?: string | ReactNode;
    closeModal: (() => void);
    children: ReactNode | ReactNode[];
    className?: string;
    element?: 'div' | 'form';
    action?: string;
    method?: string;
}

export default function ModalCast(
    {
        title = '',
        closeModal,
        children,
        className,
        element: HtmlElement = 'div',
        action = '',
        method = '',
    }: ModalCastProps): ReactNode {

    return (
        <aside className={cn('relative', className)}>
            <div className="flex pb-3">
                {title !== '' ?
                    <h2 className="section-title"> {title} </h2> : null
                }
                <div onClick={closeModal} onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') closeModal();
                }} tabIndex={0}
                     className="p-2 ml-auto cursor-pointer rounded-full">
                    <X/>
                </div>
            </div>
            {HtmlElement === 'form' ?
                <form action={action} method={method} className="flex flex-col gap-4">
                    {children}
                </form>
                : <HtmlElement className="flex flex-col gap-4">
                    {children}
                </HtmlElement>
            }
        </aside>
    );
}
