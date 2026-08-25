import AppLayout from "@/layouts/app-layout";
import {Form, Head, Link, router, usePage} from "@inertiajs/react";
import TaskDisplay from "@/components/tasks/task-display";
import {instanceOfProject, instanceOfProjectShow} from "@/helpers/type-check";
import {
    Camera,
    Copy,
    ListChecks,
    LogIn,
    MessageCircle,
    Newspaper,
    PencilLine,
    Settings,
    UserRoundPlus
} from "lucide-react";
import {Button} from "@/components/ui/button";
import ProjectIcon from "@/components/icons/project-icon";
import {useTranslation} from "react-i18next";
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {useImageAsset} from "@/hooks/use-image-asset";
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {
    join as projectsJoin,
    editGeneral as projectsEdit,
    show as projectsShow
} from "@/actions/App/Http/Controllers/ProjectController";
import {index as newsIndex} from "@/actions/App/Http/Controllers/ProjectNewsController";
import {index as chatsIndex} from "@/actions/App/Http/Controllers/ChatRoomController";
import CustomModal, {ModalContent, ModalHeader, ModalTitle} from "@/components/modals/custom-modal";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import UserAvatar from "@/components/users/user-avatar";
import {show as showProfile} from "@/actions/App/Http/Controllers/UserProfileController";
import InputError from "@/components/input-error";
import {Field, FieldGroup} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {IAppHeaderContext, IProject, IProjectShow, SharedData} from "@/types";
import FollowButton from "@/components/projects/follow-button";
import NewsCreateModal from "@/components/projects/news-create-modal";
import NewsArticle from "@/components/projects/news-article";
import PollCreateModal from "@/components/projects/poll-create-modal";
import PollCard from "@/components/projects/poll-card";

type pageProps = {
    project: IProject | IProjectShow | null,
}

type visitorPageProps = {
    project: IProjectShow,
}

type memberPageProps = {
    project: IProject,
}


function HeaderContainer({slug, isEditing, className, onSuccess, children}: {
    slug: string,
    isEditing: boolean,
    className: string,
    onSuccess: () => void,
    children: ReactNode | ReactNode[] | ((errors: Record<string, string>) => ReactNode | ReactNode[]),
}): ReactNode {
    if (isEditing) {
        return (
            <Form
                // action={projectUpdate(slug).url} method="POST"
                {...ProjectController.updateAppearance.form(slug)}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                encType="multipart/form-data"
                className={className}
                onSuccess={onSuccess}
            >
                {({processing, errors}) => (
                    <>
                        {typeof children === 'function' ? children(errors) : children}
                    </>
                )}
            </Form>
        );
    }
    return (
        <div className={className}>
            {typeof children === 'function' ? children({}) : children}
        </div>
    );
}

function ProjectHeaderIcon({isEditing, project, iconError}: {
    isEditing: boolean,
    project: IProject | IProjectShow,
    iconError?: string
}) {
    const {t} = useTranslation('projects');

    const [localFilePath, setLocalFilePath] = useState<string | undefined>(undefined);
    const iconPath = localFilePath ?? useImageAsset('projects/' + project.icon + '/large');

    if (!isEditing) {
        return (
            <ProjectIcon project={project} size="large" className="bg-secondary -mt-14 mx-auto"/>
        );
    }
    return (
        <>
            <label htmlFor="icon"
                   className="-mt-14 mx-auto block w-fit ml-auto cursor-pointer rounded-full">
                <span className="sr-only">{t('field_icon')}</span>

                <img src={iconPath} alt={t('icon_alt', {project: project.name})}
                     className="size-28 bg-secondary rounded-full object-cover"/>

                {/* TODO fix icon positioning */}
                <Camera className="bg-background text-secondary-border rounded-full ml-auto p-1 -mt-8 -mr-2 z-10"/>
                <input type="file" accept="image/png, image/jpg, image/jpeg, image/webp, image/gif" name="icon"
                       id="icon"
                       className="image-input sr-only"
                       onChange={(e) => {
                           if (e.target.files && e.target.files[0]) {
                               setLocalFilePath(URL.createObjectURL(e.target.files[0]));
                           }
                       }}/>
            </label>
            <InputError className="mt-6 mx-3" message={iconError}/>

        </>
    );

}

