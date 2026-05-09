import ButtonText from "@/components/buttons/button-text";
import {LucideChevronDown, LucideChevronUp} from "lucide-react";
import {useLang} from "@/hooks/useLang";
import {useTranslation} from "react-i18next";

type showMoreProps = {
    showMore: boolean,
    onClick?: ((e:any) => void),
}

export default function ShowMore({showMore = true, onClick}: showMoreProps) {
    const {t} = useTranslation('pagination');
    return showMore ?
        <ButtonText onClick={onClick} icon={LucideChevronDown}
                    textContent={t('show_more')}/> :
        <ButtonText onClick={onClick} icon={LucideChevronUp}
                    textContent={t('show_less')}/>
}
