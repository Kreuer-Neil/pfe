import {IProject, ITask, ITaskMiniature} from "@/types";
// import {agenda} from '@/routes';
import TaskItem from "@/components/tasks/task-item";
import {ReactNode, useState} from "react";
import {cn} from "@/lib/utils";
import {
    ClipboardPlus,
} from "lucide-react";
import {laravelDateToJsDate,} from "@/helpers/date";
import ShowMore from "@/components/buttons/show-more";
import IconButton from "@/components/buttons/icon-button";
import {useTranslation} from "react-i18next";
import {show as tasksShow} from "@/actions/App/Http/Controllers/TaskController";
import TaskCreateModal from "@/components/tasks/task-create";
import TaskShowModal from "@/components/tasks/task-show";
import {RouteQueryOptions} from "@/wayfinder";


type TaskDisplayProps = {
    tasks: ITaskMiniature[];
    title?: string | null;
    className?: string;
    action?: (() => void) | null;
    isInProjectPage?: boolean;
    project?: IProject | null;
    maxLength?: bigint;
}

function TasksList({tasks, projectContext, maxLength, onTapTask}: {
    tasks: ITaskMiniature[];
    projectContext: boolean;
    maxLength: bigint;
    onTapTask: (id: string) => void;
}): ReactNode {
    const {t} = useTranslation(['date', 'projects']);
    const length = tasks.length;

    if (length <= 0) {
        return <div className="thumbnails-list-container"><p>{t('projects:task_empty_message')}</p></div>
    }

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


export default function TaskDisplay(
    {
        tasks,
        title = null,
        className = '',
        project = null,
        maxLength = 3n,
    }: TaskDisplayProps): ReactNode {
    {/* TODO use flash data for tasks? Needs auto-update */}

    const {t} = useTranslation(['projects', 'date']);
    const [maxItemsLength, setMaxItemsLength] = useState(maxLength);
    const [showMoreState, setShowMoreState] = useState(true);

    const onShowMore = (): void => {
        if (maxItemsLength != maxLength) {
            setMaxItemsLength(maxLength);
            setShowMoreState(true);
        } else {
            setMaxItemsLength(12n);
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
                    const params: RouteQueryOptions = {query: {'task_id': id}};

                    const response = await fetch(tasksShow(id, params).url);

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
        <section className={cn('items-section max-w-xl', className)} id={pageId}>
            <div className="flex items-center mx-3">
                <h2 className="section-title w-full">{title ?? (project ? t('tasks_container_title', {project: project.name}) : t('task_upcoming_title'))}</h2>
                {project &&
                    <IconButton icon={ClipboardPlus} textContent={t('add_task')}
                                onClick={() => setShowCreateModal(true)}/>}
            </div>
            <TasksList tasks={tasks} projectContext={(project != null)} maxLength={maxItemsLength!}
                       onTapTask={onTaskTap}/>
            <div className="flex flex-col gap-4 px-3 items-center">

                {tasks.length > Number(maxLength) && <ShowMore showMore={showMoreState} onClick={onShowMore}/>}
                {/*<ButtonText href={agenda().url} textContent={actionText ?? t('task.show_agenda')} icon={LucideCalendarDays}/>*/}
            </div>
            <TaskShowModal task={modalTask} showModal={showTaskModal} setShowModal={setShowTaskModal}/>
            {project &&
                <TaskCreateModal showModal={showCreateModal} setShowModal={setShowCreateModal}
                                 project={project}/>
                }
        </section>
    );
}
