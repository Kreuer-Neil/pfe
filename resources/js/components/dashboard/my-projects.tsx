import {index as projectsIndex} from '@/actions/App/Http/Controllers/ProjectController';
import {IDashboardProject} from "@/types";
import {ReactNode} from "react";
import {ListFilter} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Link} from "@inertiajs/react";
import ProjectsSection from "@/components/dashboard/projects-section";
import {useTranslation} from "react-i18next";


export default function MyProjects({projects}: { projects: IDashboardProject[] | null }): ReactNode {
    const {t} = useTranslation(['projects', 'dashboard', 'common']);
    if (!projects)
        return (
            <p>{t('common:projects_not_found')}</p>
        );
    return (
        <ProjectsSection
            title={t('common:my_projects')}
            projects={projects}
            action={
                <Button asChild size="sm" variant="outline" className="ml-auto">
                    <Link href={projectsIndex().url}>
                        {t("dashboard:project_filter")}
                        <ListFilter/>
                    </Link>
                </Button>
            }
            emptyState={
                <>
                    <p>{t("no_projects_joined")}</p>
                    <Button asChild variant="secondary">
                        <Link href={projectsIndex().url}>{t("search_project")}</Link>
                    </Button>
                </>
            }
        />
    );
}