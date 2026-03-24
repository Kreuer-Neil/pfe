import {CalendarCheck, Timer} from "lucide-react";
import TaskIconParticipation from "@/components/tasks/items/task-icon-participation";
import {ITask, ITaskItem} from "@/types";
import {useLang} from "@/hooks/useLang";



function ParticipatingIcon({participating}:{participating:boolean}) {
    if (participating) {
    return <CalendarCheck
        // title={"You are participating"}
        className={"widget-item-icon"}/>;
    }
}
// TODO find where to put the link
export default function TaskItem({task, className = ''}:{task: ITask, className?:string}) {
    const {__} = useLang();
    return (
        <article className={"widget-item " + (className??'') }>
            {/* TODO add open on click and not drag, see bsky duckduckgo etc. */}
            <h3 className={"widget-item-title"}>{task.title}</h3>

            <p>{task.description}</p>
            <div className={"taskinfo mt-1 flex justify-between items-center"}>
                <time className={"pl-1 flex gap-1"}><Timer/><span className={"mt-1 text-sm"}>{task.due_at.toDateString()}</span></time>
                {/* TODO fix date string (or translate on a different property in the controller) */}
                <div className={"flex gap-1"}>
                    { /* TODO add PFPs of participating people */ }
                    <TaskIconParticipation participations={participations} min={task.min_participations} />
                    <ParticipatingIcon participating={participating} />
                </div>
            </div>
            <PostedBy />
        </article>
    );
}
