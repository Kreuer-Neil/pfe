import {IProject, ITask} from "@/types";
// import {agenda} from '@/routes';
import TaskItem from "@/components/tasks/task-item";
import {useLang} from "@/hooks/useLang";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import ButtonText from "@/components/buttons/button-text";
import {ClipboardPlus, LucideCalendarDays, LucideChevronDown} from "lucide-react";
import {laravelDateToJsDate} from "@/helpers/date";


interface TaskDisplayProps {
    tasks: ITask[],
    title?: string | null,
    level?: number,
    className?: string,
    actionText?: string,
    action?: (() => void) | null,
    isInProjectPage?: boolean,
    project?: IProject | null,
}

function TasksList({tasks, projectContext}: { tasks: ITask[], projectContext: boolean }): ReactNode[] {
    const {__} = useLang();
    // TODO fix date problems here
    const length = tasks.length;
    let items: ReactNode[] = tasks.map((task: ITask, i: number) => {
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
    });
    return items;
}

function AddTask() {
    // TODO add role condition and modal apparition
    return (
        <ClipboardPlus className={'icon-btn'}/>
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

    }: TaskDisplayProps,): ReactNode {
    const {__, trans} = useLang();
    return <section className={cn('items-section', className)}>
        <div className="flex items-center mx-3">
            <h2 className="section-title w-full">{title ?? (project ? trans('project.tasks.container_title', {project: project.name}) : __('project.task.title.upcoming'))}</h2>
            {project ? <AddTask/> : ''}
        </div>
        <ol className="thumbnails-list-container">
            {
                tasks
                    // Task items
                    // TODO add "See more" button at the bottom and month separators
                    ? <TasksList tasks={tasks} projectContext={(project != null)}/>
                    : <li><p>{__('project.task.empty_message')}</p></li>
            }
        </ol>
        <div className="flex flex-col gap-4 px-3 items-center">
            <ButtonText onClick={(e):void => {
                // TODO implement later
                // tasks.load(3)
            }} icon={LucideChevronDown} textContent={__('pagination.show_more')}/>
            {/*<ButtonText href={agenda().url} textContent={actionText ?? __('project.task.show_agenda')} icon={LucideCalendarDays}/>*/}
        </div>
    </section>
}
