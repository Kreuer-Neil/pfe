import type {IDashboardProject, IPaginationLink, IProjectMiniature} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Form, Head, router, usePage} from "@inertiajs/react";
import {ReactNode, useEffect, useState} from "react";
import ProjectItem from "@/components/projects/project-item";
import PageFlowContainer from "@/components/page-flow-container";
import IconButton from "@/components/buttons/icon-button";
import {ArrowDownWideNarrow, ArrowUpWideNarrow} from "lucide-react";
import SearchBar from "@/components/filtering/search-bar";
import {useTranslation} from "react-i18next";
import {Input} from "@/components/ui/input";
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {index as projectsIndex} from "@/actions/App/Http/Controllers/ProjectController";
import redirectController from "@/actions/Illuminate/Routing/RedirectController";
import {RouteQueryOptions} from "@/wayfinder";

/*const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: showProject().url,
    },
];*/

type PageProps = {
    filtersList: string[],
    queryFilters: IFilter;
    tagsList: string[];
    currentFilter: string;
    currentTags: string[];
    title: string | null;
    projects: IProjectMiniature[];
}

interface IFilter {
    name: string;
    direction: 'asc' | 'desc';
    tags?: string[];
}

interface ProjectsContainerProps {
    projects: IProjectMiniature[] | IDashboardProject[];
    // currentPage: number,
}

interface IPaginatedProjects {
    data: IProjectMiniature[] | IDashboardProject[];
    links: IPaginationLink[];
}

function ProjectsContainer({projects}: ProjectsContainerProps): ReactNode {
    const {t} = useTranslation(['projects-index', 'projects']);


    return (
        <section className="flex flex-col gap-4 max-w-xl w-full">
            <h2 className="section-title px-3">{t('results')}</h2>

            {projects.length <= 0 ?
                <p>{t('projects:empty')}</p> :
                <ul className="thumbnails-list-container">
                    {/* TODO see if better to load everything then slice or load progressively server-side */}
                    {projects.map((project: IProjectMiniature | IDashboardProject): ReactNode => (
                        <li key={project.id} className="w-full">
                            <ProjectItem project={project}/>
                        </li>))
                    }
                </ul>
            }
        </section>
    );
}

function TagsContainer({tags}: { tags: string[] }) {
    const {t} = useTranslation('project_tags');

    if (tags.length > 0) return (
        <ul className="flex flex-wrap gap-1">
            {tags.map((tag: string, i: number) => {
                return <li key={i}>
                    {t(tag)}
                </li>
            })}
        </ul>
    );
}

export default function ProjectsIndex() {
    const {title, filtersList, tags, queryFilters, projects} = usePage<PageProps>().props;

    const {t} = useTranslation(['projects-index', 'projects']);

    // const [projects, setProjects] = useState<IPaginatedProjects>({data: [], links: []});

    const [direction, setDirection] = useState<string>('desc');
    const [currentTags, setCurrentTags] = useState<string[]>([]);
    const [query, setQuery] = useState<string>('');

    // if (queryFilters) {
    //     queryFilters.filter ? setFilter(queryFilters.filter) : '';
    //     queryFilters.tags.length > 0 ? setCurrentTags(queryFilters.tags) : '';
    // }

    const changeDirection = (): any => {
        setDirection(direction === 'desc' ? 'asc' : 'desc');
    }

    useEffect(()=> {
        const queryOptions: RouteQueryOptions = {
            query: {
                query: query,
                direction: direction,
                currentTags: currentTags,
            },
        };
        router.get(
            projectsIndex.url(queryOptions),
            {},
            {
                preserveState: true,
            }
        );
    }, [query, direction, currentTags])

    return (
        <AppLayout>
            <Head title={t('title')}/>
            <PageFlowContainer className="pt-0">

                <div className="flex flex-col gap-2 w-full px-3 max-w-xl bg-card border-b border-border pb-4 -mb-4">
                    <h1 className="page-title text-center mx-auto my-6">{t(title ?? 'search_title')}</h1>

                    <div className="flex gap-1">
                        <IconButton icon={direction === 'desc' ? ArrowDownWideNarrow : ArrowUpWideNarrow}
                                    textContent={t('pagination:' + direction)}
                                    onClick={changeDirection}/>
                        {/*<p className="section-title mx-1">{t('filter_' + filter)}</p>*/}
                        {/*<IconButton className="ml-auto" icon={ListFilter} textContent={t('filter')}
                                    onClick={() => {}}/>*/}
                    </div>
                    <TagsContainer tags={currentTags}/>
                    {/* Tags container (only if tags.) */}
                    {/* Search bar */}
                    <Form
                        {...ProjectController.indexSearch.form()}

                    >
                        <Input
                            id="search"
                            name="search"
                            autoFocus
                            onChange={(e) => {
                                setQuery(e.currentTarget.value);
                            }}
                        />
                        {/* TODO use Shadcn style on this */}
                        {/*<SearchBar onChange={search} data={query}/>*/}
                    </Form>
                </div>

                <ProjectsContainer
                    // currentPage={currentPage}
                    projects={projects}/>

            </PageFlowContainer>
        </AppLayout>
    );
}
