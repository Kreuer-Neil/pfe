import {useLang} from "@/hooks/useLang";
import {ReactNode} from "react";
import {User} from "@/types";
import {cn} from "@/lib/utils";

export default function PostedBy({user, className = ''}: { user: User, className?: string }): ReactNode {

    const {__} = useLang();
    return (
        <p className={cn('posted-by', className)}>{__('posted_by') + ' '}<a href={UserProfile(user.profile.slug)}
                                                                          className={"underline text-blue-500"}>{user.profile.name}</a>
        </p>
    );
}
