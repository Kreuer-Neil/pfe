import {ITask} from "@/types";
import TaskItem from "@/components/tasks/task-item";
import {useLang} from "@/hooks/useLang";
import {ReactNode} from "react";

function TaskContainer({tasks}: { tasks: ITask[] | null }) {
    const {__} = useLang();
    if (!tasks) {
        return (
            <div className={'tasklist-container'}>
                <p>{__('project.task.empty_message')}</p>
            </div>
        );
    }

    return (
        <div className={'tasklist-container'}>
            {tasks!.map((task: ITask) => {
                return <TaskItem task={task}/>
            })}
        </div>
    );
}

export default function TaskDisplay(
    {
        tasks,
        title = 'upcoming tasks',
        level = 2,
        className = ''
    }: {
        tasks: ITask[] | null,
        title?: string,
        level?: number,
        className?: string,
    },):ReactNode {

    return <section className={'tasklist ' + className}>
        <h2 className={'tasklist-header'}>{title}</h2>
        <TaskContainer tasks={tasks}/>
    </section>
}
