import {ReactNode} from "react";
import {BellDot, Menu} from "lucide-react";
import {IAppHeaderContext} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import CustomSidebar from "@/layouts/custom-sidebar";

type CustomSidebarProps = {
    isMobile: boolean;
    appHeaderContext: IAppHeaderContext | null;
}

function MobileHeader({appHeaderContext}: { appHeaderContext: IAppHeaderContext | null }) {
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
                      onClick={() => {
                      }}/>
            </div>

        </div>
    );
}

export default function CustomSidebarCast(
    {
        isMobile,
        appHeaderContext,
    }: CustomSidebarProps): ReactNode {

    return (
        <header className="z-10">
            <MobileHeader appHeaderContext={appHeaderContext}/>
            <div className="sidebar-cast">
                <CustomSidebar/>
            </div>
        </header>
    );
}
