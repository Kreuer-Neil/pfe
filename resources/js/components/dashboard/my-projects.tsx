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
import {useTranslation} from "react-i18next";
import {projects as projectsIndex} from '@/routes';


function ProjectsList({projects}: { projects: IDashboardProject[] }): ReactNode {
    const {t} = useTranslation(['projects','dashboard']);
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
            <p>{t("no_projects_joined")}</p>
            {/*TODO fix route*/}
            <Button href={projectsPage().url} textContent={t("search_project")} type="cta"></Button>
        </div>
    );
}

export default function MyProjects({projects}: { projects: IDashboardProject[] | null }): ReactNode {
    const {t} = useTranslation(['dashboard']);
    if (!projects)
        // TODO translate no project text
        return (
            <p>{t('common:no_projects')}</p>
        );
    return (
        <section className="items-section">
            <div className="flex items-center mx-3">
                <h2 className="section-title w-fit mr-auto">
                    {t('common:my_projects')}
                </h2>
                <IconButton href={projectsPage().url} textContent={t("dashboard:project_filter")} icon={ListFilter}
                            showText={true} className="ml-auto"/>
            </div>
            <ProjectsList projects={projects}/>
            <div className="flex flex-col gap-4 px-3 items-center">
                <ButtonText textContent={t('dashboard:more_projects')} icon={LucideSearch} href={projectsIndex().url}/>
            </div>
        </section>
    );
}
