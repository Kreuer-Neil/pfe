import {ReactNode, useEffect, useRef} from "react";
import {cn} from "@/lib/utils";
import {XIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

interface CustomReactModalProps {
    showModal: boolean;
    onClose: () => void;
    id?: string;
    className?: string;
    children: ReactNode | ReactNode[];
}

function ModalContent({className, children, ...props}: React.ComponentProps<"div">) {
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

function ModalHeader({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    );
}

function ModalFooter({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-col gap-2 sm:flex-row items-center justify-center", className)}
            {...props}
        />
    );
}

function ModalTitle({className, ...props}: React.ComponentProps<"h2">) {
    return (
        <h2
            className={cn("text-lg leading-none font-semibold", className)}
            {...props}
        />
    );
}

function ModalDescription({className, ...props}: React.ComponentProps<"p">) {
    return (
        <p
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

export default function CustomModal({showModal, onClose, id, className = '', children}: CustomReactModalProps) {

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (showModal) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showModal]);

    return (
        <dialog ref={dialogRef}
                closedby="any"
                id={id}
                onClose={onClose}
                className={cn("modal", className)}>
            <Button size="icon-sm"
                    variant="ghost"
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-foreground"
            >
                <XIcon/>
                <span className="sr-only">Close</span>
            </Button>
            {children}
        </dialog>
    );
}

export {ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription}
