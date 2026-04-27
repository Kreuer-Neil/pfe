import {CalendarCheck, Timer, UsersRound} from "lucide-react";
import {ITask} from "@/types";
import {useLang} from "@/hooks/useLang";
import PostedBy from "@/components/general-posts/posted-by";
import {cn} from "@/lib/utils";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";


function ParticipatingIcon({participating}: { participating: boolean }) {
    if (participating) {
        return (
            <CalendarCheck
                // title={"You are participating"}
                className={"task-icon"}/>
        );
    }
}

function TaskIconParticipation({participations, min, className = ''}: {
    participations: number,
    min?: number|null,
    className?: string
}) {
    if (min) {
        const colorClass: string = (participations / min > /*recommendedTaskParticipationsRate*/ .8)
            ? 'bg-primary' : "bg-warning text-warning-foreground";
        return (
            <span className={
                cn("task-icon",
                    colorClass,
                    className)
            }>
                {participations ?? 0}/{min}&nbsp;<UsersRound/>
        </span>
        );
    }
    else {
        return (
            <span className={
                cn("task-icon bg-card",
                    className)
            }>
                {participations ?? 0}&nbsp;<UsersRound/>
        </span>
        );
    }
}


// TODO find where to put the link
export default function TaskItem({task, className = ''}: { task: ITask, className?: string }) {
    const {__} = useLang();
    const dueAt: string = task.due_at ? upcomingDateToString(laravelDateToJsDate(task.due_at)): __('date.no_time_limit');
    // const dueAtYear: number = dueAt.getFullYear();
    return (
        <article className={cn("task-item item-md", className)} key={task.id.toString()}>
            {/* TODO add open on click and not drag, see bsky duckduckgo etc. */}
            <h3 className={"item-title"}>{task.title}</h3>

            {/* TODO limit desc max length when mobile */}
            <p>{task.description}</p>
            <div className={"taskinfo mt-1 flex justify-between items-center"}>
                {/* TODO change date format */}
                <time className={"pl-1 flex gap-1"}><Timer/><span
                    className={"mt-1 text-sm"}>{dueAt}</span>
                </time>
                {/* TODO fix date string (or translate on a different property in the controller) */}
                <div className={"flex gap-1"}>
                    { /* TODO add PFPs of participating people */}
                    {/*<RelatedUsers/>*/}
                    <ParticipatingIcon participating={task.self_participating}/>
                    <TaskIconParticipation participations={task.participating_users.length}
                                           min={task.min_participations}/>
                </div>
            </div>
            {
                task.owner
                    ? <PostedBy owner={task.owner}/>
                    : ''
            }
        </article>
    );
}
