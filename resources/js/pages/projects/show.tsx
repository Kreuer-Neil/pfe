import {type BreadcrumbItem, IProject, IProjectShow, IServerResponse} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
import PageFlowContainer from "@/components/page-flow-container";
import TaskDisplay from "@/components/tasks/task-display";
import {instanceOfProject, instanceOfProjectShow} from "@/helpers/type-check";
import {Bookmark, BookmarkCheck, Flag, LogIn, PencilLine, Settings, Share2, UserRoundPlus} from "lucide-react";
import IconButton from "@/components/buttons/icon-button";
import Button from "@/components/buttons/button";
import ProjectIcon from "@/components/icons/project-icon";
import {useTranslation} from "react-i18next";
import {ReactNode, useState} from "react";
import GeneralInput from "@/components/form/general-input";
import {useImageAsset} from "@/hooks/use-image-asset";
import {RouteQueryOptions} from "@/wayfinder";
import {updateAppearance as projectUpdate} from "@/actions/App/Http/Controllers/ProjectController";

type pageProps = {
    project: IProject | IProjectShow | null,
}

type visitorPageProps = {
    project: IProjectShow,
}

type memberPageProps = {
    project: IProject,
}


function ProjectHeaderElement({slug, isEditing, className, children}: {
    slug: string,
    isEditing: boolean,
    className: string,
    children: ReactNode | ReactNode[]
}): ReactNode {
    if (isEditing) {
        return (
            <form action={projectUpdate(slug).url} method="POST" className={className}>
                {children}
            </form>
        );
    }
    return (
        <div className={className}>
            {children}
        </div>
    );
}

function ProjectHeader({project}: {
    project: IProject | IProjectShow
}) {
    const {t} = useTranslation('projects');
    const [isEditing, setIsEditing] = useState(false);

    const [projectName, setProjectName] = useState(project.name);
    const [projectDesc, setProjectDesc] = useState(project.description);
    const [projectIcon, setProjectIcon] = useState(project.icon);

    const [updateResponse, setUpdateResponse] = useState<IServerResponse>({success: false, error: null});

    const updateProject = () => {
        const update = async () => {
            try {
                const queryOptions: RouteQueryOptions = {
                    query: {
                        "name": projectName,
                        "description": projectDesc,
                        // "icon": projectIcon,
                    }
                }
                const response = await fetch(projectUpdate(project.slug, queryOptions).url);
                const data: IServerResponse = await response.json();
                return data;
            } catch (error) {
                console.error(error);
            }
        }
        update().then((dataReceived) => {
            setUpdateResponse(dataReceived!);
            setIsEditing(false);
        });
    }

    const ContainerElement = isEditing ? 'form' : 'div';

    return (
        <ContainerElement className="w-full flex flex-col-reverse gap-2 max-w-xl">
            <div className="flex flex-col items-center gap-4 px-3">
                <h1 className="page-title text-center">{isEditing ?
                    <GeneralInput name="project-name" label={t('project_form_name')}
                                  value={projectName} setValue={setProjectName}
                                  style="text" inputClassName="w-full text-center"/>
                    : projectName}</h1>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex gap-1 w-full">
                        <p className="mr-auto">
                            <span className="font-bold">{project.members_count}</span>
                            &nbsp;{t('members_count')}
                        </p>
                        {/* TODO add condition with permission for inviting people to project, as well as sharing */}
                        {project.user_role === 'viewer' ?
                            // Add more conditions on project
                            <IconButton icon={LogIn} textContent={t('join')} showText={true}/> :
                            <IconButton textContent={t('button_invite')} icon={UserRoundPlus}
                                        showText={true}/>
                        }
                        {
                            project.user_following ?
                                <IconButton icon={BookmarkCheck} textContent={t('following')}/> :
                                <IconButton icon={Bookmark} textContent={t('follow')}/>
                        }
                        <IconButton icon={Share2} textContent={t('button_share')}/>
                        <IconButton icon={Flag} textContent={t('button_report')}/>
                    </div>
                    {isEditing ?
                        <GeneralInput name="project-description" label={t('project_form_description')}
                                      value={projectDesc} setValue={setProjectDesc}
                                      type="textarea" style="text" inputClassName="w-full min-h-32 max-h-none"/>
                        : <p>
                            {projectDesc}
                        </p>
                    }
                </div>

                {isEditing ?
                    <div className="flex flex-col gap-3 w-full items-center">
                        <Button textContent={t('project_form_update')} onClick={updateProject}/>
                        {updateResponse.error ? <span
                            className={updateResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + updateResponse.error.key, updateResponse.error.params)}</span> : null}
                        <Button textContent={t('project_form_cancel')} color="destructive" onClick={() => {
                            setProjectName(project.name);
                            setProjectDesc(project.description);
                            setIsEditing(false);
                        }}/>
                    </div>
                    : null}
                {
                    project.news ?
                        <div>
                            <article>
                                <h2 className="section-title">
                                    {/* TODO fix when news added */}
                                    {/*{project.news.first.title}*/}
                                </h2>
                                <p>{/*{project.news.first.text_content}*/}</p>
                            </article>
                            <Button textContent={t('more_news')}/>
                        </div> : ''
                }

            </div>

            <div className="w-full">
                <div className="aspect-[2.8] w-full bg-container flex justify-end">
                    {project.user_role === 'admin' ?
                        <div className="flex gap-1 m-3 h-fit">
                            {!isEditing ?
                                <IconButton icon={PencilLine} textContent={t('project_edit')} showText={true}
                                            className="bg-tertiary text-tertiary-foreground"
                                            onClick={() => setIsEditing(true)}/>
                                : null}
                            <IconButton icon={Settings} textContent={t('project_settings')}
                                        className="bg-tertiary text-tertiary-foreground"/>
                        </div> : null}

                    {project.banner ?
                        <img src={useImageAsset('project/' + project.banner)} alt={''}
                             className="aspect-[2.8] w-full bg-container"/>
                        : null
                    }
                </div>
                <ProjectIcon project={project} size="large" className="bg-secondary -mt-14 mx-auto"/>
            </div>
        </ContainerElement>
    );
}

/**
 * Page display for non-members.
 */
function VisitorPage() {
    const {project} = usePage<visitorPageProps>().props;
    const {route} = usePage<{ route: string }>().props;
    const {t} = useTranslation('projects');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: project.name,
            href: route,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name}/>
            <PageFlowContainer className="pt-0">
                <ProjectHeader project={project}/>

                <section>
                </section>

            </PageFlowContainer>

        </AppLayout>
    );
}


/**
 * Page display for members only.
 */
function MemberPage() {
    const {project} = usePage<memberPageProps>().props;
    const {route} = usePage<{ route: string }>().props;
    const {t} = useTranslation('projects');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: project.name,
            href: route,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PageFlowContainer className="pt-0">
                <ProjectHeader project={project}/>

                <TaskDisplay tasks={project.upcoming_tasks} title={t('upcoming_tasks')} project={project}/>
            </PageFlowContainer>

        </AppLayout>
    );
}

export default function ProjectShow() {
    const {project} = usePage<pageProps>().props;

    if (instanceOfProjectShow(project)) {
        return <VisitorPage/>;
        //
    } else if (instanceOfProject(project)) {
        return <MemberPage/>
    }
}
