import type {BreadcrumbItem, IDashboardProject, IPaginationLink, IProject, IProjectMiniature} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
import {ReactNode, useEffect, useState} from "react";
import ProjectItem from "@/components/projects/project-item";
import PageFlowContainer from "@/components/page-flow-container";
import IconButton from "@/components/buttons/icon-button";
import {ArrowDownWideNarrow, ArrowUpWideNarrow, ListFilter} from "lucide-react";
import SearchBar from "@/components/filtering/search-bar";
import {index as projectsIndex, indexSearch as projectsSearch} from '@/actions/App/Http/Controllers/ProjectController';
import {useTranslation} from "react-i18next";
import {RouteQueryOptions} from "@/wayfinder";

/*const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: showProject().url,
    },
];*/

type PageProps = {
    Orders: string[],
    // TODO rename queryFilters and filters?
    queryFilters?: IFilter | null,
    tags: string[],
    title: string | null,
}

interface IFilter {
    filter: string,
    tags: string[],
}

interface ProjectsContainerProps {
    projects: IProjectMiniature[] | IDashboardProject[],
    currentPage: number,
}

interface IPaginatedProjects {
    data: IProjectMiniature[] | IDashboardProject[],
    links: IPaginationLink[],
}

function ProjectsContainer({currentPage, projects}: ProjectsContainerProps): ReactNode {
    const {t} = useTranslation(['projects-index', 'projects']);

    if (projects.length <= 0) return (
        <section className="flex flex-col gap-4">
            <h2 className="section-title px-3">{t('results')}</h2>
            <p>{t('projects:empty')}</p>
        </section>
    );

    return (
        <section className="flex flex-col gap-4">
            <h2 className="section-title px-3">{t('results')}</h2>

            <ul className="thumbnails-list-container">
                {/* TODO see if better to load everything then slice or load progressively server-side */}
                {projects.map((project: IProjectMiniature | IDashboardProject): ReactNode => (
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

    if (tags.length > 0) return (
        <ul className="flex flex-wrap gap-1">
            {tags.map((tag: string, i: number) => {
                return <li key={i}>{t('tag_' + tag)}</li>
            })}
        </ul>
    );
}

export default function ProjectIndex() {
    const {title, filters, tags, queryFilters} = usePage<PageProps>().props;
    const {t} = useTranslation(['projects-index', 'projects']);

    const [currentPage, setCurrentPage] = useState<number>(0);

    const [projects, setProjects] = useState<IPaginatedProjects>({data: [], links: []});

    const [filter, setFilter] = useState<string>('recent');
    const [direction, setDirection] = useState<string>('desc');
    const [currentTags, setCurrentTags] = useState<string[]>([]);

    if (queryFilters) {
        queryFilters.filter ? setFilter(queryFilters.filter) : '';
        queryFilters.tags.length > 0 ? setCurrentTags(queryFilters.tags) : '';
    }

    const [query, setQuery] = useState<string>('');

    useEffect(() => {
        const fetchProjects = async (): Promise<void> => {
            try {
                const options: RouteQueryOptions = {
                    query: {
                        user_request: 1,
                        query: query,
                        direction: direction,
                        filter: filter,
                        tags: currentTags.toString(),
                    }
                }

                const response = await fetch(projectsSearch(options).url);
                // console.log(await response.json());
                const data: IPaginatedProjects = await response.json();
                setProjects(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProjects().then();
    }, [query, direction]);

    const search = (e: any): any => {
        setQuery(e.target!.value);
    }
    const changeDirection = (): any => {
        setDirection(direction === 'desc' ? 'asc' : 'desc');
    }

    return (
        <AppLayout>
            <Head title={t('title')}/>
            <PageFlowContainer>

                <h1 className="page-title text-center mx-auto">{t(title ?? 'search_title')}</h1>

                <div className="flex flex-col gap-2 w-full px-3">
                    <div className="flex gap-1">
                        <IconButton icon={direction === 'desc' ? ArrowDownWideNarrow : ArrowUpWideNarrow}
                                    textContent={t('pagination:' + direction)}
                                    onClick={changeDirection}/>
                        <p className="section-title mx-1">{t('filter_' + filter)}</p>
                        <IconButton className="ml-auto" icon={ListFilter} textContent={t('filter')} onClick={() => {
                        }}/>
                    </div>
                    <TagsContainer tags={currentTags}/>
                    {/* Tags container (only if tags.) */}
                    {/* Search bar */}
                    <SearchBar onChange={search} data={query}/>
                </div>

                <ProjectsContainer currentPage={currentPage} projects={projects.data}/>

            </PageFlowContainer>
        </AppLayout>
    );
}
