import {ReactNode, useState} from "react";
import CustomSidebar from "@/layouts/custom-sidebar";
import {useIsMobile} from "@/hooks/use-mobile";
import {cn} from "@/lib/utils";

type AppLayoutProps = {
    children: ReactNode | ReactNode[];
}

export default function CustomAppLayout({children, ...props}: AppLayoutProps) {
    const isMobile = useIsMobile();

    const [openMobile, setOpenMobile] = useState(false);

    // TODO get user PC sidebar opened state
    const [showFullSidebar, setShowFullSidebar] = useState(false);

    let baseClass = 'flex';

    return (
        <div className="app-container">
            <CustomSidebar isMobile={isMobile}/>
            {children}
        </div>
    );
}
