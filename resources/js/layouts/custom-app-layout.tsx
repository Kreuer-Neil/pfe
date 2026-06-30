import {ReactNode, useEffect, useState} from "react";
import CustomSidebarCast from "@/layouts/custom-sidebar-cast";
import {useIsMobile} from "@/hooks/use-mobile";
import {IAppHeaderContext, type SharedData} from "@/types";
import {ChevronLeft, ChevronRight, LucideIcon} from "lucide-react";
import {usePage} from "@inertiajs/react";

type AppLayoutProps = {
    children: ReactNode | ReactNode[];
    appHeaderContext: IAppHeaderContext | null;
}

export default function CustomAppLayout(
    {
        children,
        appHeaderContext,
        ...props
    }: AppLayoutProps) {
    const isMobile = useIsMobile();
    const {sidebarOpen} = usePage<SharedData>().props;
    console.log(sidebarOpen);

    const [openMobile, setOpenMobile] = useState(false);
    const [openDesktop, setOpenDesktop] = useState<boolean>(sidebarOpen);

// TODO Use useRef for sidebar
    let sidebar: HTMLElement | null = document.getElementById('sidebar');
    useEffect(() => {
        sidebar = document.getElementById('sidebar');
        if (!openDesktop) {
            sidebar!.classList.add('closed');
        }

    }, []);

    const switchModalState = (e?: Event) => {
        if (e) {
            e.preventDefault();
        }
        if (!sidebar) {
            // useRef
            sidebar = document.getElementById('sidebar')!;
        }
        if (isMobile) {
            setOpenMobile(!openMobile);
            if (!openMobile) {
                sidebar!.classList.add('open');
                document.getElementById('sidebar-switch')!.focus();
            } else {
                sidebar!.classList.remove('open');
                document.getElementById('burger-menu')!.focus();
            }
        } else {
            document.cookie = `sidebar=${!openDesktop}; path=/; max-age=${60 * 60 * 24 * 7}`;
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
