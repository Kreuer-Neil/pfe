import {ReactNode} from "react";
import {BellDot, LucideIcon, Menu} from "lucide-react";
import {IAppHeaderContext} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import CustomSidebar from "@/layouts/custom-sidebar";

type CustomSidebarProps = {
    isMobile: boolean,
    appHeaderContext: IAppHeaderContext | null,
    switchModalState: () => void,
    sidebarSwitchIcon: LucideIcon,
    onClickOutsideSidebar: () => void
}

function MobileHeader({appHeaderContext, switchModalState}: {
    appHeaderContext: IAppHeaderContext | null,
    switchModalState: () => void
}) {
    const defaultTitle = 'Come Unite';

    return (
        <div className="bg-sidebar min-h-16 p-2 flex items-center sm:hidden">
            <div className="flex gap-2 px-2 items-center">
                <img src={appHeaderContext?.contextImageSrc ?? useImageAsset('app/logo')}
                     alt={appHeaderContext?.contextImageAlt ?? 'Come Unite app logo'}
                     className="rounded-sm bg-loading border border-secondary-border size-8"/>
                <div className="flex flex-col">
                    <span className="section-title">{appHeaderContext?.context ?? defaultTitle}</span>
                    {appHeaderContext?.contextSecondary ?
                        <span className="text-xs">{appHeaderContext.contextSecondary}</span> : null
                    }
                </div>
            </div>

            <div className="flex ml-auto">
                <BellDot className="p-2 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-sm"
                         onClick={() => {
                         }}/>
                <Menu className="p-2 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-sm"
                      onClick={switchModalState}/>
            </div>

        </div>
    );
}

export default function CustomSidebarCast(
    {
        isMobile,
        appHeaderContext,
        switchModalState,
        sidebarSwitchIcon,
        onClickOutsideSidebar
    }: CustomSidebarProps): ReactNode {

    return (
        <div className="z-10 max-h-screen sticky top-0">
            <MobileHeader appHeaderContext={appHeaderContext} switchModalState={switchModalState}/>
            <div className="sidebar-cast" onClick={onClickOutsideSidebar}>
                <CustomSidebar switchModalState={switchModalState} sidebarSwitchIcon={sidebarSwitchIcon}/>
            </div>
        </div>
    );
}
