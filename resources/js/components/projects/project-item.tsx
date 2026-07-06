import ProjectIcon from "@/components/icons/project-icon";
import {CornerUpRight, MapPin, UserRoundCheck, UsersRound} from "lucide-react";
import {IDashboardProject, IProjectMiniature} from "@/types";
import {Link} from "@inertiajs/react";
import {show as projectsShow} from '@/actions/App/Http/Controllers/ProjectController';
import {Item, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle} from "@/components/ui/item";
import {useTranslation} from "react-i18next";


interface ProjectItemsProps {
    project: IDashboardProject | IProjectMiniature,
}

export default function ProjectItem({project}: ProjectItemsProps) {
    const {t} = useTranslation('projects');
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
                </ItemContent>
                <ItemFooter>
                    {
                        place &&
                        // TODO fix link not clickable because of link nav
                        <div
                            className="item-tag">
                            <MapPin/>
                            <p>{place}</p>
                        </div>
                    }
                            {(place && distance) &&
                                <span className="item-tag"><CornerUpRight/>{t('distance_km', {distance: distance.toFixed(1)})}</span>
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
