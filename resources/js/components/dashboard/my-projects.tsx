import {useLang} from "@/hooks/useLang";
import {projects as projectsPage} from '@/routes';
import {IDashboardProject} from "@/types";
import {ReactNode} from "react";
import ProjectIcon from "@/components/icons/project-icon";
import {ListFilter, LucideSearch, UsersRound} from "lucide-react";
import ButtonText from "@/components/buttons/button-text";
import Button from "@/components/buttons/button";
import IconButton from "@/components/buttons/icon-button";
import ProjectItem from "@/components/projects/project-item";

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
                                <ProjectItem project={project}/>
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
            <p>{__("projects.no_projects_joined")}</p>
            {/*TODO fix route*/}
            <Button href={projectsPage().url} textContent={__("projects.search_project")} type="cta"></Button>
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
                <IconButton href={projectsPage().url} textContent={__("dashboard.project.filter")} icon={ListFilter}
                            showText={true} className="ml-auto"/>
            </div>
            <ProjectsList projects={projects}/>
            <div className="flex flex-col gap-4 px-3 items-center">
                <ButtonText textContent={__('dashboard.project.more')} icon={LucideSearch}/>
            </div>
        </section>
    );
}
