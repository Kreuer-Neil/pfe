import {INote, IServerResponse, ITask} from "@/types";
import {Dispatch, ReactNode, SetStateAction, useState} from "react";
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
import {participate as taskParticipate} from "@/actions/App/Http/Controllers/TaskController";

export default function TaskShowModal({task, showModal, setShowModal}: {
    task?: ITask,
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>
}): ReactNode {
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
        <CustomModal showModal={showModal} setShowModal={setShowModal} id="task-show">
            <ModalCast title={task?.title ?? ''} closeModal={() => setShowModal(false)}>
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
                    {task?.notes && task.notes.length > 0 ?
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
                        : <p>{t('task_note_empty')}</p>
                    }
                    <ButtonText textContent={t('task_note_add')} icon={NotebookPen} className="self-center"
                                onClick={() => {
                                    // TODO note creation logic
                                }} autoFocus={true}/>
                </ModalSection>
                {
                    <Button textContent={t('task_participate')} onClick={participate}/>
                }
                {participationResponse.error ? <span
                    className={participationResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + participationResponse.error.key, participationResponse.error.params)}</span> : null}
                {/* TODO replace with current user ID */}
                {task?.isOwner ?
                    <Button textContent={t('task_edit')} color="edit"/>
                    : null}
            </ModalCast>
        </CustomModal>
    );
}
