import {IProjectContext} from "@/types";

interface ProjectIconProps {
    project: IProjectContext;
    size?: 'small' | 'large'
}

export default function ProjectIcon({project, size = 'small'}: ProjectIconProps) {
    const alt = project.name + ' icon';
    switch (size) {
        case 'large':
            return <img alt={alt} className="size-32 rounded-full bg-loading"/>;
            break;
        case 'small':
            return <img alt={alt} className="size-8 rounded-full bg-loading"/>;
            break;
    }
}
