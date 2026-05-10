import type {BreadcrumbItem, IDashboardProject, IPaginationLink, IProject, IProjectMiniature} from "@/types";
import {dashboard} from "@/routes";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
import {ReactNode, useEffect, useState} from "react";
import ProjectItem from "@/components/projects/project-item";
import PageFlowContainer from "@/components/page-flow-container";
import IconButton from "@/components/buttons/icon-button";
import {ArrowDownWideNarrow, ListFilter} from "lucide-react";
import SearchBar from "@/components/filtering/search-bar";
import {get} from "node:http";
import {projects as projectsIndex} from '@/routes';
import {useTranslation} from "react-i18next";
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

interface IPaginatedProjects {
    data: IProjectMiniature[] | IDashboardProject[],
    links: IPaginationLink[],
}

function ProjectsContainer({currentPage, maxItems}: ProjectsContainerProps): ReactNode {
    const {projects} = usePage<PageProps>().props;
    const {t} = useTranslation(['projects-index', 'projects']);

    if (projects.length <= 0) {
        return <p>{t('projects:empty')}</p>
    }

    return (
        <section className="flex flex-col gap-4">
            <p className="section-title px-3">{t('results')}</p>

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
    const {t} = useTranslation('projects');

    if (tags.length > 0)
        return (
            <ul className="flex flex-wrap gap-1">
                {tags.map((tag) => {
                    return <li>{t('tag_' + tag)}</li>
                })}
            </ul>
        );
}

export default function ProjectIndex() {
    const {t} = useTranslation(['projects-index', 'projects']);
    // const {projects} = usePage<PageProps>().props;

    // TODO do it server-side
    const [currentPage, setCurrentPage] = useState(0);
    const [maxItems, setMaxItems] = useState(20);

    const [projects, setProjects] = useState<IPaginatedProjects>({ data: [], links: []});

    const [filter, setFilter] = useState('pertinence');
    const [direction, setDirection] = useState('desc');
    const [tags, setTags] = useState([]);

    const [query, setQuery] = useState('');

    /*useEffect(() => {
        Inertia.get(route(route().current()), searchData, {
            preserveState: true,
            replace: true,
        });
    }, [searchData]);*/

    /*useEffect(() => {
        const fetchProjects = async (): Promise<void> => {
            try {
                const params = new URLSearchParams();
                if (query) params.append("query", query);
                if (filter) params.append("filter", filter);
                if (tags.length>0) params.append("tags", tags.toString());
                if (direction) params.append("direction", direction);
                // if (tags) params.append("filter[tags]", tags);
                params.append("page", currentPage.toString());

                const response = await fetch(projectsIndex().url + `/search?${params.toString()}`);
                const data: IPaginatedProjects = await response.json();
                setProjects(data);
            } catch (error) {
                console.error(`Erreur : ${error}`);
            }
        }
        fetchProjects().then();
    }, ['query','filter','direction']);*/

    const search = (e: any): any => {
        setQuery(e.target!.value);


        // get(projectsIndex().url + '/search', (response) => {
        //     console.log(response);
        // });
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
            <Head title={t('title')}/>
            <PageFlowContainer>

                <h1 className="page-title text-center mx-auto">{t('search_title')}</h1>

                <div className="flex flex-col gap-2 w-full px-3">
                    <div className="flex gap-1">
                        <IconButton icon={ArrowDownWideNarrow} textContent={t('pagination:' + direction)}/>
                        <p className="section-title mx-1">{t('filter_' + filter)}</p>
                        <IconButton className="ml-auto" icon={ListFilter} textContent={t('filter')}/>
                    </div>
                    <TagsContainer tags={tags}/>
                    {/* Tags container (only if tags.) */}
                    {/* Search bar */}
                    <SearchBar onChange={search} data={query}/>
                </div>

                <ProjectsContainer currentPage={currentPage} maxItems={maxItems}/>


            </PageFlowContainer>
        </AppLayout>
    );
}
