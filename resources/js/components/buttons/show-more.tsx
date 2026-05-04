import ButtonText from "@/components/buttons/button-text";
import {LucideChevronDown, LucideChevronUp} from "lucide-react";
import {useLang} from "@/hooks/useLang";

type showMoreProps = {
    showMore: boolean,
    onClick?: ((e:any) => void) | null,
}

export default function ShowMore({showMore = true, onClick = null}: showMoreProps) {
    const {__} = useLang();
    return showMore ?
        <ButtonText onClick={onClick} icon={LucideChevronDown}
                    textContent={__('pagination.show_more')}/> :
        <ButtonText onClick={onClick} icon={LucideChevronUp}
                    textContent={__('pagination.show_less')}/>
}
