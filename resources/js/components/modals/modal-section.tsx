import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface ModalSectionProps {
    title?: string,
    children: ReactNode | ReactNode[],
    className?: string,
}

function ModalSectionTitle({title}: { title: string | undefined }): ReactNode | null {
    if (title && title != '')
        return <p className="item-title">
            {title}
        </p>;
}

export default function ModalSection({title, children, className = ''}: ModalSectionProps): ReactNode {

    return (
        <div className={cn(className, "flex flex-col gap-2 pb-2 border-b border-black")}>
            <ModalSectionTitle title={title}/>

            {children}
        </div>
    )
}
