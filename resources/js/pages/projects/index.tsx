import type {IDashboardProject, IPaginationLink, IProjectMiniature} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Form, Head, router, usePage} from "@inertiajs/react";
import {Dispatch, Fragment, ReactNode, SetStateAction, useEffect, useState} from "react";
import ProjectItem from "@/components/projects/project-item";
import PageFlowContainer from "@/components/page-flow-container";
import {ArrowDownWideNarrow, ArrowUpWideNarrow, ListFilter, LucideIcon, Search} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Input} from "@/components/ui/input";
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {index as projectsIndex} from "@/actions/App/Http/Controllers/ProjectController";
import {RouteQueryOptions} from "@/wayfinder";
import {Button} from "@/components/ui/button";
import {Field, FieldGroup, FieldLegend, FieldSet} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import CustomModal, {ModalContent, ModalDescription, ModalHeader, ModalTitle} from "@/components/modals/custom-modal";
import {
    Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem,
    ComboboxList, ComboboxValue, useComboboxAnchor
} from "@/components/ui/combobox";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";

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
    distancesList: number[];
    currentFilter: string;
    currentTags: string[];
    hasLocation: boolean;
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
                        <li key={project.slug} className="w-full">
                            <ProjectItem project={project}/>
                        </li>))
                    }
                </ul>
            }
        </section>
    );
}

