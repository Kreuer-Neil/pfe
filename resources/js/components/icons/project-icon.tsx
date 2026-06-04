import {IProjectContext} from "@/types";
import {cn} from "@/lib/utils";
import {useTranslation} from "react-i18next";
import {useImageAsset} from "@/hooks/use-image-asset";

type projectIconProps = {
    project: IProjectContext,
    size?: 'small' | 'medium' | 'large',
    className?: string,
}
// TODO add auto icon src
export default function ProjectIcon({project, size = 'small', className = ''}: projectIconProps) {
    const {t} = useTranslation('projects');

    let sizeStyle = 'size-8';
    switch (size) {
        case 'large':
            sizeStyle = 'size-[7rem]';
            break;
    }
    return <img src={useImageAsset(`projects/${project.icon}/${size}`)} alt={t('icon_alt', {project: project.name})}
                className={cn("rounded-full bg-loading", sizeStyle, className)}/>;
}
