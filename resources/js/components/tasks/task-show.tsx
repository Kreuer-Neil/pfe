import {INote, IServerResponse, ITask} from "@/types";
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CustomModal from "@/components/modals/custom-modal";
import ModalCast from "@/components/modals/modal-cast";
import ModalSection from "@/components/modals/modal-section";
import ProjectIcon from "@/components/icons/project-icon";
import {cn} from "@/lib/utils";
import {CalendarCheck, CalendarClock, ClockAlert, Notebook, NotebookPen, UsersRound} from "lucide-react";
import PostedBy from "@/components/general-posts/posted-by";
import ButtonText from "@/components/buttons/button-text";
import Button from "@/components/buttons/button";
import {participate as taskParticipate, update as taskUpdate} from "@/actions/App/Http/Controllers/TaskController";
import GeneralInput from "@/components/form/general-input";
import {RouteQueryOptions} from "@/wayfinder";

type EditProps = {
    task: ITask | undefined,
    onCloseModal: () => void,
    editTitle: string,
    setEditTitle: Dispatch<SetStateAction<string>>,
    editDescription: string,
    setEditDescription: Dispatch<SetStateAction<string>>,
    editDueAtDate: string,
    setEditDueAtDate: Dispatch<SetStateAction<string>>,
    editDueAtTime: string | null,
    setEditDueAtTime: Dispatch<SetStateAction<string | null>>,
    editRecommendedParticipations: number | null,
    setEditRecommendedParticipations: Dispatch<SetStateAction<number | null>>,
}

function Show({task, onCloseModal, startEdit}: {
    task: ITask | undefined,
    onCloseModal: () => void,
    startEdit: (task: ITask) => void
}) {
    const {t} = useTranslation(['projects', 'date']);

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
                {task?.due_at ?
                    <p className={cn("flex gap-1", task?.due_at ? '' : 'hidden')}>
                        <CalendarClock/>{task.due_at}
                    </p> : null
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
                        <CalendarCheck className="item-tag bg-tag-valid"/>
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
                <ButtonText textContent={t('task_note_add')} icon={NotebookPen} className="self-center"
                            onClick={() => {
                                // TODO note creation logic
                            }} autoFocus={true}/>
            </ModalSection>
            <div className="flex flex-col gap-3 px-2">
                <Button textContent={t('task_participate')} onClick={participate}/>
                {participationResponse.error ? <span
                    className={participationResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + participationResponse.error.key, participationResponse.error.params)}</span> : null}
                {/* TODO replace with current user ID */}
                {task?.isOwner ?
                    <Button textContent={t('task_edit')} color="edit" onClick={() => startEdit(task)}/>
                    : null}
            </div>
        </ModalCast>
    );
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
        setEditRecommendedParticipations
    }: EditProps): ReactNode {
    const {t} = useTranslation(['projects', 'date']);

    const [updateResponse, setUpdateResponse] = useState<IServerResponse>({success: false, error: null});

    async function update(e: Event) {
        e.preventDefault();
        // TODO check if fields still have errors
        // if (!(formError.title || formError.description || formError.due_date || formError.due_time || formError.min_participations)) {
        const sendCreateData = async () => {
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
        sendCreateData().then((value) => {
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
                        <CalendarCheck className="item-tag bg-tag-valid"/>
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
                <ButtonText textContent={t('cancel')} type="destroy"/>
            </div>
        </ModalCast>
    );
}

export default function TaskShowModal({task, showModal, setShowModal}: {
    task?: ITask,
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>
}): ReactNode {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [editedTaskId, setEditedTaskId] = useState<string>('');
    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('')
    const [editDueAtDate, setEditDueAtDate] = useState<string>('');
    const [editDueAtTime, setEditDueAtTime] = useState<string | null>('');
    const [editRecommendedParticipations, setEditRecommendedParticipations] = useState<number | null>(null);

    const startEdit = (task: ITask) => {
        setIsEditing(true);

        if (!(editedTaskId === task.id)) {
            const taskDueAt = task.due_at.split(' ');
            setEditTitle(task.title);
            setEditDescription(task.description);
            setEditDueAtDate(taskDueAt[0]);
            setEditDueAtTime(taskDueAt[1]);
            setEditRecommendedParticipations(task.min_participations);

            setEditedTaskId(task.id);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
    }
    return (
        <CustomModal showModal={showModal} setShowModal={setShowModal} id="task-show">
            {
                !isEditing ? <Show task={task} onCloseModal={closeModal} startEdit={startEdit}/>
                    :
                    <Edit task={task} onCloseModal={closeModal}
                          editTitle={editTitle} setEditTitle={setEditTitle}
                          editDescription={editDescription} setEditDescription={setEditDescription}
                          editDueAtDate={editDueAtDate} setEditDueAtDate={setEditDueAtDate}
                          editDueAtTime={editDueAtTime} setEditDueAtTime={setEditDueAtTime}
                          editRecommendedParticipations={editRecommendedParticipations}
                          setEditRecommendedParticipations={setEditRecommendedParticipations}
                    />
            }
        </CustomModal>
    );
}
