import {X} from "lucide-react";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface ModalCastProps {
    title?: string,
    closeModal: (() => void),
    children: ReactNode | ReactNode[],
    className?: string,
    element?: 'div' | 'form',
}

export default function ModalCast(
    {
        title = '',
        closeModal,
        children,
        className,
        element: HtmlElement = 'div'
    }: ModalCastProps): ReactNode {

    return (
        // <ReactModal isOpen={isOpen} appElement={document.querySelector('body')!} className="mx-2 my-3 max-w-3xl"
        //             style={{overlay: {backgroundColor: 'var(--bg-modal-bg)'},}}>
        <aside className={cn(className, "p-2 py-3 bg-background rounded-lg self-center mx-auto")}>
            <div className="flex pb-3">
                {title !== '' ?
                    <h2 className="section-title"> {title} </h2> : ''
                }
                <div
                    onClick={closeModal}
                    className="p-2 ml-auto cursor-pointer">
                    <X/>
                </div>
            </div>
            <HtmlElement className="flex flex-col gap-4">
                {children}
            </HtmlElement>
        </aside>
        // </ReactModal>
    );
}
