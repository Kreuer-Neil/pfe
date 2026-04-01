import {ITask} from "@/types";
import TaskItem from "@/components/tasks/task-item";
import {useLang} from "@/hooks/useLang";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import ButtonText from "@/components/buttons/button-text";
import {LucideCalendarDays, LucideChevronDown} from "lucide-react";
import {laravelDateToJsDate} from "@/helpers/date";


interface TaskDisplayProps {
    tasks: ITask[] | null,
    title?: string | null,
    level?: number,
    className?: string,
    actionText?: string,
    action?: (() => void) | null,
}

function RenderTasks(tasks: ITask[]): ReactNode[] {
    const {__} = useLang();
    // TODO fix date problems here
    const length = tasks.length;
    let items: ReactNode[] = tasks.map((task: ITask, i: number) => {
        let month: number = laravelDateToJsDate(task.due_at).getMonth();
        const precedentMonthCondition: boolean = i + 1 < length
            && tasks[i - 1]
            && (month > laravelDateToJsDate(tasks[i - 1].due_at).getMonth());
        return (
            <li className="flex flex-col gap-4 @xl:gap-6" key={task.id.toString()}>
                {precedentMonthCondition ? <span className="month-divider">{__('date.month.' + month)}</span> : ''}
                <TaskItem task={task}/>
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
        action = null
    }: TaskDisplayProps,): ReactNode {
    const {__} = useLang();
    return <section className={cn('items-container', className)}>
        <h2 className={'flex justify-center p-6 py-3 bg-container text-primary-foreground section-title'}>{title ?? __('project.task.title.upcoming')}</h2>
        <ol className={'p-2 @xl:p-5 px-3 @xl:px-6 flex flex-col gap-4 @xl:gap-6 items-center'}>
            {
                tasks
                    // Task items
                    // TODO add "See more" button at the bottom and month separators
                    ? RenderTasks(tasks)
                    : <li><p>{__('project.task.empty_message')}</p></li>
            }
        </ol>
        <div className="flex flex-col gap-3 p-3 pt-2 @xl:px-6 items-center">
            <ButtonText textContent={actionText ?? __('project.task.show_agenda')} icon={LucideCalendarDays}/>
        </div>
    </section>
}
