import {Dispatch, ReactNode, SetStateAction, useEffect} from "react";
import {cn} from "@/lib/utils";

interface CustomReactModalProps {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    id: string;
    className?: string;
    children: ReactNode | ReactNode[];
}

export default function CustomModal({showModal, setShowModal, id, className = '', children}: CustomReactModalProps) {

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
        <dialog closedby="any" id={id} onClose={() => setShowModal(false)}
                className={cn("modal", className)}>
            {children}
        </dialog>
    );
}