function InvitationModal({showInvitationModal, setShowInvitationModal, slug, isPrivate}: {
    showInvitationModal: boolean,
    setShowInvitationModal: Dispatch<SetStateAction<boolean>>,
    slug: string,
    isPrivate: boolean,
}) {
    const {t} = useTranslation(['projects']);

    const [code, setCode] = useState<string | null>(isPrivate ? null : projectsShow(slug).url);

    useEffect(() => {
        return router.on('flash', (e) => {
            if (e.detail.flash.invitation) {
                setCode(e.detail.flash.invitation as string | null);
                setShowInvitationModal(true);
            }
        });
    }, []);

    return (
        <CustomModal showModal={showInvitationModal} onClose={() => setShowInvitationModal(false)}
                     id="invitation-create" className="max-w-md">
            <ModalHeader>
                <ModalTitle>{t('invitation_modal')}</ModalTitle>
            </ModalHeader>
            <ModalContent>
                {code &&
                    <code onClick={() => navigator.clipboard.writeText(code)}
                          onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter')
                                  navigator.clipboard.writeText(code);
                          }} tabIndex={0}
                          className="flex gap-1 bg-gray-200 p-0.5 px-1 rounded-xs items-center hover:outline"
                          title={"copy"}
                    >{code}<Copy/></code>
                }
                {isPrivate &&
                    <Form
                        {...ProjectInvitationController.show.form()}
                        disableWhileProcessing
                        encType="multipart/form-data"
                    >
                        {({processing, errors}) => (
                            <FieldGroup>
                                <input type="hidden" name="project_slug" value={slug}/>
                                <Field>
                                    <Label htmlFor="invitation-max-uses">{t('invitation_max_uses_label')}</Label>
                                    <Input
                                        id="invitation-max-uses"
                                        name="max_uses"
                                        type="number"
                                        min={1}
                                        placeholder={t('invitation_max_uses_placeholder')}
                                    />
                                    <InputError message={errors.max_uses}/>
                                </Field>
                                <Field>
                                    <Label
                                        htmlFor="invitation-expires-at-date">{t('invitation_expires_at_date')}</Label>
                                    <Input
                                        id="invitation-expires-at-date"
                                        name="expires_at_date"
                                        type="date"
                                    />
                                    <InputError message={errors.expires_at_date}/>
                                </Field>
                                <Field>
                                    <Label
                                        htmlFor="invitation-expires-at-time">{t('invitation_expires_at_time')}</Label>
                                    <Input
                                        id="invitation-expires-at-time"
                                        name="expires_at_time"
                                        type="time"
                                    />
                                    <InputError message={errors.expires_at_time}/>
                                </Field>
                                <div className="flex flex-col gap-3 items-center">
                                    <Button type="submit">
                                        {t('invitation_generate')}
                                    </Button>
                                </div>
                            </FieldGroup>
                        )}
                    </Form>
                }
            </ModalContent>
        </CustomModal>
    );
}

