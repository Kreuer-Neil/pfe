import {CalendarCheck, ClipboardPlus, Timer, UsersRound} from "lucide-react";
import {IProject, ITask} from "@/types";
import {useLang} from "@/hooks/useLang";
import PostedBy from "@/components/general-posts/posted-by";
import {cn} from "@/lib/utils";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";
import {ReactNode} from "react";


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
    min?: number | null,
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
    } else {
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

function TaskTitle({projectContext, children}: {
    children: string,
    projectContext: boolean
}): ReactNode {
    if (!projectContext)
        return (
            <h3 className={"item-title w-full"}>{children}</h3>
        );

    return (
        <div className={'flex gap-1 justify-start items-center'}>
            <div className={'size-8 rounded-full bg-container'}/>
            <h3 className={"item-title w-full"}>{children}</h3>
        </div>
    );
}

// TODO find where to put the link
export default function TaskItem({task, className = '', projectContext = false}: {
    task: ITask,
    className?: string,
    projectContext: boolean
}) {
    const {__, trans} = useLang();
    const dueAt: string = task.due_at ? upcomingDateToString(laravelDateToJsDate(task.due_at)) : __('date.no_time_limit');


    // const dueAtYear: number = dueAt.getFullYear();
    return (
        <article className={cn("task-item item-md", className)} key={task.id.toString()}>
            {/* TODO add open on click and not drag, see bsky duckduckgo etc. */}
            <TaskTitle projectContext={projectContext}>{task.title}</TaskTitle>


            {/* TODO limit desc max length when mobile */}
            <p>{trans('project.task.from_project', {project: task.project_name})}</p>
            <div className={"taskinfo mt-1 flex flex-wrap justify-between items-center gap-1"}>
                {/* TODO change date format */}
                <time className={"flex gap-1"}><Timer/><span>{dueAt}</span>
                </time>
                {/* TODO fix date string (or translate on a different property in the controller) */}
                <div className={"flex gap-1 ml-auto"}>
                    { /* TODO add PFPs of participating people */}
                    {/*<RelatedUsers/>*/}
                    <TaskIconParticipation participations={task.participating_users.length}
                                           min={task.min_participations}/>
                    <ParticipatingIcon participating={task.self_participating}/>
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
