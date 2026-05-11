import ProjectIcon from "@/components/icons/project-icon";
import {MapPin, UserRoundCheck, UsersRound} from "lucide-react";
import {IDashboardProject, IProjectMiniature} from "@/types";
import {Link} from "@inertiajs/react";
import {projects as projectsIndex} from '@/routes';


interface ProjectItemsProps {
    project: IDashboardProject | IProjectMiniature,
}

export default function ProjectItem({project}: ProjectItemsProps) {
    const place: string | null = project.place;
    const coordinates: string | null = project.coordinates;
    return (
        <Link as={'article'} tabIndex={0} href={projectsIndex().url + '/' + project.id} className="thumbnail-item">
            <div className={'flex gap-1 items-center'}>
                <ProjectIcon project={project}/>
                <h3 className="item-title w-full">{project.name}</h3>
            </div>
            <p>{project.description}</p>
            {
                place && coordinates ?
                    // Google maps link
                    // TODO fix link not clickable because of link nav
                    <a href={'https://www.google.com/maps/@' + coordinates.replace(' ', '') +',14z?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D'}
                       className="flex gap-1">
                        <MapPin/>
                        <p>{place}</p>
                    </a> : ''
            }
            <div className="flex flex-wrap gap-1 gap-y-0.5">
                {/* TODO what's new since last passage on project */}
                <div className="flex gap-1 ml-auto">
                    {/*Related users*/}
                    <div className="item-tag">
                        {project.members_count}
                        <UsersRound/>
                    </div>
                    {project.is_member ? <UserRoundCheck className="item-tag bg-tag-valid"/> : ''}
                    {/*Other infos*/}
                </div>
            </div>
        </Link>
    );
}
