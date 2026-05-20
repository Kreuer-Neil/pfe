import {INote, IProject, ISubmitError, ITask, ITaskMiniature} from "@/types";
// import {agenda} from '@/routes';
import TaskItem from "@/components/tasks/task-item";
import {Dispatch, ReactNode, SetStateAction, useState} from "react";
import {cn} from "@/lib/utils";
import {
    CalendarCheck,
    CalendarClock,
    ClipboardCopy,
    ClipboardPlus,
    ClockAlert,
    Notebook,
    NotebookPen,
    UsersRound
} from "lucide-react";
import {laravelDateToJsDate,} from "@/helpers/date";
import ShowMore from "@/components/buttons/show-more";
import IconButton from "@/components/buttons/icon-button";
import {useTranslation} from "react-i18next";
import ModalCast from "@/components/modals/modal-cast";
import ModalSection from "@/components/modals/modal-section";
import ProjectIcon from "@/components/icons/project-icon";
import {show as tasksShow} from "@/actions/App/Http/Controllers/TaskController";
import CustomModal from "@/components/modals/custom-modal";
import PostedBy from "@/components/general-posts/posted-by";
import ButtonText from "@/components/buttons/button-text";
import Button from "@/components/buttons/button";
import auth from "@/actions/App/Http/Controllers/Auth";
import GeneralInput from "@/components/form/general-input";
import {Switch} from "@headlessui/react";


interface TaskDisplayProps {
    tasks: ITaskMiniature[];
    title?: string | null;
    className?: string;
    action?: (() => void) | null;
    isInProjectPage?: boolean;
    project?: IProject | null;
    maxLength?: bigint | null;
}

function TasksList({tasks, projectContext, maxLength, onTapTask}: {
    tasks: ITaskMiniature[];
    projectContext: boolean;
    maxLength: bigint;
    onTapTask: (id: string) => void;
}): ReactNode {
    const {t} = useTranslation('date');
    const length = tasks.length;

    return <ul className="thumbnails-list-container">
        {tasks.slice(0, Number(maxLength)).map((task: ITaskMiniature, i: number) => {
            let month: number = laravelDateToJsDate(task.due_at ?? task.created_at).getMonth();
            const precedentMonthCondition: boolean = i + 1 < length
                && tasks[i - 1]
                && (month > laravelDateToJsDate(tasks[i - 1].due_at ?? tasks[i - 1].created_at).getMonth());
            return (
                <li className="w-full flex flex-col gap-4" key={task.id}>
                    {precedentMonthCondition ? <span className="month-divider">{t('month_' + month)}</span> : ''}
                    <TaskItem task={task} isInProjectPage={projectContext}
                              onTap={onTapTask}
                    />
                </li>
            );
        })}
    </ul>
}

