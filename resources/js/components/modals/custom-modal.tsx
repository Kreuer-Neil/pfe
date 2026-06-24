import {ReactNode, useEffect} from "react";
import {cn} from "@/lib/utils";

interface CustomReactModalProps {
    showModal: boolean;
    onClose: ()=>void;
    id?: string;
    className?: string;
    children: ReactNode | ReactNode[];
}

function ModalContent({ className, children, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "grid gap-4",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    );
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
            {...props}
        />
    );
}

function ModalTitle({ className, ...props }: React.ComponentProps<"h2">) {
    return (
        <h2
            className={cn("text-lg leading-none font-semibold", className)}
            {...props}
        />
    );
}

function ModalDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
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

export { ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription }
