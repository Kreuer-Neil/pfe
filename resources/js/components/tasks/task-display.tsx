import {IProject, ITask} from "@/types";
// import {agenda} from '@/routes';
import TaskItem from "@/components/tasks/task-item";
import {useLang} from "@/hooks/useLang";
import {ReactNode, useState} from "react";
import {cn} from "@/lib/utils";
import ButtonText from "@/components/buttons/button-text";
import {ClipboardPlus, LucideChevronDown, LucideChevronUp} from "lucide-react";
import {laravelDateToJsDate} from "@/helpers/date";
import ShowMore from "@/components/buttons/show-more";
import IconButton from "@/components/buttons/icon-button";


interface TaskDisplayProps {
    tasks: ITask[],
    title?: string | null,
    level?: number,
    className?: string,
    actionText?: string,
    action?: (() => void) | null,
    isInProjectPage?: boolean,
    project?: IProject | null,
    maxLength?: bigint | null,
}

function TasksList({tasks, projectContext, maxLength}: {
    tasks: ITask[],
    projectContext: boolean,
    maxLength: bigint
}): ReactNode {
    const {__} = useLang();
    const length = tasks.length;

    return <ol className="thumbnails-list-container">
        {tasks.slice(0, Number(maxLength)).map((task: ITask, i: number) => {
            let month: number = laravelDateToJsDate(task.due_at ?? task.created_at).getMonth();
            const precedentMonthCondition: boolean = i + 1 < length
                && tasks[i - 1]
                && (month > laravelDateToJsDate(tasks[i - 1].due_at ?? tasks[i - 1].created_at).getMonth());
            return (
                <li className="w-full flex flex-col gap-4 @xl:gap-6" key={task.id}>
                    {precedentMonthCondition ? <span className="month-divider">{__('date.month.' + month)}</span> : ''}
                    <TaskItem task={task} isInProjectPage={projectContext}/>
                </li>
            );
        })}
    </ol>
}

function AddTask() {
    // TODO add role condition and modal apparition
    const {__} = useLang();
    return (
        <IconButton icon={ClipboardPlus} textContent={__('projects.add_task')}/>
    );
}

export default function TaskDisplay(
    {
        tasks,
        title = null,
        level = 2,
        className = '',
        actionText,
        action = null,
        project = null,
        maxLength = 3n,
    }: TaskDisplayProps,): ReactNode {
    const {__, trans} = useLang();
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

    const pageId = 'tasks';
    return <section className={cn('items-section', className)} id={pageId}>
        <div className="flex items-center mx-3">
            <h2 className="section-title w-full">{title ?? (project ? trans('projects.tasks.container_title', {project: project.name}) : __('projects.task.title.upcoming'))}</h2>
            {project ? <AddTask/> : ''}
        </div>
        {
            tasks.length > 0
                // Task items
                ? <TasksList tasks={tasks} projectContext={(project != null)} maxLength={maxItemsLength!}/>
                : <div className="thumbnails-list-container"><p>{__('projects.task.empty_message')}</p></div>
        }
        <div className="flex flex-col gap-4 px-3 items-center">
            <ShowMore showMore={showMoreState} onClick={onShowMore}/>
            {/*<ButtonText href={agenda().url} textContent={actionText ?? __('projects.task.show_agenda')} icon={LucideCalendarDays}/>*/}
        </div>
    </section>
}
