import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";

interface ModalSectionProps {
    title?: string;
    children: ReactNode | ReactNode[];
    className?: string;
    icon?: LucideIcon;
}

function ModalSectionTitle({title, icon: Icon}: { title: string | undefined, icon?: LucideIcon }): ReactNode | null {
    if (title && title != '')
        return <p className="item-title flex gap-1">
            {Icon ?
                <Icon/> : null
            }
            {title}
        </p>;
}

export default function ModalSection({title, children, className = '', icon}: ModalSectionProps): ReactNode {

    return (
        <div className={cn(className, "flex flex-col gap-2 pb-2 border-b border-black")}>
            <ModalSectionTitle title={title} icon={icon}/>

            {children}
        </div>
    )
}
