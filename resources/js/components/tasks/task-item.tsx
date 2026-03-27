import {CalendarCheck, Timer, UsersRound} from "lucide-react";
import {ITask} from "@/types";
import {useLang} from "@/hooks/useLang";
import PostedBy from "@/components/general-posts/posted-by";


function ParticipatingIcon({participating}: { participating: boolean }) {
    if (participating) {
        return (
            <CalendarCheck
                // title={"You are participating"}
                className={"widget-item-icon"}/>
        );
    }
}

function TaskIconParticipation({participations, min, className}: {
    participations: number,
    min: number,
    className?: string
}) {
    const isEnough: boolean = (participations / min > /*recommendedTaskParticipationsRate*/ .8);
    className = className ?? '';
    className += (!isEnough ? "bg-warning " : '');
    return (
        <span className={"widget-item-icon " + (className ?? '')}><UsersRound
            className={"size-5 "}/> {participations}/{min}</span>
    );
}


// TODO find where to put the link
export default function TaskItem({task, className = ''}: { task: ITask, className?: string }) {
    const {__} = useLang();
    console.log(task)
    return (
        <article className={"widget-item " + (className ?? '')}>
            {/* TODO add open on click and not drag, see bsky duckduckgo etc. */}
            <h3 className={"widget-item-title"}>{task.title}</h3>

            <p>{task.description}</p>
            <div className={"taskinfo mt-1 flex justify-between items-center"}>
                <time className={"pl-1 flex gap-1"}><Timer/><span
                    className={"mt-1 text-sm"}>{__('project.task.due_at', task.due_at.toString()/*.toDateString()*/)}</span></time>
                {/* TODO fix date string (or translate on a different property in the controller) */}
                <div className={"flex gap-1"}>
                    { /* TODO add PFPs of participating people */}

                    <ParticipatingIcon participating={task.self_participating}/>
                    <TaskIconParticipation participations={task.participating_users.length}
                                           min={task.min_participations}/>
                </div>
            </div>
            <PostedBy owner={task.owner}/>
        </article>
    );
}