function MembersModal({showModal, setShowModal, onCloseModal, project}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    onCloseModal: () => void,
    project: IProject | IProjectShow
}) {

    const {t} = useTranslation('projects')
    return (
        <CustomModal showModal={showModal} onClose={() => setShowModal(false)} id="members-show">
            <ModalHeader>
                <ModalTitle>{t('project_members_title')}</ModalTitle>
            </ModalHeader>
            <ModalContent>
                <ul className="flex flex-col gap-1">
                    {project.members.map((member, index) => {
                        return (
                            <li key={index}>
                                <Link href={showProfile(member.id)} className="thumbnail-item flex-row items-center">
                                    <UserAvatar user={member}/>
                                    <div className="flex flex-col">
                                        <p>
                                            {member.nickname}
                                        </p>
                                        <p className="text-xs">
                                            {member.first_name + ' ' + member.last_name}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </ModalContent>
        </CustomModal>
    );
}

function ProjectHeader({project}: {
    project: IProject | IProjectShow
}): ReactNode | ReactNode[] {
    const {t} = useTranslation(['projects', 'common']);
    const {auth} = usePage<SharedData>().props;
    const [isEditing, setIsEditing] = useState(false);

    const [projectName, setProjectName] = useState(project.name);
    const [projectDesc, setProjectDesc] = useState(project.description);

    const [showNewsCreateModal, setShowNewsCreateModal] = useState(false);

    const canCreateNews = project.user_role === 'admin' || project.user_role === 'moderator';

    const [showPollCreateModal, setShowPollCreateModal] = useState(false);
    const canCreatePoll = instanceOfProject(project) && project.can_create_poll;

    const [showInvitationModal, setShowInvitationModal] = useState<boolean>(false);

    function openInvitationModal() {

        setShowInvitationModal(true);
    }

    const [showMembersModal, setShowMembersModal] = useState<boolean>(false);
    const openMembersModal = (e: any) => {
        e.preventDefault();
        if (project.members.length > 0) {
            setShowMembersModal(true);
        }
    }
    return (
        <>
            <HeaderContainer slug={project.slug} isEditing={isEditing} onSuccess={() => setIsEditing(false)}
                             className="w-full flex flex-col gap-2 max-w-xl bg-card border-b border-border pb-4 -mb-4">
                {(errors) => (
                    <>
                        <div className="w-full">
                            <div className="aspect-[2.8] w-full bg-container flex justify-end">
                                {(project.user_role === 'admin') &&
                                    <div className="flex gap-1 m-3 h-fit">
                                        <Button size="sm" variant="secondary"
                                                onClick={() => setIsEditing(true)}
                                        >
                                                <span>
                                                    {t('project_edit')}
                                                </span>
                                            <PencilLine/>
                                        </Button>
                                        <Button asChild
                                                variant="secondary"
                                                size="icon-sm"
                                        >
                                            <Link href={projectsEdit(project.slug).url}>

                                            <span className="sr-only">
                                                {t('project_settings')}
                                            </span>
                                                <Settings/>
                                            </Link>
                                        </Button>
                                    </div>
                                }

                                {!(!project.banner) &&
                                    <img src={useImageAsset('project/' + project.banner)} alt={''}
                                         className="aspect-[2.8] w-full bg-container"/>
                                }
                            </div>

                            <ProjectHeaderIcon isEditing={isEditing} project={project} iconError={errors?.icon}/>
                        </div>

                        <div className="flex flex-col items-center gap-3 px-3">
                            <h1 className="page-title text-center">
                                {isEditing ?
                                    <Field>
                                        <Label>
                                            {t('project_form_name')}
                                        </Label>
                                        <Input name="name"
                                               value={projectName}
                                               onChange={(e) => setProjectName(e.target.value)}
                                               className="w-full text-center"
                                        />
                                        <InputError message={errors.name}/>
                                    </Field>
                                    : projectName}
                            </h1>

                            <div className="w-full flex flex-col gap-3">
                                <div className="flex gap-1 w-full">
                                    <p className="mr-auto block">
                                        <Button variant="ghost"
                                                size="sm"
                                                onClick={openMembersModal}
                                                className="gap-0"
                                        >
                                            <span className="font-bold">
                                                {project.members_count}
                                            </span>
                                            &nbsp;{t('members_count')}
                                        </Button>
                                    </p>
                                    {/* Who may invite is governed by ProjectPolicy::createInvitation(), driven by the
                                    project's permissions row (see projects/settings/permissions) - defaults to any
                                    non-banned member, restrictable to admin/moderator only. Enforced server-side by
                                    ProjectInvitationController::show(); can_invite here just controls the button. */}
                                    {project.user_role === 'viewer' ?
                                        // Add more conditions on project
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={projectsJoin(project.slug).url}>
                                                <span>
                                                    {t('join')}
                                                </span>
                                                <LogIn/>
                                            </Link>
                                        </Button> :
                                        project.can_invite &&
                                        <Button size="sm"
                                                variant="outline"
                                                onClick={() => openInvitationModal()}
                                        >
                                            <span>
                                                {t('button_invite')}
                                            </span>
                                            <UserRoundPlus/>
                                        </Button>
                                    }
                                    {project.user_role === 'viewer' &&
                                        <FollowButton slug={project.slug} isFollowing={project.is_following}/>
                                    }
                                    {/*<Button size="icon-sm" variant="outline">
                                        <span className="sr-only">{t('common:button_share')}</span><Share2/>
                                    </Button>
                                    <Button size="icon-sm" variant="outline">
                                        <span className="sr-only">{t('common:button_report')}</span><Flag/>
                                    </Button>*/}
                                </div>
                                {isEditing ?
                                    <Field>
                                        <Label>
                                            {t('project_form_description')}
                                        </Label>
                                        <Textarea
                                            name="description"
                                            value={projectDesc}
                                            onChange={(e) => setProjectDesc(e.target.value)}
                                        />
                                        <InputError message={errors.description}/>
                                    </Field>
                                    : <p>
                                        {projectDesc}
                                    </p>
                                }
                            </div>

                            {isEditing &&
                                <Field>
                                    <Button type="submit">
                                        {t('project_form_update')}
                                    </Button>
                                    <Button variant="destructive"
                                            onClick={() => {
                                                setProjectName(project.name);
                                                setProjectDesc(project.description);
                                                setIsEditing(false);
                                            }}
                                    >
                                        {t('project_form_cancel')}
                                    </Button>
                                    <InputError message={errors.update}/>
                                </Field>
                            }
                            {(project.news || canCreateNews) &&
                                <div className="w-full flex flex-col gap-1">
                                    {project.news &&
                                        <NewsArticle news={project.news} projectSlug={project.slug}
                                                     canManage={canCreateNews} currentUserId={auth.user.id}/>
                                    }
                                    <div className="flex gap-1 flex-wrap">
                                        {canCreateNews &&
                                            <Button variant="ghost_accent" size="sm" className="w-fit"
                                                    onClick={() => setShowNewsCreateModal(true)}>
                                                <Newspaper/>
                                                {t('news_create_title')}
                                            </Button>
                                        }
                                        {project.news &&
                                            <Button asChild variant="ghost_accent" size="sm" className="w-fit">
                                                <Link href={newsIndex(project.slug).url}>
                                                    {t('more_news')}
                                                </Link>
                                            </Button>
                                        }
                                    </div>
                                </div>
                            }

                            {instanceOfProject(project) && (project.polls.length > 0 || canCreatePoll) &&
                                <div className="w-full flex flex-col gap-2">
                                    {canCreatePoll &&
                                        <Button variant="ghost_accent" size="sm" className="w-fit"
                                                onClick={() => setShowPollCreateModal(true)}>
                                            <ListChecks/>
                                            {t('poll_create_title')}
                                        </Button>
                                    }
                                    {project.polls.map((poll) => (
                                        <PollCard key={poll.id} poll={poll} projectSlug={project.slug}
                                                  canManage={canCreateNews} currentUserId={auth.user.id}/>
                                    ))}
                                </div>
                            }

                        </div>
                    </>
                )}
            </HeaderContainer>
            <InvitationModal showInvitationModal={showInvitationModal} setShowInvitationModal={setShowInvitationModal}
                             slug={project.slug} isPrivate={instanceOfProject(project) ? project.is_private : false}/>
            <MembersModal showModal={showMembersModal} setShowModal={setShowMembersModal}
                          onCloseModal={() => setShowMembersModal(false)} project={project}/>
            {canCreateNews &&
                <NewsCreateModal showModal={showNewsCreateModal} setShowModal={setShowNewsCreateModal}
                                 slug={project.slug}/>
            }
            {canCreatePoll &&
                <PollCreateModal showModal={showPollCreateModal} setShowModal={setShowPollCreateModal}
                                 slug={project.slug}/>
            }
        </>
    );
}

/**
 * Page display for non-members.
 */
function VisitorPage() {
    const {project} = usePage<visitorPageProps>().props;
    const appHeaderContext: IAppHeaderContext =
        {
            contextImageSrc: useImageAsset(`projects/${project.icon}/small`),
            context: project.name,
        };
    return (
        <AppLayout appHeaderContext={appHeaderContext} className="pt-0">
            <Head title={project.name}/>
            <ProjectHeader project={project}/>
        </AppLayout>
    );
}


function ChatRooms({project}:{project:IProject}) {
    const  {t} = useTranslation('projects');
    // TODO adapt for more chat rooms later

    return (
        <div className="max-w-xl w-full px-3 flex flex-row-reverse">
            <Button asChild variant="outline" size="sm">
                <Link href={chatsIndex(project.slug).url}>
                    <MessageCircle/>
                    {t('open_chat')}
                </Link>
            </Button>
        </div>
    );
}

/**
 * Page display for members only.
 */
function MemberPage() {
    const {project} = usePage<memberPageProps>().props;
    const {t} = useTranslation('projects');
    const appHeaderContext: IAppHeaderContext =
        {
            contextImageSrc: useImageAsset(`projects/${project.icon}/small`),
            context: project.name,
        };

    return (
        <AppLayout appHeaderContext={appHeaderContext} className="pt-0">
            <ProjectHeader project={project}/>

            <ChatRooms project={project}/>

            <TaskDisplay tasks={project.upcoming_tasks} title={t('upcoming_tasks')} project={project}/>
        </AppLayout>
    );
}

export default function ProjectShow(): ReactNode {
    const {project} = usePage<pageProps>().props;

    if (instanceOfProjectShow(project)) {
        return <VisitorPage/>;
        //
    } else if (instanceOfProject(project)) {
        return <MemberPage/>
    }
}
