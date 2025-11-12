import {UsersRound} from "lucide-react";


export default function TaskIconParticipation({participations, min, className}: { participations: bigint, min: bigint, className?: string }) {
    const isEnough:boolean = (participations/min > /*recommendedTaskParticipationsRate*/ .8);
    className = className??'';
    className += (!isEnough ? "bg-warning":'');
    return (
        <span className={"widget-item-icon " + (className??'')}><UsersRound className={"size-5"}/> {participations}/{min}</span>
    );
}
