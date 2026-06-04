import {projects as projectsPage} from '@/routes';
import {IDashboardProject} from "@/types";
import {ReactNode} from "react";
import {ListFilter} from "lucide-react";
import Button from "@/components/buttons/button";
import IconButton from "@/components/buttons/icon-button";
import ProjectItem from "@/components/projects/project-item";
import {useTranslation} from "react-i18next";


function ProjectsList({projects}: { projects: IDashboardProject[] }): ReactNode {
    const {t} = useTranslation(['projects', 'dashboard']);
    if (projects.length <= 0) {
        return (
            <div className="thumbnails-list-container">
                <p>{t("no_projects_joined")}</p>
                <Button href={projectsPage().url} textContent={t("search_project")} color="cta"/>
            </div>
        );
    }

    let index = 0;
    return (
        <ol className="thumbnails-list-container">
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

export default function MyProjects({projects}: { projects: IDashboardProject[] | null }): ReactNode {
    const {t} = useTranslation(['dashboard', 'common']);
    if (!projects)
        return (
            <p>{t('common:projects_not_found')}</p>
        );
    return (
        <section className="items-section">
            <div className="flex flex-wrap items-center mx-3 mb-1">
                <h2 className="section-title w-fit mr-auto">
                    {t('common:my_projects')}
                </h2>
                <IconButton href={projectsPage().url} textContent={t("dashboard:project_filter")} icon={ListFilter}
                            showText={true} className="ml-auto"/>
            </div>
            <ProjectsList projects={projects}/>
            {/*<div className="flex flex-col gap-4 px-3 items-center">
                <ButtonText textContent={t('dashboard:more_projects')} icon={LucideSearch} href={projectsIndex().url}/>
            </div>*/}
        </section>
    );
}
