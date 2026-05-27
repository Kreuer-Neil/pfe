import {IProjectContext} from "@/types";
import {cn} from "@/lib/utils";
import {useTranslation} from "react-i18next";

type projectIconProps = {
    project: IProjectContext,
    size?: 'small' | 'medium' | 'large',
    className?: string,
}
// TODO add auto icon src
export default function ProjectIcon({project, size = 'small', className = ''}: projectIconProps) {
    const {t} = useTranslation('projects');
    const alt = t('icon_alt', {project: project.name});
    switch (size) {
        case 'large':
            return <img alt={alt} className={cn("size-[7rem] rounded-full bg-loading", className)}/>;
        case 'small':
            return <img alt={alt} className={cn("size-8 rounded-full bg-loading", className)}/>;
    }
}
