import {ITask} from "@/types";
import TaskItem from "@/components/tasks/task-item";
import {useLang} from "@/hooks/useLang";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import TextButton from "@/components/buttons/text-button";
import {LucideCalendarDays, LucideChevronDown} from "lucide-react";


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
    let items: ReactNode[] = tasks.map((task: ITask, i: number) => {
        return <TaskItem task={task} key={i}/>;
    });

    // TODO add separator between months

    // TODO Adds the "See more" button to load more items
    // items.push(<SeeMoreButton />);
    items.push(<TextButton icon={LucideChevronDown} textContent={__('pagination.show_more')}/>);
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
        <h2 className={'flex justify-center p-6 py-3 bg-primary text-primary-foreground section-title'}>{title ?? __('project.task.title.upcoming')}</h2>
        <div className={'p-2 @xl:p-5 px-3 @xl:px-6 flex flex-col gap-4 @xl:gap-6 items-center'}>
            {
                tasks
                    // Task items
                    // TODO add "See more" button at the bottom and month separators
                    ? RenderTasks(tasks)
                    : <p>{__('project.task.empty_message')}</p>
            }
        </div>
        <div className="flex flex-col gap-3 p-3 pt-2 @xl:px-6 items-center">
            <TextButton textContent={actionText ?? __('project.task.show_agenda')} icon={LucideCalendarDays}/>
        </div>
    </section>
}
