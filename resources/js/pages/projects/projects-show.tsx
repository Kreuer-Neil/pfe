import {IAppHeaderContext, IProject, IProjectShow, IServerResponse} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Form, Head, router, usePage} from "@inertiajs/react";
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
import IconButton from "@/components/buttons/icon-button";
import Button from "@/components/buttons/button";
import ProjectIcon from "@/components/icons/project-icon";
import {useTranslation} from "react-i18next";
import {Dispatch, ReactNode, SetStateAction, useState} from "react";
import GeneralInput from "@/components/form/general-input";
import {useImageAsset} from "@/hooks/use-image-asset";
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import {join as joinProject} from "@/actions/App/Http/Controllers/ProjectController";
import ModalCast from "@/components/modals/modal-cast";
import CustomModal from "@/components/modals/custom-modal";
import ModalSection from "@/components/modals/modal-section";
import ProjectInvitationController from "@/actions/App/Http/Controllers/ProjectInvitationController";

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
            {/* @ts-ignore */}
            {typeof children === 'function' ? children() : children}
        </div>
    );
}

function ProjectHeaderIcon({isEditing, project, iconError}: {
    isEditing: boolean,
    project: IProject | IProjectShow,
    iconError: string | null
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
                     className="size-[7rem] bg-secondary rounded-full object-cover"/>

                {/* TODO fix icon positioning */}
                <Camera className="bg-background text-secondary-border rounded-full ml-auto p-1 -mt-8 -mr-2 z-10"/>
                <input type="file" accept="image/png, image/jpg, image/webp" name="icon" id="icon"
                       className="image-input sr-only"
                       onChange={(e) => {
                           if (e.target.files && e.target.files[0]) {
                               setLocalFilePath(URL.createObjectURL(e.target.files[0]));
                           }
                       }}/>
            </label>
            {iconError &&
                <span className="field-error">{iconError}</span>}
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

    router.on('flash', (e) => {
        if (e.detail.flash.invitation) {
            // @ts-ignore
            setCode(e.detail.flash.invitation);
            // TODO fix to not have to trick for this
            setShowInvitationModal(true);
        }
    });

    return (
        <CustomModal showModal={showInvitationModal} onClose={() => setShowInvitationModal(false)}
                     id="invitation-create" className="max-w-md">
            <ModalCast closeModal={() => setShowInvitationModal(false)} title={t('invitation_modal')}>
                {/*TODO use later with conditional rendering to get invitations*/}
                <Form
                    {...ProjectInvitationController.show.form()}
                    disableWhileProcessing
                    encType="multipart/form-data"
                >
                    {({processing, errors}) => (
                        <>
                            <ModalSection className="border-none">
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
                            </ModalSection>
                            <div className="flex flex-col gap-3 items-center">
                                <Button textContent={t('invitation_generate')} type="submit" onClick={() => null}/>
                            </div>
                        </>
                    )}
                </Form>
            </ModalCast>
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

    router.on('flash', (e) => {
        if (e.detail.flash.success) {
            setIsEditing(false);
        }
    });

    const [showInvitationModal, setShowInvitationModal] = useState<boolean>(false);

    function openInvitationModal() {

        setShowInvitationModal(true);
    }

    const [updateResponse, setUpdateResponse] = useState<IServerResponse>({success: false, error: null});

    return (
        <>
            <HeaderContainer slug={project.slug} isEditing={isEditing}
                             className="w-full flex flex-col gap-2 max-w-xl">
                {(errors) => (
                    <>
                        <div className="w-full">
                            <div className="aspect-[2.8] w-full bg-container flex justify-end">
                                {project.user_role === 'admin' &&
                                    <div className="flex gap-1 m-3 h-fit">
                                        {!isEditing &&
                                            <IconButton icon={PencilLine} textContent={t('project_edit')}
                                                        showText={true}
                                                        className="bg-tertiary text-tertiary-foreground"
                                                        onClick={() => setIsEditing(true)}/>}
                                        <IconButton icon={Settings} textContent={t('project_settings')}
                                                    className="bg-tertiary text-tertiary-foreground"/>
                                    </div>}

                                {!(!project.banner) &&
                                    <img src={useImageAsset('project/' + project.banner)} alt={''}
                                         className="aspect-[2.8] w-full bg-container"/>}
                            </div>

                            <ProjectHeaderIcon isEditing={isEditing} project={project} iconError={errors?.icon}/>
                        </div>

                        <div className="flex flex-col items-center gap-3 px-3">
                            <h1 className="page-title text-center">{isEditing ?
                                <GeneralInput name="name" label={t('project_form_name')}
                                              value={projectName} setValue={setProjectName}
                                              style="text" inputClassName="w-full text-center"
                                              error={errors.name}/>
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
                                        <IconButton icon={LogIn} textContent={t('join')} showText={true}
                                                    href={joinProject(project.slug).url}/> :
                                        <IconButton textContent={t('button_invite')} icon={UserRoundPlus}
                                                    showText={true} onClick={() => openInvitationModal()}/>}
                                    {project.user_following ?
                                        <IconButton icon={BookmarkCheck} textContent={t('following')}/> :
                                        <IconButton icon={Bookmark} textContent={t('follow')}/>}
                                    <IconButton icon={Share2} textContent={t('common:button_share')}/>
                                    <IconButton icon={Flag} textContent={t('common:button_report')}/>
                                </div>
                                {isEditing ?
                                    <GeneralInput name="description" label={t('project_form_description')}
                                                  value={projectDesc} setValue={setProjectDesc}
                                                  type="textarea" style="text"
                                                  inputClassName="w-full min-h-32 max-h-none"
                                                  error={errors.description}/>
                                    : <p>
                                        {projectDesc}
                                    </p>}
                            </div>

                            {isEditing &&
                                <div className="flex flex-col gap-3 w-full items-center">
                                    <Button textContent={t('project_form_update')} type="submit"
                                            onClick={() => {
                                            }}/>
                                    {updateResponse.error && <span
                                        className={updateResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + updateResponse.error.key, updateResponse.error.params)}</span>}
                                    <Button textContent={t('project_form_cancel')} color="destructive" onClick={() => {
                                        setProjectName(project.name);
                                        setProjectDesc(project.description);
                                        setIsEditing(false);
                                    }}/>
                                </div>}
                            {project.news ?
                                <div>
                                    <article>
                                        <h2 className="section-title">
                                            {/* TODO fix when news added */}
                                            {/*{project.news.first.title}*/}
                                        </h2>
                                        <p>{/*{project.news.first.text_content}*/}</p>
                                    </article>
                                    <Button textContent={t('more_news')}/>
                                </div> : ''}

                        </div>
                    </>
                )}
            </HeaderContainer>
            <InvitationModal showInvitationModal={showInvitationModal} setShowInvitationModal={setShowInvitationModal}
                             slug={project.slug}/>
        </>
    );
}

/**
 * Page display for non-members.
 */
function VisitorPage() {
    const {project} = usePage<visitorPageProps>().props;
    const {route} = usePage<{ route: string }>().props;
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
    const {route} = usePage<{ route: string }>().props;
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
