import {useLang} from "@/hooks/useLang";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {IProfile} from "@/types";
import {useTranslation} from "react-i18next";

export default function PostedBy({owner, className = ''}: { owner: IProfile | null, className?: string }): ReactNode {
    const {t} = useTranslation('projects');
    if (!owner) return null;
    return (
        <p className={cn('posted-by', className)}>
            {t('posted_by') + ' '}
            {/* TODO fix link */}
            <a href={'#' /*owner.id*/} className={"text-link hover:underline"}>{owner.nickname}</a>
        </p>
    );
}
