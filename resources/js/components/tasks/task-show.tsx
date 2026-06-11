import {INote, IServerResponse, ITask} from "@/types";
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CustomModal from "@/components/modals/custom-modal";
import ModalCast from "@/components/modals/modal-cast";
import ModalSection from "@/components/modals/modal-section";
import ProjectIcon from "@/components/icons/project-icon";
import {cn} from "@/lib/utils";
import {CalendarCheck, CalendarClock, ClockAlert, Notebook, NotebookPen, Timer, UsersRound} from "lucide-react";
import PostedBy from "@/components/general-posts/posted-by";
import ButtonText from "@/components/buttons/button-text";
import Button from "@/components/buttons/button";
import {
    participate as taskParticipate,
    update as taskUpdate,
    destroy as taskDestroy,
    cancelParticipation as taskCancelParticipation,
    validate as taskValidation,
} from "@/actions/App/Http/Controllers/TaskController";
import GeneralInput from "@/components/form/general-input";
import {RouteQueryOptions} from "@/wayfinder";
import ConfirmModal from "@/components/modals/confirm-modal";

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

function Show({task, onCloseModal, startEdit, deleteTask}: {
    task: ITask | undefined,
    onCloseModal: () => void,
    startEdit: (task: ITask) => void,
    deleteTask: (task: ITask) => void
}) {
    const {t} = useTranslation(['projects', 'date', 'errors']);

    const [participationResponse, setParticipationResponse] = useState<IServerResponse>({success: false, error: null})

    const participate = () => {
        const askParticipation = async () => {
            try {
                const response = await fetch(taskParticipate(task!.id).url);
                const data: IServerResponse = await response.json();
                return data;
            } catch (e) {
                console.error(e);
            }
        }
        askParticipation().then((value) => {
            if (value?.success) {
                // TODO success modal toast + item reload + page items reload on task-display
                task!.self_participating = true;
            }
            setParticipationResponse(value!)
        });
    }

    const cancelParticipate = () => {
        const removeParticipation = async () => {
            try {
                const response = await fetch(taskCancelParticipation(task!.id).url);
                const data: IServerResponse = await response.json();
                return data;
            } catch (e) {
                console.error(e);
            }
        }
        removeParticipation().then((value) => {
            if (value!.success) {
                task!.self_participating = false;
            }
            setParticipationResponse(value!);
        });
    }

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
            setParticipationResponse(value!)
        });
    }


    return (
        <ModalCast title={task?.title ?? ''} closeModal={onCloseModal}>
            <ModalSection className="border-none">
                <p className="item-title text-with-icon">
                    <ProjectIcon
                        project={task?.project ?? {name: '', icon: '', slug: '', id: ''}}
                        size="small"/>
                    {task?.project.name ?? null}
                </p>
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
                    <p className="text-with-icon mr-auto">
                        {/*<RelatedUsers />*/}
                        {task?.participations_count ? t('task_participations_count', {count: task.participations_count}) : t('task_no_participations')}
                    </p>
                    {task?.min_participations ?
                        <p className="text-with-icon">
                            <UsersRound className="item-tag"/>
                            {t('task_recommended_participations_count', {count: task.min_participations})}
                        </p> : null
                    }
                </div>
                {task?.self_participating ?
                    <p className="text-with-icon">
                        <CalendarCheck className="item-tag bg-tag"/>
                        {t('task_self_participating')}
                    </p> : null}
                {/*modalTask.due_at > Date.now()*/}
                {task?.due_at && false &&
                    <p className="flex gap-1">
                        <ClockAlert className="item-tag bg-tag-warning"/>
                        {t('task_due_soon')}
                    </p>}
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
                {task?.self_participating ?
                    <Button textContent={t('task_cancel_participate')} onClick={cancelParticipate}
                            color="destructive"/> :
                    <Button textContent={t('task_participate')} onClick={participate}/>
                }
                {task?.self_participating &&
                    <Button textContent={t('task_validate')} onClick={validate}/>
                }
                {participationResponse.error && <span
                    className={participationResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + participationResponse.error.key, participationResponse.error.params)}</span>}
                {task?.isOwner &&
                    <div className="grid md:grid-cols-2 gap-1 justify-center w-full max-w-md">
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
        setEditTitle,
        editDescription,
        setEditDescription,
        editDueAtDate,
        setEditDueAtDate,
        editDueAtTime,
        setEditDueAtTime,
        editRecommendedParticipations,
        setEditRecommendedParticipations,
        resetTask,
        setIsEditing
    }: EditProps): ReactNode {
    const {t} = useTranslation(['projects', 'date']);

    const [updateResponse, setUpdateResponse] = useState<IServerResponse>({success: false, error: null});

    async function update(e: Event) {
        e.preventDefault();
        // TODO check if fields still have errors
        // if (!(formError.title || formError.description || formError.due_date || formError.due_time || formError.min_participations)) {
        const sendUpdateData = async () => {
            try {
                const queryOptions: RouteQueryOptions = {
                    query: {
                        "title": editTitle,
                        "description": editDescription,
                        "due_at": `${editDueAtDate} ${editDueAtTime}`,
                        "min_participations": editRecommendedParticipations?.toString() ?? null
                    }
                }

                const response = await fetch(taskUpdate(task!.id, queryOptions).url);
                const data: IServerResponse = await response.json();
                setUpdateResponse(data);
                return data;
            } catch (e) {
                console.error(e);
            }
        }
        sendUpdateData().then((value) => {
            // if (value?.success) {
            // TODO Toast ?
            // }
        });
        // }
    }

    const title =
        <GeneralInput name="task_title" label={t('task_title')} required={true} value={editTitle}
                      setValue={setEditTitle} style="text"/>
    return (
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
                                  value={editDueAtDate} setValue={setEditDueAtDate} required={true}/>
                    <GeneralInput name="due_at_time" label={t('due_at_time')} style="text" type="time"
                                  value={editDueAtTime ?? ''} setValue={setEditDueAtTime}/>
                </p>

                <p className="mt-1">
                    <GeneralInput name="task_description" label={t('task_description')} value={editDescription}
                                  setValue={setEditDescription} type="textarea" style="text"
                                  inputClassName="w-full min-h-0"/>
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
                        <GeneralInput name="task_recomended_participations" type="number"
                                      style="text" inputClassName="w-fit max-w-[40vw]"
                                      label={t('task_recommended_participations_count', {count: '0'})}
                                      value={editRecommendedParticipations?.toString() ?? ''}
                                      setValue={setEditRecommendedParticipations}/>
                    </p>
                </div>
                {task?.self_participating ?
                    <p className="text-with-icon">
                        <CalendarCheck className="item-tag bg-tag"/>
                        {t('task_self_participating')}
                    </p> : null}
                {/*modalTask.due_at > Date.now()*/}
                {task?.due_at && false ?
                    <p className="flex gap-1">
                        <ClockAlert className="item-tag bg-tag-warning"/>
                        {t('task_due_soon')}
                    </p> : null}
            </ModalSection>
            <ModalSection title={t('task_note_title')} icon={Notebook}>
                <NotesList task={task}/>

            </ModalSection>
            <div className="flex flex-col gap-3 px-2">
                <Button color="edit" textContent={t('task_confirm_changes')} onClick={update}/>
                {updateResponse.error ? <span
                    className={updateResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + updateResponse.error.key, updateResponse.error.params)}</span> : null}
                <Button textContent={t('task_edit_cancel')} color="destructive" onClick={() => {
                    setIsEditing(false);
                    resetTask();
                }}/>
            </div>
        </ModalCast>
    );
}

export default function TaskShowModal({task, showModal, setShowModal}: {
    task?: ITask,
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>
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
        destroy().then((value) => {
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
                      deleteTask={() => setShowConfirmationModal(true)}/>
                :
                <Edit task={task} onCloseModal={closeModal}
                      editTitle={editTitle} setEditTitle={setEditTitle}
                      editDescription={editDescription} setEditDescription={setEditDescription}
                      editDueAtDate={editDueAtDate} setEditDueAtDate={setEditDueAtDate}
                      editDueAtTime={editDueAtTime} setEditDueAtTime={setEditDueAtTime}
                      editRecommendedParticipations={editRecommendedParticipations}
                      setEditRecommendedParticipations={setEditRecommendedParticipations}
                      resetTask={resetTask} setIsEditing={setIsEditing}
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
