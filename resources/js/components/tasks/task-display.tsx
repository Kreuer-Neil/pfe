import {ITask} from "@/types";
import TaskItem from "@/components/tasks/task-item";
import {useLang} from "@/hooks/useLang";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import ButtonText from "@/components/buttons/button-text";
import {ClipboardPlus, LucideCalendarDays, LucideChevronDown} from "lucide-react";
import {laravelDateToJsDate} from "@/helpers/date";


interface TaskDisplayProps {
    tasks: ITask[] | null,
    title?: string | null,
    level?: number,
    className?: string,
    actionText?: string,
    action?: (() => void) | null,
    projectContext?: boolean,
}

function RenderTasks({tasks, projectContext}: { tasks: ITask[], projectContext: boolean }): ReactNode[] {
    const {__} = useLang();
    // TODO fix date problems here
    const length = tasks.length;
    let items: ReactNode[] = tasks.map((task: ITask, i: number) => {
        let month: number = laravelDateToJsDate(task.due_at ?? task.created_at).getMonth();
        const precedentMonthCondition: boolean = i + 1 < length
            && tasks[i - 1]
            && (month > laravelDateToJsDate(tasks[i - 1].due_at ?? tasks[i - 1].created_at).getMonth());
        return (
            <li className="w-full flex flex-col gap-4 @xl:gap-6" key={task.id.toString()}>
                {precedentMonthCondition ? <span className="month-divider">{__('date.month.' + month)}</span> : ''}
                <TaskItem task={task} projectContext={projectContext}/>
            </li>
        );
    });

    // TODO Adds the "See more" button function to load more items
    items.push(<ButtonText icon={LucideChevronDown} textContent={__('pagination.show_more')} key={0}/>);
    return items;
}

export default function TaskDisplay(
    {
        tasks,
        title = null,
        level = 2,
        className = '',
        actionText,
        action = null,
        projectContext = false,
    }: TaskDisplayProps,): ReactNode {
    const {__} = useLang();
    return <section className={cn('items-container', className)}>
        <div className={'flex items-center mx-3'}>
            <h2 className={'section-title w-full'}>{title ?? __('project.task.title.upcoming')}</h2>
            <ClipboardPlus className={'icon-btn'}/>
        </div>
        <ol className={'px-2 flex flex-col gap-3 items-center'}>
            {
                tasks
                    // Task items
                    // TODO add "See more" button at the bottom and month separators
                    ? <RenderTasks tasks={tasks} projectContext={projectContext} />
                    : <li><p>{__('project.task.empty_message')}</p></li>
            }
        </ol>
        <div className="flex flex-col gap-3 p-3 pt-2 @xl:px-6 items-center">
            <ButtonText textContent={actionText ?? __('project.task.show_agenda')} icon={LucideCalendarDays}/>
        </div>
    </section>
}
