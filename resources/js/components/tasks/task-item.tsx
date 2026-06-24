import {CalendarCheck, Check, Timer, UsersRound} from "lucide-react";
import {ITask, ITaskMiniature} from "@/types";
import {cn} from "@/lib/utils";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";
import ProjectIcon from "@/components/icons/project-icon";
import {useTranslation} from "react-i18next";
import {ReactNode} from "react";
import RelatedUsers from "@/components/users/related-users";
import {Item, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle} from "@/components/ui/item";
import {Button} from "@base-ui/react";
import {Link} from "@inertiajs/react";


interface TaskItemProps {
    task: ITaskMiniature | ITask;
    className?: string;
    isNotInProjectPage: boolean;
    // taskShow: ((e:any) => void);
    onTap: (id: string) => void;
}


function ParticipatingIcon({participating}: { participating: boolean }): ReactNode {
    if (participating) {
        return (
            <CalendarCheck
                // title={"You are participating"}
                className="item-tag"/>
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
            ? 'item-tag' : 'item-tag-warning';
        return (
            <span className={
                cn(colorClass,
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


// TODO find where to put the link
export default function TaskItem(
    {
        task,
        className = '',
        isNotInProjectPage: isNotInProjectPage = false,
        // taskShow
        onTap
    }: TaskItemProps) {
    const {t} = useTranslation(['projects', 'date']);
    const dueAt: string = task.due_at ? upcomingDateToString(laravelDateToJsDate(task.due_at)) : t('date:no_time_limit');

    // const dueAtYear: number = dueAt.getFullYear();

    return (
        <Item
            key={task.id.toString()}
            variant="outline"
            asChild
            size="sm"
        >
            <Link
                // as="article"
                onClick={(e) => {
                    e.preventDefault();
                    onTap(task.id);
                }}
            >
                {isNotInProjectPage &&
                    <ItemMedia variant="icon">
                        <ProjectIcon project={task.project} className="size-6"/>
                    </ItemMedia>
                }
                <ItemContent>
                    <ItemTitle>
                        {/*<h3>*/}
                        {task.title}
                        {/*</h3>*/}
                    </ItemTitle>

                    {isNotInProjectPage &&
                        <ItemDescription>
                            {t('task_from_project', {project: task.project.name})}
                        </ItemDescription>
                    }
                    {/*
                task.owner
                    ? <PostedBy owner={task.owner}/>
                    : ''
            */}
                </ItemContent>
                <ItemFooter>
                    <span className="flex gap-1"><Timer/><time dateTime={task.due_at}>{dueAt}</time></span>
                    <div className="flex gap-1 ml-auto">
                        <RelatedUsers profiles={task.related_users}/>
                        <TaskIconParticipation participations={task.participations_count}
                                               min={task.min_participations}/>
                        <ParticipatingIcon participating={task.self_participating}/>
                        {task.validated &&
                            <Check className="item-tag"/>}
                    </div>
                </ItemFooter>
            </Link>

        </Item>
    );
}
