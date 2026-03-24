import {ITask} from "@/types";
import TaskItem from "@/components/tasks/items/task-item";

export default function TaskContainer(
    {
        tasks,
        title = 'upcoming tasks',
        level = 2,
        className = ''
    }: {
        tasks: ITask[],
        title?: string,
        level?: number,
        className?: string,
    },) {

    return <section className={'tasklist '+className}>
        <h2 className={'tasklist-header'}>{level}</h2>
        <div className={'tasklist-container'}>
            {tasks.map((task) => {
                return <TaskItem task={task}/>
            })}
        </div>
    </section>
}
