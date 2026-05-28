import {ReactNode, useEffect} from "react";
import {cn} from "@/lib/utils";

interface CustomReactModalProps {
    showModal: boolean;
    onClose: ()=>void;
    id: string;
    className?: string;
    children: ReactNode | ReactNode[];
}

export default function CustomModal({showModal, onClose, id, className = '', children}: CustomReactModalProps) {

    useEffect(() => {
        if (showModal) {
            // @ts-ignore
            const dialog: HTMLDialogElement | null = document.getElementById(id);
            if (dialog)
                dialog.showModal();
        } else {
            // @ts-ignore
            const dialog: HTMLDialogElement | null = document.getElementById(id);
            if (dialog)
                dialog.close()
        }
    }, [showModal]);

    return (
        <dialog closedby="any" id={id} onClose={onClose}
                className={cn("modal", className)}>
            {children}
        </dialog>
    );
}
