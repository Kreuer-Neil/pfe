import type {BreadcrumbItem, IProject} from "@/types";
import {dashboard} from "@/routes";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
import {useLang} from "@/hooks/useLang";
import {ReactNode, useState} from "react";
import ProjectItem from "@/components/projects/project-item";

/*const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: showProject().url,
    },
];*/

type PageProps = {
    projects: IProject[],
}

interface ProjectsContainerProps {
    currentPage: number,
    maxItems: number,
}

function ProjectsContainer({currentPage, maxItems}: ProjectsContainerProps): ReactNode {
    const {projects} = usePage<PageProps>().props;
    const {__} = useLang();

    if (projects.length <= 0) {
        return <p>{__('projects.empty')}</p>
    }

    return (
        <ul>
            {/* TODO see if better to load everything then slice or load progressively server-side */}
            {projects.slice(currentPage * maxItems, (currentPage + 1) * maxItems).map((project: IProject): ReactNode => (
                <li key={project.id}>
                    <ProjectItem project={project} />
                </li>))
            }
        </ul>
    );
}

export default function ProjectIndex() {
    const {__} = useLang();

    // TODO do it server-side
    const [currentPage, setCurrentPage] = useState(0);
    const [maxItems, setMaxItems] = useState(20);
    return (
        <AppLayout>
            <Head title={__('projects-index.title')}/>
            <h1 className="page-title text-center mx-auto">{__('projects-index.search_title')}</h1>

            <div>
                <ProjectsContainer currentPage={currentPage} maxItems={maxItems}/>
            </div>


        </AppLayout>
    );
}
