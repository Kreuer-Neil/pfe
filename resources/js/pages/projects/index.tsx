import type {BreadcrumbItem, IProject} from "@/types";
import {dashboard} from "@/routes";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
import {useLang} from "@/hooks/useLang";
import {ReactNode, useState} from "react";
import ProjectItem from "@/components/projects/project-item";
import PageFlowContainer from "@/components/page-flow-container";
import IconButton from "@/components/buttons/icon-button";
import {ArrowDownWideNarrow, ListFilter} from "lucide-react";

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
        <section className="flex flex-col gap-4">
            <p className="section-title px-3">{__('projects-index.results')}</p>

            <ul className="px-2 flex flex-col gap-3">
                {/* TODO see if better to load everything then slice or load progressively server-side */}
                {projects.slice(currentPage * maxItems, (currentPage + 1) * maxItems).map((project: IProject): ReactNode => (
                    <li key={project.id}>
                        <ProjectItem project={project}/>
                    </li>))
                }
            </ul>
        </section>
    );
}

function TagsContainer({tags}: { tags: string[] }) {
    const {__} = useLang();

    if (tags.length > 0)
        return (
            <ul className="flex flex-wrap gap-1">
                {tags.map((tag) => {
                    return <li>{__('projects.tags.'+tag)}</li>
                })}
            </ul>
        );
}

export default function ProjectIndex() {
    const {__} = useLang();

    // TODO do it server-side
    const [currentPage, setCurrentPage] = useState(0);
    const [maxItems, setMaxItems] = useState(20);
    const [filter, setFilter] = useState('pertinence');
    const [direction, setDirection] = useState('desc');
    const [tags, setTags] = useState([]);

    return (
        <AppLayout>
            <Head title={__('projects-index.title')}/>
            <PageFlowContainer>

                <h1 className="page-title text-center mx-auto">{__('projects-index.search_title')}</h1>

                <div className="flex flex-col gap-2 w-full px-3">
                    <div className="flex gap-1">
                        <IconButton icon={ArrowDownWideNarrow} textContent={__('pagination.' + direction)}/>
                        <p className="section-title mx-1">{__('projects.filters.' + filter)}</p>
                        <IconButton className="ml-auto" icon={ListFilter} textContent={__('pagination.')}/>
                    </div>
                    <TagsContainer tags={tags}/>
                    {/* Tags container (only if tags. */}
                    {/* Search bar */}
                </div>

                <ProjectsContainer currentPage={currentPage} maxItems={maxItems}/>


            </PageFlowContainer>
        </AppLayout>
    );
}
