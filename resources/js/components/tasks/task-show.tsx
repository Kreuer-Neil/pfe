import {INote, IServerResponse, ITask} from "@/types";
import {Dispatch, ReactNode, SetStateAction, useState} from "react";
import {useTranslation} from "react-i18next";
import CustomModal from "@/components/modals/custom-modal";
import ModalCast from "@/components/modals/modal-cast";
import ModalSection from "@/components/modals/modal-section";
import ProjectIcon from "@/components/icons/project-icon";
import {cn} from "@/lib/utils";
import {CalendarCheck, CalendarClock, ClockAlert, Notebook, UsersRound} from "lucide-react";
import PostedBy from "@/components/general-posts/posted-by";
import Button from "@/components/buttons/button";
import TaskController, {
    participate as taskParticipate,
    update as taskUpdate,
    destroy as taskDestroy,
    cancelParticipation as taskCancelParticipation,
    validate as taskValidation,
} from "@/actions/App/Http/Controllers/TaskController";
import GeneralInput from "@/components/form/general-input";
import {RouteQueryOptions} from "@/wayfinder";
import ConfirmModal from "@/components/modals/confirm-modal";
import RelatedUsers from "@/components/users/related-users";
import {Form, Link, router} from "@inertiajs/react";
import {show as projectsShow} from '@/actions/App/Http/Controllers/ProjectController';
import {update as tasksUpdate} from '@/actions/App/Http/Controllers/TaskController';
import InputError from "@/components/input-error";

type EditProps = {
    task: ITask | undefined;
    onCloseModal: () => void;
    editTitle: string;
    setEditTitle: Dispatch<SetStateAction<string>>;
    editDescription: string;
    setEditDescription: Dispatch<SetStateAction<string>>;
    editDueAtDate: string;
    setEditDueAtDate: Dispatch<SetStateAction<string>>;
    editDueAtTime: string | null;
    setEditDueAtTime: Dispatch<SetStateAction<string | null>>;
    editRecommendedParticipations: number | null;
    setEditRecommendedParticipations: Dispatch<SetStateAction<number | null>>;
    resetTask: () => void;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    onTaskTap: (id: string, force?: boolean) => void;
}


function NotesList({task}: { task: ITask | undefined }) {
    const {t} = useTranslation('projects');

    if (!(task?.notes && task.notes.length > 0)) {
        return <p>{t('task_note_empty')}</p>
    }
    return (
        <ul className="flex flex-col gap-2">
            {task.notes.map((note: INote) => {
                // TODO add edit/delete variable for note owner/admin (only delete for admin not owner)
                // TODO limit notes to 1/2 per task per user
                return (
                    <li className="flex flex-col gap-1">
                        <p>{note.content}</p>
                        <PostedBy owner={note.owner}/>
                    </li>
                );
            })}
        </ul>
    );
}

