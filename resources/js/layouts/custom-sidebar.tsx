import {ReactNode} from "react";
import {BellDot, Menu} from "lucide-react";

type CustomSidebarProps = {
    isMobile: boolean;
    contextImageSrc?: string;
    contextImageAlt?: string;
    context?: string;
    contextSecondary?: string | null;
}

export default function CustomSidebar(
    {
        isMobile,
        context = 'Come Unite',
        contextSecondary = 'null',
        contextImageSrc = 'logo.svg',
        contextImageAlt = 'Come Unite app logo',
    }: CustomSidebarProps): ReactNode {


    return (
        <header>
            <div className="bg-sidebar min-h-16 p-2 flex items-center sm:hidden">
                <div className="flex gap-2 px-2 items-center">
                    <img src={contextImageSrc} alt={contextImageAlt}
                         className="rounded-sm bg-loading border border-secondary-border size-8"/>
                    <div className="flex flex-col">
                        <span className="section-title">{context}</span>
                        {contextSecondary ?
                            <span className="text-xs">{contextSecondary}</span> : null
                        }
                    </div>
                </div>

                <div className="flex ml-auto">
                    <BellDot className="p-2 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-sm" onClick={()=>{}}/>
                    <Menu className="p-2 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-sm" onClick={()=>{}}/>
                </div>

            </div>
            <nav className="max-sm:min-h-100vh">

                {/* mobile sidebar */}
                {/* PC sidebar */}
            </nav>
        </header>
    );
}
