import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface PageFlowContainerProps {
    children: ReactNode | ReactNode[],
    className?: string,
}

export default function PageFlowContainer({children, className = ''}: PageFlowContainerProps): ReactNode {
    return (
        <div className={cn('@container main-page', className)}>
            {children}
        </div>
    );
}
