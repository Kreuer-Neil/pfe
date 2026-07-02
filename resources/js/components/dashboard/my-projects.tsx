import {index as projectsIndex} from '@/actions/App/Http/Controllers/ProjectController';
import {IDashboardProject} from "@/types";
import {ReactNode} from "react";
import {ListFilter} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Link} from "@inertiajs/react";
import ProjectItem from "@/components/projects/project-item";
import {useTranslation} from "react-i18next";


function ProjectsList({projects}: { projects: IDashboardProject[] }): ReactNode {
    const {t} = useTranslation(['projects', 'dashboard']);
    if (projects.length <= 0) {
        return (
            <div className="thumbnails-list-container">
                <p>{t("no_projects_joined")}</p>
                <Button asChild variant="secondary">
                    <Link href={projectsIndex().url}>{t("search_project")}</Link>
                </Button>
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
                        <li key={project.slug} className="w-full">
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
        <section className="items-section max-w-xl w-full">
            <div className="flex flex-wrap items-center mx-3 mb-1">
                <h2 className="section-title w-fit mr-auto">
                    {t('common:my_projects')}
                </h2>
                <Button asChild size="sm" variant="outline" className="ml-auto">
                    <Link href={projectsIndex().url}>
                        {t("dashboard:project_filter")}
                        <ListFilter/>
                    </Link>
                </Button>
            </div>
            <ProjectsList projects={projects}/>
            {/*<div className="flex flex-col gap-4 px-3 items-center">
                <ButtonText textContent={t('dashboard:more_projects')} icon={LucideSearch} href={projectsIndex().url}/>
            </div>*/}
        </section>
    );
}