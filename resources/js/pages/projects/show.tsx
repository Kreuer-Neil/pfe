import {type BreadcrumbItem, IProject, IProjectShow} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
import PageFlowContainer from "@/components/page-flow-container";
import TaskDisplay from "@/components/tasks/task-display";
import {instanceOfProject, instanceOfProjectShow} from "@/helpers/type-check";
import {Bookmark, BookmarkCheck, Flag, LogIn, Share2, UserRoundPlus} from "lucide-react";
import IconButton from "@/components/buttons/icon-button";
import Button from "@/components/buttons/button";
import ProjectIcon from "@/components/icons/project-icon";
import {useTranslation} from "react-i18next";

type pageProps = {
    project: IProject | IProjectShow | null,
}

type visitorPageProps = {
    project: IProjectShow,
}

type memberPageProps = {
    project: IProject,
}


function ProjectHeader({project}: {
    project: IProject | IProjectShow
}) {
    const {t} = useTranslation('projects');

    return (
        <header className="w-full flex flex-col-reverse gap-2 max-w-xl">
            <div className="flex flex-col items-center gap-4 px-3">
                <h1 className="page-title text-center">{project.name}</h1>

                <div className="w-full">
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
                    <p className="">{project.description}</p>
                </div>

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
                {
                    project.banner ?
                        <img src={undefined} alt={''}
                             className="aspect-[2.8] w-full bg-container"/> :
                        <div className="aspect-[2.8] w-full bg-container"/>
                }
                <ProjectIcon project={project} size="large" className="bg-secondary -mt-14 mx-auto"/>
            </div>
        </header>
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
