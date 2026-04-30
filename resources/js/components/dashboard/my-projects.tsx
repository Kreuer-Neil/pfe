import {useLang} from "@/hooks/useLang";
import {IDashboardProject, IProjectMiniature} from "@/types";
import {ReactNode} from "react";
import {Link} from "@inertiajs/react";
import ProjectIcon from "@/components/icons/project-icon";
import {LucideSearch, UsersRound} from "lucide-react";
import ButtonText from "@/components/buttons/button-text";

function DashboardProjectPreview({project}: { project: IDashboardProject }) {
    const {__} = useLang()
    return (
        <article onClick={(e) => {
        }} className="thumbnail-item">
            <div className={'flex gap-1 items-center'}>
                <ProjectIcon project={project}/>
                <h3 className="item-title w-full">{project.name}</h3>
            </div>
            <p>{project.description}</p>
            <div className="flex flex-wrap gap-1 gap-y-0.5">
                {/*TODO buttons*/}
                <div className="flex gap-1 ml-auto">
                    {/*Related users*/}
                    <div className="task-icon bg-secondary">
                        {project.members_count}
                        <UsersRound/>
                    </div>
                </div>
            </div>
        </article>);
}

function ProjectsList({projects}: { projects: IDashboardProject[] }): ReactNode {
    const {__} = useLang()
    if (projects.length > 0) {
        let index = 0;
        return (
            <ol className="px-2 flex flex-col gap-3 items-center">
                {
                    projects.map((project: IDashboardProject): ReactNode => {
                        index++;
                        return (
                            <li key={project.id} className="w-full">
                                <DashboardProjectPreview project={project}/>
                            </li>
                        );
                    })
                }
            </ol>
        );
    }
    // Else
    return (
        <div className="empty-warning">
            <p>{__("project.no_projects_joined")}</p>
            {/*TODO fix route*/}
            <Link className="cta-button"
                  href={"projects/search"}>{__("project.search_project")}</Link>
        </div>
    );
}

export default function MyProjects({projects}: { projects: IDashboardProject[] | null }): ReactNode {
    const {__} = useLang()
    if (!projects)
        // TODO translate no project text
        return (
            <p>{__('main-nav.no_projects')}</p>
        );
    return (
        <section className="items-section">
            <div className="flex items-center mx-3">
                <h2 className="section-title w-full">
                    {__('main-nav.my_projects')}
                </h2>
            </div>
            <div className="px-2 flex flex-col gap-3 items-center">
                {/*Filters etc. for current project*/}
                <button>{__("dashboard.project.filter")}</button>
            </div>
            <ProjectsList projects={projects}/>
            <div className="flex flex-col gap-4 px-3 items-center">
                <ButtonText textContent={__('dashboard.project.more')} icon={LucideSearch}/>
            </div>
        </section>
    );
}