function Show({task, onCloseModal, startEdit, deleteTask, hasProjectContext}: {
    task: ITask | undefined,
    onCloseModal: () => void,
    startEdit: (task: ITask) => void,
    deleteTask: (task: ITask) => void,
    hasProjectContext: boolean
}) {
    const {t} = useTranslation(['projects', 'date', 'errors']);

    const [participationStatus, setParticipationStatus] = useState<boolean>(task?.self_participating ?? false);
    const [participationError, setParticipationError] = useState<string | undefined>();

    router.on('flash', (e) => {
        if (e.detail.flash?.participation_error)
            // @ts-ignore
            setParticipationError(e.detail.flash.participation_error);
        if (e.detail.flash?.participating)
            //@ts-ignore
            setParticipationStatus(e.detail.flash.participating === 'true');
    });

    const validate = () => {
        const confirmValidation = async () => {
            try {
                const response = await fetch(taskValidation(task!.id).url);
                const data: IServerResponse = await response.json();
                return data;
            } catch (e) {
                console.error(e);
            }
        }
        confirmValidation().then((value) => {
            if (value?.success) {
                // TODO success modal toast + item reload + page items reload on task-display
                task!.self_participating = true;
            }
            // setParticipationStatus(value!)
        });
    }


    return (
        <ModalCast title={task?.title ?? ''} closeModal={onCloseModal}>
            <ModalSection className="border-none">
                {hasProjectContext &&
                    <Link className="item-title text-with-icon w-full"
                          href={task?.project ? projectsShow(task.project.slug) : undefined}>
                        <ProjectIcon
                            project={task?.project ?? {name: '', icon: '', slug: '', id: ''}}
                            size="small"/>
                        {task?.project.name ?? null}
                    </Link>
                }
                {/* TODO fix date */}
                {task?.due_at &&
                    <p className={cn("flex gap-1", task?.due_at ? '' : 'hidden')}>
                        <CalendarClock/>
                        <time dateTime={task.due_at}>{task.due_at}</time>
                    </p>
                }
                <p className="mt-1">
                    {task?.description ?? null}
                </p>
            </ModalSection>
            <ModalSection>
                <div className="flex wrap">
                    <div className="text-with-icon mr-auto">
                        {task?.related_users &&
                            <RelatedUsers profiles={task.related_users} isWithLinks/>
                        }
                        <p>
                            {task?.participations_count ? t('task_participations_count', {count: task.participations_count}) : t('task_no_participations')}
                        </p>
                    </div>
                    {task?.min_participations &&
                        <div className="text-with-icon">
                            <UsersRound className="item-tag"/>
                            <p>
                                {t('task_recommended_participations_count', {count: task.min_participations})}
                            </p>
                        </div>
                    }
                </div>
                {participationStatus ?
                    <div className="text-with-icon">
                        <CalendarCheck className="item-tag bg-tag"/>
                        <p>
                            {t('task_self_participating')}
                        </p>
                    </div> : null}
                {/*modalTask.due_at > Date.now()*/}
                {task?.due_at && false &&
                    <div className="flex gap-1">
                        <ClockAlert className="item-tag bg-tag-warning"/>
                        <p>
                            {t('task_due_soon')}
                        </p>
                    </div>}
            </ModalSection>
            {/*<ModalSection title={t('task_note_title')} icon={Notebook}>
                <NotesList task={task}/>
                <ButtonText textContent={t('task_note_add')} icon={NotebookPen} className="self-center"
                            onClick={() => {
                                // TODO note creation logic
                            }} autoFocus={true}/>
            </ModalSection>*/}
            <div className="flex flex-col gap-3 px-2 items-center">
                {/* TODO restyle this corner */}
                {participationStatus ?
                    <Form className="w-full max-w-md"
                          {...TaskController.cancelParticipation.form(task?.id ?? 0)}
                    >
                        {({processing, errors}) => (
                            <Button textContent={t('task_cancel_participate')} type="submit"
                                    color="destructive"/>
                        )}
                    </Form> :
                    <Form className="w-full max-w-md"
                          {...TaskController.participate.form(task?.id ?? 0)}
                    >
                        {({processing, errors}) => (
                            <Button textContent={t('task_participate')} type="submit"/>
                        )}
                    </Form>
                }
                {participationStatus &&
                    <Button textContent={t('task_validate')} onClick={validate}/>
                }
                <InputError message={participationError ? t('errors:' + participationError) : undefined}/>
                {task?.isOwner &&
                    <div className="grid md:grid-cols-2 gap-1 sm:justify-center w-full max-w-md">
                        <Button textContent={t('task_edit')} color="edit" onClick={() => startEdit(task)}/>
                        <Button textContent={t('task_delete')} color="destructive" onClick={() => deleteTask(task)}/>
                    </div>
                }
            </div>
        </ModalCast>
    );
}

function Edit(
    {
        task,
        onCloseModal,
        editTitle,
        editDescription,
        editDueAtDate,
        editDueAtTime,
        editRecommendedParticipations,
        setIsEditing,
        onTaskTap
    }: EditProps): ReactNode {
    const {t} = useTranslation(['projects', 'date']);

    const [updateResponse, setUpdateResponse] = useState<IServerResponse>({success: false, error: null});

    router.on('flash', (e) => {
        if (e.detail.flash.edit_error) {
            setIsEditing(false);
            onTaskTap(task!.id, true);
        }
    });

    const title = (
        <>
            <GeneralInput name="title" label={t('task_title')} required={true} value={editTitle} style="text"/>
        </>
    );
    return (
        <Form
            {...TaskController.update.form(task!.id)}
            className="flex flex-col gap-4"
        >
            {({processing, errors}) => (
                <>
                    <ModalCast title={title} closeModal={onCloseModal}>
                        <ModalSection className="border-none">
                            <p className="item-title text-with-icon">
                                <ProjectIcon
                                    project={task?.project ?? {name: '', icon: '', slug: '', id: ''}}
                                    size="small"/>
                                {task?.project.name ?? null}
                            </p>
                            {/* TODO fix date */}
                            <p className="flex gap-1">
                                <CalendarClock/>
                                <GeneralInput name="due_at_date" label={t('due_at_date')} style="text" type="date"
                                              required={true} value={editDueAtDate ?? undefined}/>
                                <InputError message={errors.due_at_date}/>
                                <GeneralInput name="due_at_time" label={t('due_at_time')} style="text" type="time"
                                              value={editDueAtTime ?? undefined}
                                />
                                <InputError message={errors.due_at_time}/>
                            </p>

                            <p className="mt-1">
                                <GeneralInput name="description" label={t('task_description')}
                                              type="textarea" style="text"
                                              inputClassName="w-full min-h-0"
                                              value={editDescription}
                                />
                                <InputError message={errors.description}/>
                            </p>
                        </ModalSection>
                        <ModalSection>
                            <div className="flex wrap">
                                <p className="text-with-icon mr-auto">
                                    {/*<RelatedUsers />*/}
                                    {task?.participations_count ? t('task_participations_count', {count: task.participations_count}) : t('task_no_participations')}
                                </p>
                                <p className="text-with-icon">
                                    <UsersRound className="item-tag"/>
                                    <GeneralInput name="min_participations" type="number"
                                                  style="text" inputClassName="w-fit max-w-[40vw]"
                                                  label={t('task_recommended_participations_count', {count: '0'})}
                                                  value={editRecommendedParticipations?.toString() ?? undefined}
                                    />
                                    <InputError message={errors.recommended_participations}/>
                                </p>
                            </div>
                            {task?.self_participating &&
                                <p className="text-with-icon">
                                    <CalendarCheck className="item-tag bg-tag"/>
                                    {t('task_self_participating')}
                                </p>}
                            {/*modalTask.due_at > Date.now()*/}
                            {(task?.due_at && false) &&
                                <p className="flex gap-1">
                                    <ClockAlert className="item-tag bg-tag-warning"/>
                                    {t('task_due_soon')}
                                </p>}
                        </ModalSection>
                        {/*<ModalSection title={t('task_note_title')} icon={Notebook}>
                            <NotesList task={task}/>

                        </ModalSection>*/}
                        <div className="flex flex-col gap-3 px-2">
                            <Button color="edit" textContent={t('task_confirm_changes')} onClick={() => null}
                                    type="submit"/>
                            {updateResponse.error ? <span
                                className={updateResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + updateResponse.error.key, updateResponse.error.params)}</span> : null}
                            <Button textContent={t('task_edit_cancel')} color="destructive" onClick={() => {
                                setIsEditing(false);
                            }} type="reset"/>

                        </div>
                    </ModalCast>
                </>
            )}
        </Form>
    );
}

