import {ReactNode, useState} from "react";
import CustomSidebarCast from "@/layouts/custom-sidebar-cast";
import {useIsMobile} from "@/hooks/use-mobile";
import {cn} from "@/lib/utils";
import {IAppHeaderContext} from "@/types";

type AppLayoutProps = {
    children: ReactNode | ReactNode[];
    appHeaderContext: IAppHeaderContext | null;
}

export default function CustomAppLayout(
    {
        children,
        appHeaderContext = null,
        ...props
    }: AppLayoutProps) {
    const isMobile = useIsMobile();

    const [openMobile, setOpenMobile] = useState(false);

    // TODO get user PC sidebar opened state
    const [showFullSidebar, setShowFullSidebar] = useState(false);

    let baseClass = 'flex';

    return (
        <div className="app-container">
            <CustomSidebarCast isMobile={isMobile} appHeaderContext={appHeaderContext}/>
            {children}
        </div>
    );
}
