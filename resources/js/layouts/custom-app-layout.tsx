import {ReactNode, useState} from "react";
import CustomSidebarCast from "@/layouts/custom-sidebar-cast";
import {useIsMobile} from "@/hooks/use-mobile";
import {cn} from "@/lib/utils";
import {IAppHeaderContext} from "@/types";
import {ChevronLeft, ChevronRight, LucideIcon} from "lucide-react";

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
    const [openDesktop, setOpenDesktop] = useState(true);

    let sidebar: HTMLElement | null = document.getElementById('sidebar');

    const switchModalState = () => {
        if (!sidebar) {
            sidebar = document.getElementById('sidebar')!;
        }
        if (isMobile) {
            setOpenMobile(!openMobile);
            if (!openMobile) {
                sidebar!.classList.add('open');
            } else {
                sidebar!.classList.remove('open');
            }
        } else {
            setOpenDesktop(!openDesktop);
            if (openDesktop) sidebar!.classList.add('closed');
            else sidebar!.classList.remove('closed');
        }
    }

    const onClickOutsideSidebar = () => {
        if (isMobile && openMobile) {
            switchModalState();
        }
    }

    const sidebarSwitchIcon: LucideIcon =
        (isMobile && openMobile) || openDesktop
            ? ChevronLeft
            : ChevronRight;

    return (
        <div className="app-container">
            <CustomSidebarCast isMobile={isMobile} appHeaderContext={appHeaderContext}
                               switchModalState={switchModalState} sidebarSwitchIcon={sidebarSwitchIcon}
                               onClickOutsideSidebar={onClickOutsideSidebar}/>
            {children}
        </div>
    );
}
