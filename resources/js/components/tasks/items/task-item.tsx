import {CalendarCheck, Timer, UsersRound} from "lucide-react";
import {Slot} from "@radix-ui/react-slot";
import TaskIconParticipation from "@/components/tasks/items/task-icon-participation";
import {ITaskItem} from "@/types";



function ParticipatingIcon({participating}:{participating:boolean}) {
    if (participating) {
    return <CalendarCheck
        // title={"You are participating"}
        className={"widget-item-icon"}/>;
    }
}
// TODO find where to put the link
export default function TaskItem({
    title,
    description,
    time,
    href,
    participations,
    minParticipations,
    participating,
    className,
}: ITaskItem) {
    return (
        <article className={"widget-item + className"}>
            <h3 className={"widget-item-title"}>{title}</h3>
            <p>{description}</p>
            <div className={"taskinfo mt-1 flex justify-between items-center"}>
                <time className={"pl-1 flex gap-1"}><Timer/><span className={"mt-1 text-sm"}>{time}</span>
                </time>
                <div className={"flex gap-1"}>
                    { /* TODO add PFPs of participating people */ }
                    <TaskIconParticipation participations={participations} min={minParticipations} />
                    <ParticipatingIcon participating={participating} />
                </div>
            </div>
            <p className={"postinfo"}>posted by <a href={'#'} className={"underline text-blue-500"}>N</a></p>
        </article>
    );
}
