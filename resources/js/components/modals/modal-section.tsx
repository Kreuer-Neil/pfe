import {DetailedHTMLProps, HTMLAttributes, ReactNode} from "react";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";

interface ModalSectionProps {
    title?: string;
    children: ReactNode | ReactNode[];
    className?: string;
    icon?: LucideIcon;
    as?: 'div' | 'fieldset';
}

function ModalSectionTitle({title, icon: Icon, sectionTitleElement: HtmlElement}: {
    title: string | undefined,
    icon?: LucideIcon,
    sectionTitleElement: any
}): ReactNode | null {
    if (title && title != '')
        return <HtmlElement className="item-title flex gap-1">
            {Icon ?
                <Icon/> : null
            }
            {title}
        </HtmlElement>;
}

export default function ModalSection({title, children, className = '', icon, as: HtmlElement = 'div'}: ModalSectionProps): ReactNode {

    let sectionTitleType:string = 'p';
    if (HtmlElement === 'fieldset') sectionTitleType = 'legend';

    return (
        <HtmlElement className={cn(className, "flex flex-col gap-2 pb-2 border-b border-black")}>
            <ModalSectionTitle title={title} icon={icon} sectionTitleElement={sectionTitleType}/>

            {children}
        </HtmlElement>
    );
}
