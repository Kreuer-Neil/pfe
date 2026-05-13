import {IProject, ITask, ITaskMiniature} from "@/types";
// import {agenda} from '@/routes';
import TaskItem from "@/components/tasks/task-item";
import {ReactNode, useState} from "react";
import {cn} from "@/lib/utils";
import {CalendarClock, ClipboardPlus} from "lucide-react";
import {laravelDateToJsDate, upcomingDateToString,} from "@/helpers/date";
import ShowMore from "@/components/buttons/show-more";
import IconButton from "@/components/buttons/icon-button";
import {useTranslation} from "react-i18next";
import ModalCast from "@/components/modals/modal-cast";
import ModalSection from "@/components/modals/modal-section";
import ProjectIcon from "@/components/icons/project-icon";
import ReactModal from "react-modal";
import {show as tasksShow} from "@/actions/App/Http/Controllers/TaskController";


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

function AddTask() {
    // TODO add role condition and modal apparition
    const {t} = useTranslation('projects');
    return (
        <IconButton icon={ClipboardPlus} textContent={t('add_task')}/>
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
    const {t} = useTranslation('projects');
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
    const [showModal, setShowModal] = useState<boolean>(false);

    function onTaskTap(id: string) {
        // TODO find how to optimize this (and avoid multiple code reception)
        const fetchTask = async (): Promise<ITask | undefined> => {
            try {
                const params = new URLSearchParams();
                params.append('task_id', id);

                const response = await fetch(`${tasksShow(id).url}?${params}`);
                const data: { task: ITask } = await response.json();
                return (data.task);
            } catch (error) {
                console.error(error);
            }
        }
        fetchTask().then((modalTask: ITask | undefined) => {
            if (!modalTask) {
                //     setShowErrorModal(true);
                return;
            }
            setModalTask(modalTask);
            setShowModal(true);
        });
    }

    /*useEffect(() => {
        if (modalTaskId && modalTaskId !== '' && modalTaskId !== '0') {
            const fetchTask = async (): Promise<ITask | undefined> => {
                try {
                    const params = new URLSearchParams();
                    params.append('task_id', modalTaskId);

                    const response = await fetch(`${tasksShow(modalTaskId).url}?${params}`);
                    // console.log(await response.json());
                    const data: { task: ITask } = await response.json();
                    return (data.task);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchTask().then((task: ITask | undefined) => {
                if (!task) {
                    //     setShowErrorModal(true);
                    return;
                }
                setTask(task);
                setShowModal(true);
            });
        }
    }, [modalTaskId]);*/

    const pageId = 'tasks';
    return (
        <section className={cn('items-section', className)} id={pageId}>
            <div className="flex items-center mx-3">
                <h2 className="section-title w-full">{title ?? (project ? t('tasks_container_title', {project: project.name}) : t('task_upcoming_title'))}</h2>
                {project ? <AddTask/> : ''}
            </div>
            {
                tasks.length > 0
                    // Task items
                    ? <TasksList tasks={tasks} projectContext={(project != null)} maxLength={maxItemsLength!}
                        onTapTask={onTaskTap}
                    />
                    : <div className="thumbnails-list-container"><p>{t('task_empty_message')}</p></div>
            }
            <div className="flex flex-col gap-4 px-3 items-center">
                <ShowMore showMore={showMoreState} onClick={onShowMore}/>
                {/*<ButtonText href={agenda().url} textContent={actionText ?? t('task.show_agenda')} icon={LucideCalendarDays}/>*/}
            </div>
            <ReactModal isOpen={showModal} appElement={document.querySelector('body')!} className="mx-2 my-3 max-w-3xl"
                        style={{overlay: {backgroundColor: 'var(--color-modal-behind)'},}}>
                <ModalCast title={modalTask ? modalTask.title : ''} closeModal={() => {
                    setShowModal(false)
                }}>

                    <ModalSection className="border-none">
                        <div className="flex gap-1">
                            <ProjectIcon
                                project={modalTask ? modalTask.project : {name: '', icon: '', slug: '', id: ''}}
                                size="small"/>
                            <p className="item-title">{modalTask ? modalTask.project.name : ''}</p>
                        </div>
                        {modalTask ? modalTask.due_at ?
                            <p className="flex gap-1">
                                <CalendarClock/>{upcomingDateToString(laravelDateToJsDate(modalTask ? modalTask.due_at : ''))}
                            </p> : '' : ''
                        }
                        <p className="mt-1">
                            {modalTask ? modalTask.description : ''}
                        </p>
                    </ModalSection>

                    {/* Modal section */}
                    <ModalSection>
                        test
                    </ModalSection>
                </ModalCast>
            </ReactModal>
        </section>
    );
}
