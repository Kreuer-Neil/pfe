import ProjectIcon from "@/components/icons/project-icon";
import {CornerUpRight, MapPin, UserRoundCheck, UsersRound} from "lucide-react";
import {IDashboardProject, IProjectMiniature} from "@/types";
import {Link} from "@inertiajs/react";
import {show as projectsShow} from '@/actions/App/Http/Controllers/ProjectController';
import {Item, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle} from "@/components/ui/item";
import {useTranslation} from "react-i18next";
import {instanceOfProjectMiniature} from "@/helpers/type-check";


interface ProjectItemsProps {
    project: IDashboardProject | IProjectMiniature,
}

export default function ProjectItem({project}: ProjectItemsProps) {
    const {t} = useTranslation(['projects','tags']);
    const place: string | null = project.place;
    const distance: number | null = project.distance;
    return (
        <Item
            variant="outline"
            asChild
            size="sm"
        >
            <Link href={projectsShow(project.slug)}>
                <ItemMedia variant="icon">
                    <ProjectIcon project={project}/>
                </ItemMedia>
                <ItemContent>

                    <ItemTitle className="items-center">
                        {project.name}
                    </ItemTitle>
                    <ItemDescription>
                        {project.description}
                    </ItemDescription>
                    {(instanceOfProjectMiniature(project) && project.tags.length > 0) &&
                        <div className="flex gap-1 flex-wrap items-center">
                            <span>{t('related_tags')}</span>
                            {project.tags.map((tag) => {
                                return <span className="item-tag" key={tag}>{t('tags:' + tag)}</span>
                            })}
                        </div>
                    }
                </ItemContent>
                <ItemFooter>
                    {place &&
                        <div
                            className="item-tag">
                            <MapPin/>
                            <p>{place}</p>
                        </div>
                    }
                    {(place && distance) &&
                        <span
                            className="item-tag"><CornerUpRight/>{t('distance_km', {distance: distance.toFixed(1)})}</span>
                    }
                    {/* TODO what's new since last passage on project */}
                    <div className="flex gap-1 ml-auto">
                        {/*Related users*/}
                        <div className="item-tag">
                            {project.members_count}
                            <UsersRound/>
                        </div>
                        {project.is_member ? <UserRoundCheck className="item-tag size-5"/> : ''}
                        {/*Other infos*/}
                    </div>
                </ItemFooter>
            </Link>
        </Item>
    );
}
