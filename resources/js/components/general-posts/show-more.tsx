import {LucideChevronDown, LucideChevronUp} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";

type showMoreProps = {
    showMore: boolean,
    onClick?: ((e:any) => void),
}

export default function ShowMore({showMore = true, onClick}: showMoreProps) {
    const {t} = useTranslation('pagination');
    return showMore ?
        <Button variant="ghost_accent" onClick={onClick}><LucideChevronDown/>{t('show_more')}</Button> :
        <Button variant="ghost_accent" onClick={onClick}><LucideChevronUp/>{t('show_less')}</Button>
}
