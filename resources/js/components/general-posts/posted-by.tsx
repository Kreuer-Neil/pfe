import {useLang} from "@/hooks/useLang";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {IProfile} from "@/types";

export default function PostedBy({owner, className = ''}: { owner: IProfile | null, className?: string }): ReactNode {
    const {__} = useLang();
    if (!owner) return null;
    return (
        <p className={cn('posted-by', className)}>
            {__('user.posted_by') + ' '}
            <a href={owner.id} className={"text-link"}>{owner.nickname}</a>
        </p>
    );
}
