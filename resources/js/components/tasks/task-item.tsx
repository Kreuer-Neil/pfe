import {CalendarCheck, CalendarClock, Timer, UsersRound} from "lucide-react";
import {IProjectContext, ITask, ITaskMiniature} from "@/types";
import {cn} from "@/lib/utils";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";
import {ReactNode, useState} from "react";
import ProjectIcon from "@/components/icons/project-icon";
import {useTranslation} from "react-i18next";
import ModalCast from "@/components/modals/modal-cast";
import ModalSection from "@/components/modals/modal-section";
import {show as tasksShow} from "@/actions/App/Http/Controllers/TaskController";
import ReactModal from "react-modal";


interface TaskItemProps {
    task: ITaskMiniature | ITask;
    className?: string;
    isInProjectPage: boolean;
    // taskShow: ((e:any) => void);
    onTap: (id: string) => void;
}


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
export default function TaskItem(
    {
        task,
        className = '',
        isInProjectPage = false,
        // taskShow
        onTap
    }: TaskItemProps) {
    const {t} = useTranslation(['projects', 'date']);
    const dueAt: string = task.due_at ? upcomingDateToString(laravelDateToJsDate(task.due_at)) : t('date:no_time_limit');

    // const dueAtYear: number = dueAt.getFullYear();

    const [showModal, setShowModal] = useState<boolean>(false);


    return (
        <article className={cn("thumbnail-item", className)} tabIndex={0} key={task.id.toString()}
                 onClick={() => onTap(task.id)}
        >
            {/* TODO add open on click and not drag, see bsky duckduckgo etc. */}
            <TaskTitle isInProjectPage={isInProjectPage}
                       project={task.project}>{task.title}</TaskTitle>


            <p>{t('task_from_project', {project: task.project.name})}</p>
            <div className="taskinfo mt-1 flex flex-wrap justify-between items-center gap-1">
                <time className="flex gap-1"><Timer/><span>{dueAt}</span>
                </time>
                <div className="flex gap-1 ml-auto">
                    { /* TODO add PFPs of participating people */}
                    {/*<RelatedUsers/>*/}
                    <TaskIconParticipation participations={task.participations_count}
                                           min={task.min_participations}/>
                    <ParticipatingIcon participating={task.self_participating}/>
                </div>
            </div>
            {/*
                task.owner
                    ? <PostedBy owner={task.owner}/>
                    : ''
            */}
        </article>
    );
}
