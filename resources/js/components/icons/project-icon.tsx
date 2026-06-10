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
    let srcset:string|undefined;
    switch (size) {
        case 'small':
            srcset = useImageAsset(`projects/${project.icon}/small`) + ' 1x, '+
                useImageAsset(`projects/${project.icon}/medium`) + ' 2x, ' +
                useImageAsset(`projects/${project.icon}/large`) + ' 3x, ';
            break;
        case 'medium':
            srcset = useImageAsset(`projects/${project.icon}/medium`) + ' 1x, ' +
                useImageAsset(`projects/${project.icon}/large`) + ' 2x, ';
            break;
        case 'large':
            sizeStyle = 'size-[7rem]';
            break;
    }



    return <img src={useImageAsset(`projects/${project.icon}/${size}`)} alt={t('icon_alt', {project: project.name})}
                className={cn("rounded-full bg-loading", sizeStyle, className)}
    srcSet={srcset}/>;
}
