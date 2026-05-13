import { X} from "lucide-react";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface ModalCastProps {
    title: string;
    // isOpen: boolean;
    closeModal: (() => void);
    children: ReactNode | ReactNode[];
    className?: string;
}

export default function ModalCast({
                                      title = '',
                                      // isOpen = false,
                                      closeModal,
                                      children,
                                      className
                                  }: ModalCastProps): ReactNode {

    return (
        // <ReactModal isOpen={isOpen} appElement={document.querySelector('body')!} className="mx-2 my-3 max-w-3xl"
        //             style={{overlay: {backgroundColor: 'var(--bg-modal-bg)'},}}>
            <aside className={cn(className, "p-2 py-3 bg-background rounded-xl")}>
                <div className="flex pb-3">
                    <h2 className="section-title"> {title} </h2>
                    <div
                        onClick={closeModal}
                        className="p-2 cursor-pointer">
                        <X/>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {children}
                </div>
            </aside>
        // </ReactModal>
    );
}