export default function TaskShowModal({task, showModal, setShowModal, isInProjectPage, onTaskTap}: {
    task?: ITask,
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    isInProjectPage: boolean,
    onTaskTap: (id: string, force?: boolean) => void
}): [ReactNode, ReactNode] {
    const {t} = useTranslation('projects');

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [editedTaskId, setEditedTaskId] = useState<string>('');
    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('')
    const [editDueAtDate, setEditDueAtDate] = useState<string>('');
    const [editDueAtTime, setEditDueAtTime] = useState<string | null>('');
    const [editRecommendedParticipations, setEditRecommendedParticipations] = useState<number | null>(null);

    function resetTask() {
        const taskDueAt = task!.due_at.split(' ');
        setEditTitle(task!.title);
        setEditDescription(task!.description);
        setEditDueAtDate(taskDueAt[0]);
        setEditDueAtTime(taskDueAt[1]);
        setEditRecommendedParticipations(task!.min_participations);
    }

    const startEdit = (task: ITask) => {
        setIsEditing(true);

        if (!(editedTaskId === task.id)) {
            resetTask();

            setEditedTaskId(task.id);
        }
    }

    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [destroyResponse, setDestroyResponse] = useState<IServerResponse>({success: false, error: null});

    function deleteTask(task: ITask) {
        const destroy = async () => {
            try {

                const response = await fetch(taskDestroy(task.id).url);
                const data: IServerResponse = await response.json();
                // setUpdateResponse(data);
                setDestroyResponse(data);
                return data;
            } catch (e) {
                console.error(e);
            }
        }
        destroy().then(() => {
        });
    }

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
    }

    return ([
        <CustomModal showModal={showModal} onClose={closeModal} id="task-show" key="show">
            {!isEditing ?
                <Show task={task} onCloseModal={closeModal} startEdit={startEdit}
                      deleteTask={() => setShowConfirmationModal(true)} hasProjectContext={isInProjectPage}/>
                :
                <Edit task={task} onCloseModal={closeModal}
                      editTitle={editTitle} setEditTitle={setEditTitle}
                      editDescription={editDescription} setEditDescription={setEditDescription}
                      editDueAtDate={editDueAtDate} setEditDueAtDate={setEditDueAtDate}
                      editDueAtTime={editDueAtTime} setEditDueAtTime={setEditDueAtTime}
                      editRecommendedParticipations={editRecommendedParticipations}
                      setEditRecommendedParticipations={setEditRecommendedParticipations}
                      resetTask={resetTask} setIsEditing={setIsEditing}
                      onTaskTap={onTaskTap}
                />
            }
        </CustomModal>,
        <ConfirmModal title={t('task_delete_warning')}
                      message={t('task_delete_warning_message', {task: task?.title ?? ''})}
                      showModal={showConfirmationModal} onClose={() => {
            setShowConfirmationModal(false);
        }}
                      onConfirm={() => deleteTask(task!)} key="delete"/>
    ]);
}