function TagsContainer({tags}: { tags: string[] }) {
    const {t} = useTranslation('tags');

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

// {showModal, setShowModal}: {
//     showModal: boolean,
//     setShowModal: Dispatch<SetStateAction<boolean>>
// }
function Filtering({showModal, setShowModal, tags, setTags, filter, setFilter, maxDistance, setMaxDistance}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>
    tags: Array<string>,
    setTags: Dispatch<SetStateAction<string[]>>
    filter: string,
    setFilter: Dispatch<SetStateAction<string>>
    maxDistance: string,
    setMaxDistance: Dispatch<SetStateAction<string>>
}) {
    const {tagsList, filtersList, distancesList, hasLocation} = usePage<PageProps>().props;
    const {t} = useTranslation(['projects-index', 'projects', 'tags']);
    const anchor = useComboboxAnchor();

    const modalId = 'filters';
    return (
        <CustomModal showModal={showModal} onClose={() => {
            setShowModal(false)
        }} id={modalId}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>
                        {t('filters_title')}
                    </ModalTitle>
                    <ModalDescription>
                        {t('filters_description')}
                    </ModalDescription>
                </ModalHeader>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>{t('filter_legend')}</FieldLegend>
                        <Field>
                            <Label htmlFor="filter-select">
                                {t('filter_label')}
                            </Label>
                            <Select name="filter" value={filter} onValueChange={setFilter}>
                                <SelectTrigger id="filter-select" className="w-full">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {filtersList.map((filter) => (
                                        <SelectItem key={filter} value={filter}>{t('filter_' + filter)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldSet>

                    <Separator/>

                    <FieldSet>
                        <FieldLegend>{t('tags_legend')}</FieldLegend>
                        <Field>
                            <Label htmlFor="tags-container">
                                {t('tags_select_label')}
                            </Label>
                            <Combobox
                                name="tags"
                                id="tags-select"
                                multiple
                                autoHighlight
                                items={tagsList}
                                value={tags}
                                onValueChange={(values: Array<string>) => {
                                    setTags(values ?? [])
                                }}
                            >
                                <ComboboxChips ref={anchor} className="w-full max-w-xs">
                                    <ComboboxValue>
                                        {(values) => (
                                            <Fragment>
                                                {values.map((value: string) => (
                                                    <ComboboxChip key={value}>{t('tags:' + value)}</ComboboxChip>
                                                ))}
                                                <ComboboxChipsInput/>
                                            </Fragment>
                                        )}
                                    </ComboboxValue>
                                </ComboboxChips>
                                <ComboboxContent anchor={anchor} id={modalId}>
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item} value={item}>
                                                {t('tags:' + item)}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </Field>
                    </FieldSet>
                    {hasLocation && (
                        <>
                            <Separator/>
                            <FieldSet>
                                <FieldLegend>
                                    {t('distance_legend')}
                                </FieldLegend>
                                <Field>
                                    <Label htmlFor="max-distance">
                                        {t('max_distance_label')}
                                    </Label>
                                    <Input
                                        id="max-distance"
                                        name="max_distance"
                                        type="number"
                                        min={0}
                                        value={maxDistance}
                                        onChange={(e) => setMaxDistance(e.target.value)}
                                        list="default-distances"
                                    />
                                    <datalist id="default-distances">
                                        {distancesList.map((distance) =>
                                            <option value={distance} key={distance}>
                                                {t('projects:distance_km', {distance: distance})}
                                            </option>
                                        )}
                                    </datalist>
                                </Field>
                            </FieldSet>
                        </>
                    )}
                </FieldGroup>
            </ModalContent>
        </CustomModal>
    );
}

export default function ProjectsIndex() {
    const {title, currentFilter, currentTags, projects} = usePage<PageProps>().props;

    const {t} = useTranslation(['projects-index', 'projects']);

    // const [projects, setProjects] = useState<IPaginatedProjects>({data: [], links: []});

    const uri = document.documentURI;
    const [direction, setDirection] = useState<string>(uri?.split('direction=')[1]?.split('&')[0] ?? 'desc');
    const [tags, setTags] = useState<string[]>(currentTags);
    const [query, setQuery] = useState<string>(uri?.split('query=')[1]?.split('&')[0] ?? '');
    const [filter, setFilter] = useState<string>(currentFilter);
    const [maxDistance, setMaxDistance] = useState<string>(uri?.split('max_distance=')[1]?.split('&')[0] ?? '');
    const [showFiltering, setShowFiltering] = useState<boolean>(false);

    const changeDirection = (): any => {
        setDirection(direction === 'desc' ? 'asc' : 'desc');
    }

    useEffect(() => {
        const queryOptions: RouteQueryOptions = {
            query: {
                query: query,
                direction: direction,
                tags: tags,
                filter: filter,
                max_distance: maxDistance || undefined,
            },
        };
        router.get(
            projectsIndex.url(queryOptions),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                preserveUrl: true
            }
        );
    }, [query, direction, tags, filter, maxDistance]);

    const DirectionIcon: LucideIcon = direction === 'desc' ? ArrowDownWideNarrow : ArrowUpWideNarrow;

    return (
        <AppLayout>
            <Head title={t('title')}/>
            <PageFlowContainer className="pt-0">

                <div className="flex flex-col gap-2 w-full px-3 max-w-xl bg-card border-b border-border pb-4 -mb-4">
                    <h1 className="page-title text-center mx-auto my-6">{t(title ?? 'search_title')}</h1>

                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" onClick={changeDirection}>
                            <span className="sr-only">
                                {t('pagination:' + direction)}
                            </span>
                            <DirectionIcon/>
                        </Button>
                        <p className="section-title mx-1">{t('filter_' + filter)}</p>
                        <Button variant="outline" size="icon"
                                onClick={() => setShowFiltering(true)}>
                                        <span className="sr-only">
                                        {t('filter')}
                                        </span>
                            <ListFilter/>
                        </Button>
                        {/*<Button variant="outline" size="icon">
                                        <span className="sr-only">
                                        {t('filter')}
                                        </span>
                            <ListFilter/>
                        </Button>*/}
                    </div>
                    <TagsContainer tags={tags}/>
                    {/* Tags container (only if tags.) */}
                    {/* Search bar */}
                    <Form
                        {...ProjectController.indexSearch.form()}

                    >
                        <Field>
                            {/*<ButtonGroup>*/}
                            {/*<Button type="submit">
                                    <span className="sr-only">{t('search')}</span>
                                    <Search/>
                                </Button>*/}
                            <Input
                                id="search"
                                name="search"
                                autoFocus
                                placeholder={t('search')}
                                onChange={(e) => {
                                    setQuery(e.currentTarget.value);
                                }}
                                defaultValue={uri?.split('query=')[1]?.split('&')[0] ?? ''}
                            />
                            {/*</ButtonGroup>*/}
                        </Field>
                    </Form>
                </div>

                <ProjectsContainer
                    // currentPage={currentPage}
                    projects={projects}
                />

            </PageFlowContainer>
            <Filtering
                showModal={showFiltering}
                setShowModal={setShowFiltering}
                tags={tags}
                setTags={setTags}
                filter={filter}
                setFilter={setFilter}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
            />
        </AppLayout>
    );
}
