import type {BreadcrumbItem, IProject} from "@/types";
import {dashboard} from "@/routes";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
import {useLang} from "@/hooks/useLang";
import {ReactNode, useEffect, useState} from "react";
import ProjectItem from "@/components/projects/project-item";
import PageFlowContainer from "@/components/page-flow-container";
import IconButton from "@/components/buttons/icon-button";
import {ArrowDownWideNarrow, ListFilter} from "lucide-react";
import SearchBar from "@/components/filtering/search-bar";
import {get} from "node:http";
import {projects as projectsIndex} from '@/routes';
// import { Inertia } from "@inertiajs/inertia-laravel";

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
                    return <li>{__('projects.tags.' + tag)}</li>
                })}
            </ul>
        );
}

export default function ProjectIndex() {
    const {__} = useLang();
    const {projects} = usePage<PageProps>().props;

    // TODO do it server-side
    const [currentPage, setCurrentPage] = useState(0);
    const [maxItems, setMaxItems] = useState(20);

    const [filter, setFilter] = useState('pertinence');
    const [direction, setDirection] = useState('desc');
    const [tags, setTags] = useState([]);

    const [searchData, setSearchData] = useState('');

    /*useEffect(() => {
        Inertia.get(route(route().current()), searchData, {
            preserveState: true,
            replace: true,
        });
    }, [searchData]);*/

    const search = (e: any): any => {
        setSearchData(e.target!.value);

        get(projectsIndex().url + '/search', (response) => {
            console.log(response)
        });
    }

    /* code picked-up from another project
    useEffect(() => {
        const fetchProjects = async (): Promise<void> => {
            try {
                const params = new URLSearchParams();
                if (filter) params.append("filter[filter]", filter);
                if (direction) params.append("direction", direction);
                if (tags) params.append("filter[tags]", tags);
                params.append("page", currentPage.toString());

                const response = await fetch(`/search?${params.toString()}`);
                const data: PaginatedAnimals = await response.json();
                setProjects(data);
            } catch (error) {
                console.error(`Erreur : ${error}`);
            }
        }

        fetchAnimals().then();
    }, [query, gender, status, breed, organization, specie, currentPage]);*/

    return (
        <AppLayout>
            <Head title={__('projects-index.title')}/>
            <PageFlowContainer>

                <h1 className="page-title text-center mx-auto">{__('projects-index.search_title')}</h1>

                <div className="flex flex-col gap-2 w-full px-3">
                    <div className="flex gap-1">
                        <IconButton icon={ArrowDownWideNarrow} textContent={__('pagination.' + direction)}/>
                        <p className="section-title mx-1">{__('projects-index.filters.' + filter)}</p>
                        <IconButton className="ml-auto" icon={ListFilter} textContent={__('pagination.')}/>
                    </div>
                    <TagsContainer tags={tags}/>
                    {/* Tags container (only if tags.) */}
                    {/* Search bar */}
                    <SearchBar onChange={search} data={searchData}/>
                </div>

                <ProjectsContainer currentPage={currentPage} maxItems={maxItems}/>


            </PageFlowContainer>
        </AppLayout>
    );
}
