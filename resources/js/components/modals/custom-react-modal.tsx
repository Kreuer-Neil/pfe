import ReactModal from "react-modal";
import {ReactNode} from "react";

interface CustomReactModalProps {
    isOpen: boolean,
    children: ReactNode | ReactNode[]
}

export default function CustomReactModal({isOpen, children}: CustomReactModalProps) {
    return (
        <ReactModal isOpen={isOpen} appElement={document.querySelector('body')!} className="px-2 py-3 mx-auto max-w-3xl h-full flex items-center"
                    style={{overlay: {backgroundColor: 'var(--color-modal-behind)',zIndex:'100'}}}>
            {children}
        </ReactModal>
    );
}