function TaskModal({modalTask, showModal, setShowModal}: {
    modalTask?: ITask,
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>
}) {
    const {t} = useTranslation(['projects', 'date']);
    return (
        <CustomModal showModal={showModal} setShowModal={setShowModal} id="task-show">
            <ModalCast title={modalTask?.title ?? ''} closeModal={() => setShowModal(false)}>
                <ModalSection className="border-none">
                    <p className="item-title text-with-icon">
                        <ProjectIcon
                            project={modalTask?.project ?? {name: '', icon: '', slug: '', id: ''}}
                            size="small"/>
                        {modalTask?.project.name ?? null}
                    </p>
                    {/* TODO fix date */}
                    {modalTask?.due_at ?
                        <p className={cn("flex gap-1", modalTask?.due_at ? '' : 'hidden')}>
                            <CalendarClock/>{modalTask.due_at}
                        </p> : null
                    }
                    <p className="mt-1">
                        {modalTask?.description ?? null}
                    </p>
                </ModalSection>
                <ModalSection>
                    <div className="flex wrap">
                        <p className="text-with-icon mr-auto">
                            {/*<RelatedUsers />*/}
                            {modalTask?.participations_count ? t('task_participations_count', {count: modalTask.participations_count}) : null}
                        </p>
                        {modalTask?.min_participations ?
                            <p className="text-with-icon">
                                <UsersRound className="item-tag"/>
                                {t('task_recommended_participations_count', {count: modalTask.min_participations})}
                            </p> : null
                        }
                    </div>
                    {modalTask?.self_participating ?
                        <p className="text-with-icon">
                            <CalendarCheck className="item-tag bg-tag-valid"/>
                            {t('task_self_participating')}
                        </p> : null}
                    {/*modalTask.due_at > Date.now()*/}
                    {modalTask?.due_at && false ?
                        <p className="flex gap-1">
                            <ClockAlert className="item-tag bg-tag-warning"/>
                            {t('task_due_soon')}
                        </p> : null}
                </ModalSection>
                <ModalSection title={t('task_note_title')} icon={Notebook}>
                    {modalTask?.notes && modalTask.notes.length > 0 ?
                        <ul className="flex flex-col gap-2">
                            {modalTask.notes.map((note: INote) => {
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
                    <Button textContent={t('task_participate')}/>
                }
                {/* TODO replace with current user ID */}
                {modalTask?.owner?.id === '' ?
                    <Button textContent={t('task_edit')} color="edit"/>
                    : null}
            </ModalCast>
        </CustomModal>
    );
}


function TaskCreateModal({showModal, setShowModal, project}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    project: IProject,
}) {
    const {t} = useTranslation('projects');

    const [taskName, setTaskName] = useState<string>('');

    function taskNameValidation(value: string): null | ISubmitError {
        if ((!value) || value === '') {
            return {key: 'field_required', params: {fieldName: 'title'}};
        }
        if (value.length <= 6) {
            return {key:'field_min_length',params:{length: '6', fieldName: 'title'}}
        }
            return null;
    }

    const [taskDescription, setTaskDescription] = useState<string>('');
    const [taskDueDate, setTaskDueDate] = useState<string>('');
    const [createError, setCreateError] = useState<string | null>(null);

    // const testArray = ['ara', 'bill', 'case', 'dice'];
    // const [testItems, setTestItems] = useState<Array<string>>([]);

    async function create() {
        if (
            // Use form onChange check fn for each
            (taskName && taskName !== '')
            &&
            (taskDescription && taskDescription !== '')
            &&
            (taskDueDate && taskDueDate !== '')
        ) {
            // try
        }
    }

    return (
        <CustomModal showModal={showModal} setShowModal={setShowModal} id="task-create">
            <ModalCast title={t('task_create_for_project', {project: project.name})}
                       closeModal={() => setShowModal(false)} className="w-full"
                       element="form">
                <ModalSection as="fieldset" title={t('task_base_informations')}>
                    <input type="hidden" name="project_id" id="project_id" value={project.id}/>
                    <GeneralInput name="task_name" label={t('task_form_title')}
                                  placeholder={t('task_form_title_placeholder')} validation={taskNameValidation}
                                  value={taskName} setValue={setTaskName} required={true} autoFocus={true}/>
                    <GeneralInput name="task_desc" label={t('task_form_description')} type="textarea"
                                  placeholder={t('task_form_description_placeholder')}
                                  value={taskDescription} setValue={setTaskDescription} required={true}/>
                </ModalSection>
                <ModalSection as="fieldset" title={t('task_form_date')}>
                    {/* TODO switch
                        <div className="flex">
                            <span className="mr-auto">{t('task_form_starting_time')}</span>
                            <button />
                        </div>*/}
                    <div className="grid grid-cols-2 gap-2">
                        <GeneralInput name="due_date" label={t('task_form_due_date')} type="date" required={true}
                                      value={taskDueDate} setValue={setTaskDueDate}/>
                        <GeneralInput name="due_time" label={t('task_form_due_time')} type="time" required={true}
                                      value={taskDueDate} setValue={setTaskDueDate}/>

                        {/*<label htmlFor="due_date" className="flex flex-col gap-1">
                            <input type="text" list="test" className="input" onChange={(e) => {
                                if (testArray.includes(e.currentTarget.value) && !testItems.includes(e.currentTarget.value)) {
                                    testItems.push(e.currentTarget.value);
                                    setTestItems(testItems);
                                    e.currentTarget.value = '';
                                }
                            }}/>

                            <datalist id="test">
                                {
                                    testArray.map((item) => {
                                        return (
                                            <option value={item} key={item}>{item}</option>
                                        );
                                    })
                                }
                            </datalist>
                            <select name="due_date" id="due_date">
                            <option value={'test'}>

                            </option>
                        </select>
                        </label>
                        <ul>
                            {testItems.length > 0 ? testItems.map((item) => {
                                    return <li onClick={() => {
                                        setTestItems(testItems.splice(testItems.indexOf(item), 1));
                                    }}>{item}</li>
                                })
                                : null
                            }
                        </ul>*/}
                    </div>
                </ModalSection>
                <div className="flex flex-col gap-3 px-2">
                    <Button textContent={t('task_create_button')} type="submit" onClick={create}/>
                    {createError ? <span className="field-error">{createError}</span> : null}
                    <ButtonText icon={ClipboardCopy} textContent={t('task_create_fill')}/>
                </div>
            </ModalCast>
        </CustomModal>
    );
}

export default function TaskDisplay(
    {
        tasks,
        title = null,
        className = '',
        project = null,
        maxLength = 3n,
    }: TaskDisplayProps): ReactNode {
    const {t} = useTranslation(['projects', 'date']);
    const [maxItemsLength, setMaxItemsLength] = useState(maxLength);
    // const [showMoreIcon, setShowMoreIcon] = useState(LucideChevronDown);
    const [showMoreState, setShowMoreState] = useState(true);

    const onShowMore = (e: any): void => {

        if (maxItemsLength != maxLength) {
            setMaxItemsLength(maxLength);
            setShowMoreState(true);
        } else {
            setMaxItemsLength(maxLength! * 2n);
            setShowMoreState(false);
        }
    }

    const [modalTask, setModalTask] = useState<ITask>();
    const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [savedTasks, setSavedTasks] = useState<ITask[]>([]);

    function onTaskTap(id: string) {
        const idNumber = Number(id);
        if (!savedTasks[idNumber]) {
            const fetchTask = async (): Promise<ITask | undefined> => {
                try {
                    const params = new URLSearchParams();
                    params.append('task_id', id);

                    const response = await fetch(`${tasksShow(id).url}?${params}`);
                    const data: { task: ITask } = await response.json();
                    return (data.task);
                } catch (error) {
                    // TODO handle errors with error modal
                    console.error(error);
                }
            }
            fetchTask().then((modalTask: ITask | undefined) => {
                if (!modalTask) {
                    //     setShowErrorModal(true);
                    return;
                }
                savedTasks[idNumber] = modalTask;
                setSavedTasks(savedTasks);

                setModalTask(modalTask);
                setShowTaskModal(true);
            });
        } else {
            setModalTask(savedTasks[idNumber])
            setShowTaskModal(true);
        }
    }

    const pageId = 'tasks';
    return (
        <section className={cn('items-section', className)} id={pageId}>
            <div className="flex items-center mx-3">
                <h2 className="section-title w-full">{title ?? (project ? t('tasks_container_title', {project: project.name}) : t('task_upcoming_title'))}</h2>
                {project ?
                    <IconButton icon={ClipboardPlus} textContent={t('add_task')}
                                onClick={() => setShowCreateModal(true)}/>
                    : null}
            </div>
            {
                tasks.length > 0
                    // Task items
                    ? <TasksList tasks={tasks} projectContext={(project != null)} maxLength={maxItemsLength!}
                                 onTapTask={onTaskTap}/>
                    : <div className="thumbnails-list-container"><p>{t('task_empty_message')}</p></div>
            }
            <div className="flex flex-col gap-4 px-3 items-center">
                <ShowMore showMore={showMoreState} onClick={onShowMore}/>
                {/*<ButtonText href={agenda().url} textContent={actionText ?? t('task.show_agenda')} icon={LucideCalendarDays}/>*/}
            </div>
            <TaskModal modalTask={modalTask} showModal={showTaskModal} setShowModal={setShowTaskModal}/>
            {project ?
                <TaskCreateModal showModal={showCreateModal} setShowModal={setShowCreateModal}
                                 project={project}/>
                : null}
        </section>
    );
}
