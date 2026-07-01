import {IProject, ITask, SharedData} from "@/types";
import TaskItem from "@/components/tasks/task-item";
import {ReactNode, useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {ClipboardPlus} from "lucide-react";
import {laravelDateToJsDate} from "@/helpers/date";
import ShowMore from "@/components/general-posts/show-more";
import {useTranslation} from "react-i18next";
import TaskCreateModal from "@/components/tasks/task-create";
import TaskShowModal from "@/components/tasks/task-show";
import ConfirmModal from "@/components/modals/confirm-modal";
import {usePage, router, Form} from "@inertiajs/react";
import {Button} from "@/components/ui/button";
import TaskController from "@/actions/App/Http/Controllers/TaskController";

type TaskDisplayProps = {
    tasks: ITask[];
    title?: string | null;
    className?: string;
    isInProjectPage?: boolean;
    project?: IProject | null;
    minLength?: number;
    maxLength?: number;
}

function TasksList({tasks, isInProjectPage, maxLength, onTapTask}: {
    tasks: ITask[];
    isInProjectPage: boolean;
    maxLength: number;
    onTapTask: (i: number) => void;
}): ReactNode {
    const {t} = useTranslation(['date', 'projects']);

    if (tasks.length <= 0) {
        return (
            <div className="thumbnails-list-container">
                <p>{t('projects:task_empty_message')}</p>
            </div>
        );
    }


    console.log(tasks[0].notes)

    return (
        <ul className="thumbnails-list-container">
            {tasks.slice(0, maxLength).map((task: ITask, i: number) => {
                const month = laravelDateToJsDate(task.due_at ?? task.created_at).getMonth();
                const showMonthDivider = i > 0
                    && month !== laravelDateToJsDate(tasks[i - 1].due_at ?? tasks[i - 1].created_at).getMonth();

                return (
                    <li key={task.id} className="w-full flex flex-col gap-4">
                        {showMonthDivider &&
                            <span className="month-divider">{t('date:month_' + month)}</span>
                        }
                        <TaskItem
                            task={task}
                            isNotInProjectPage={isInProjectPage}
                            onTap={() => onTapTask(i)}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export default function TaskDisplay({
                                        tasks,
                                        title = null,
                                        className = '',
                                        project = null,
                                        minLength = 3,
                                        maxLength = 12,
                                    }: TaskDisplayProps): ReactNode {
    const {auth} = usePage<SharedData>().props;
    const {t} = useTranslation(['projects', 'date']);

    const [maxItemsLength, setMaxItemsLength] = useState<number>(minLength);
    const [showMore, setShowMore] = useState<boolean>(true);

    const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [deleteSuccess, setDeleteSuccess] = useState<string | undefined>(undefined);

    const onShowMore = () => {
        if (maxItemsLength !== minLength) {
            setMaxItemsLength(minLength);
            setShowMore(true);
        } else {
            setMaxItemsLength(maxLength);
            setShowMore(false);
        }
    };
    const [modalTaskIndex, setModalTaskIndex] = useState<number | undefined>(undefined);
    const modalTask = modalTaskIndex !== undefined ? tasks[modalTaskIndex] : undefined;

    const onTaskTap = (index: number) => {
        setModalTaskIndex(index);
        setShowTaskModal(true);
    };

    useEffect(() => {
        return router.on('flash', (e) => {
            const flash = e.detail.flash;
            if (flash?.task_delete_success) {
                setShowTaskModal(false);
                setShowConfirmModal(false);
                setDeleteSuccess(t('task_delete_success', {task: flash.task_name}));
            }
        });
    }, []);

    return (
        <section className={cn('items-section max-w-xl', className)} id="tasks">
            <div className="flex items-center mx-3">
                <h2 className="section-title w-full">
                    {title ?? (project
                            ? t('tasks_container_title', {project: project.name})
                            : t('task_upcoming_title')
                    )}
                </h2>
                {project?.owner.id === auth.user.id &&
                    <Button size="icon" variant="outline" onClick={() => setShowCreateModal(true)}>
                        <span className="sr-only">{t('task_add')}</span>
                        <ClipboardPlus/>
                    </Button>
                }
            </div>

            <TasksList
                tasks={tasks}
                isInProjectPage={project === null}
                maxLength={maxItemsLength}
                onTapTask={onTaskTap}
            />

            <div className="flex flex-col gap-4 px-3 items-center">
                {deleteSuccess && <p className="text-sm text-muted-foreground">{deleteSuccess}</p>}
                {tasks.length > minLength &&
                    <ShowMore showMore={showMore} onClick={onShowMore}/>
                }
            </div>

            <TaskShowModal
                task={modalTask}
                showModal={showTaskModal}
                setShowModal={setShowTaskModal}
                isInProjectPage={project === null}
                onDelete={() => setShowConfirmModal(true)}
            />

            {modalTask &&
                <ConfirmModal
                    id="task-confirm-delete"
                    showModal={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    formAction={TaskController.destroy.form(modalTask.id)}
                    onConfirm={() => {}}
                    title={t('task_delete_warning')}
                    message={t('task_delete_warning_message', {task: modalTask.title})}
                />
            }

            {project &&
                <TaskCreateModal
                    showModal={showCreateModal}
                    setShowModal={setShowCreateModal}
                    project={project}
                />
            }
        </section>
    );
}
