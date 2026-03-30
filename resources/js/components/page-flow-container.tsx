import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface PageFlowContainerProps {
    children: ReactNode[],
    className?: string,
}

export default function PageFlowContainer({children, className = ''}: PageFlowContainerProps): ReactNode {
    return (
        <div className={cn('@container p-3 py-6 flex flex-col gap-12 items-center', className)}>
            {children}
        </div>
    );
}
