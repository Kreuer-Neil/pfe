import AppLayout from "@/layouts/app-layout";
import {Form, Head, Link, router, usePage} from "@inertiajs/react";
import PageFlowContainer from "@/components/page-flow-container";
import TaskDisplay from "@/components/tasks/task-display";
import {instanceOfProject, instanceOfProjectShow} from "@/helpers/type-check";
import {
    Bookmark,
    BookmarkCheck,
    Camera,
    Copy,
    Flag,
    LogIn,
    PencilLine,
    Settings,
    Share2,
    UserRoundPlus
} from "lucide-react";
import {Button} from "@/components/ui/button";
import ProjectIcon from "@/components/icons/project-icon";
import {useTranslation} from "react-i18next";
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {useImageAsset} from "@/hooks/use-image-asset";
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {join as projectsJoin, edit as projectsEdit} from "@/actions/App/Http/Controllers/ProjectController";
import CustomModal, {ModalContent, ModalHeader, ModalTitle} from "@/components/modals/custom-modal";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";
import UserAvatar from "@/components/users/user-avatar";
import {show as showProfile} from "@/actions/App/Http/Controllers/UserProfileController";
import InputError from "@/components/input-error";
import {Field, FieldGroup} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {IAppHeaderContext, IProject, IProjectShow} from "@/types";

type pageProps = {
    project: IProject | IProjectShow | null,
}

type visitorPageProps = {
    project: IProjectShow,
}

type memberPageProps = {
    project: IProject,
}


function HeaderContainer({slug, isEditing, className, children}: {
    slug: string,
    isEditing: boolean,
    className: string,
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

function InvitationModal({showInvitationModal, setShowInvitationModal, slug}: {
    showInvitationModal: boolean,
    setShowInvitationModal: Dispatch<SetStateAction<boolean>>,
    slug: string
}) {
    const {t} = useTranslation(['projects']);

    const [expiresAtDate, setExpiresAtDate] = useState<string>('');
    const [expiresAtTime, setExpiresAtTime] = useState<string>('');
    const [code, setCode] = useState<string | null>(null);

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
                {/*TODO use later with conditional rendering to get invitations*/}
                <Form
                    {...ProjectInvitationController.show.form()}
                    disableWhileProcessing
                    encType="multipart/form-data"
                >
                    {({processing, errors}) => (
                        <>
                            <input type="hidden" name="project_slug" value={slug}/>
                            {/*<GeneralInput name="expires_at_date" label={t('invitation_expires_at_date')}
                                          value={expiresAtDate} setValue={setExpiresAtDate}
                                          type="date"
                            />
                            <GeneralInput name="expires_at_time" label={t('invitation_expires_at_time')}
                                          value={expiresAtTime} setValue={setExpiresAtTime}
                                          type="time"
                            />*/}
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
                            <div className="flex flex-col gap-3 items-center">
                                <Button type="submit">
                                    {t('invitation_generate')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
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
    const [isEditing, setIsEditing] = useState(false);

    const [projectName, setProjectName] = useState(project.name);
    const [projectDesc, setProjectDesc] = useState(project.description);

    useEffect(() => {
        return router.on('flash', (e) => {
            if (e.detail.flash.success) {
                setIsEditing(false);
            }
        });
    }, []);

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
            <HeaderContainer slug={project.slug} isEditing={isEditing}
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
                                         className="aspect-[2.8] w-full bg-container"/>}
                            </div>

                            <ProjectHeaderIcon isEditing={isEditing} project={project} iconError={errors?.icon}/>
                        </div>

                        <div className="flex flex-col items-center gap-3 px-3">
                            <h1 className="page-title text-center">{isEditing ?
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
                                : projectName}</h1>

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
                                    {/* TODO add condition with permission for inviting people to project, as well as sharing */}
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
                                    {/*{project.user_following ?
                                        <Button size="icon-sm" variant="outline">
                                            <span className="sr-only">{t('following')}</span><BookmarkCheck/>
                                        </Button> :
                                        <Button size="icon-sm" variant="outline">
                                            <span className="sr-only">{t('follow')}</span><Bookmark/>
                                        </Button>}
                                    <Button size="icon-sm" variant="outline">
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
                            {/*project.news &&
                                <div>
                                    <article>
                                        <h2 className="section-title">
                                            // TODO fix when news added
                                            {{project.news.first.title}}
                                        </h2>
                                        <p>{{project.news.first.text_content}}</p>
                                    </article>
                                    <Button variant="ghost">
                                        {t('more_news')}
                                    </Button>
                                </div>
                            */}

                        </div>
                    </>
                )}
            </HeaderContainer>
            <InvitationModal showInvitationModal={showInvitationModal} setShowInvitationModal={setShowInvitationModal}
                             slug={project.slug}/>
            <MembersModal showModal={showMembersModal} setShowModal={setShowMembersModal}
                          onCloseModal={() => setShowMembersModal(false)} project={project}/>
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
        <AppLayout appHeaderContext={appHeaderContext}>
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
    const {t} = useTranslation('projects');
    const appHeaderContext: IAppHeaderContext =
        {
            contextImageSrc: useImageAsset(`projects/${project.icon}/small`),
            context: project.name,
        };

    return (
        <AppLayout appHeaderContext={appHeaderContext}>
            <PageFlowContainer className="pt-0">
                <ProjectHeader project={project}/>

                <TaskDisplay tasks={project.upcoming_tasks} title={t('upcoming_tasks')} project={project}/>
            </PageFlowContainer>
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
