import {CalendarCheck, ClipboardPlus, Timer, UsersRound} from "lucide-react";
import {IProject, IProjectContext, ITask} from "@/types";
import {useLang} from "@/hooks/useLang";
import PostedBy from "@/components/general-posts/posted-by";
import {cn} from "@/lib/utils";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";
import {ReactNode} from "react";
import ProjectIcon from "@/components/icons/project-icon";


function ParticipatingIcon({participating}: { participating: boolean }) {
    if (participating) {
        return (
            <CalendarCheck
                // title={"You are participating"}
                className="item-tag bg-tag-valid"/>
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
            ? '' : "bg-warning text-warning-foreground";
        return (
            <span className={
                cn("item-tag",
                    colorClass,
                    className)
            }>
                {participations ?? 0}/{min}<UsersRound/>
        </span>
        );
    } else {
        return (
            <span className={
                cn("item-tag",
                    className)
            }>
                {participations ?? 0}<UsersRound/>
        </span>
        );
    }
}

function TaskTitle({isInProjectPage, project, children}: {
    children: string,
    project: IProjectContext,
    isInProjectPage: boolean
}): ReactNode {
    if (isInProjectPage)
        return (
            <h3 className="item-title w-full">{children}</h3>
        );

    return (
        <div className={'flex gap-1 justify-start items-center'}>
            <ProjectIcon project={project}/>
            <h3 className="item-title w-full">{children}</h3>
        </div>
    );
}

// TODO find where to put the link
export default function TaskItem({task, className = '', isInProjectPage = false}: {
    task: ITask,
    className?: string,
    isInProjectPage: boolean
}) {
    const {__, trans} = useLang();
    const dueAt: string = task.due_at ? upcomingDateToString(laravelDateToJsDate(task.due_at)) : __('date.no_time_limit');


    // const dueAtYear: number = dueAt.getFullYear();
    return (
        <article className={cn("thumbnail-item", className)} key={task.id.toString()}>
            {/* TODO add open on click and not drag, see bsky duckduckgo etc. */}
            <TaskTitle isInProjectPage={isInProjectPage} project={task.project}>{task.title}</TaskTitle>


            {/* TODO limit desc max length when mobile */}
            <p>{trans('projects.task.from_project', {project: task.project.name})}</p>
            <div className="taskinfo mt-1 flex flex-wrap justify-between items-center gap-1">
                {/* TODO change date format */}
                <time className="flex gap-1"><Timer/><span>{dueAt}</span>
                </time>
                {/* TODO fix date string (or translate on a different property in the controller) */}
                <div className="flex gap-1 ml-auto">
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
