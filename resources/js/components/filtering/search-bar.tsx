import {useLang} from "@/hooks/useLang";
import {Search} from "lucide-react";
import {cn} from "@/lib/utils";
import {useTranslation} from "react-i18next";

interface SearchBarProps {
    onChange: (e: any) => void,
    data: string,

    className?: string,
    id?: string,
}

export default function SearchBar({onChange, data, className = '', id = 'search'}: SearchBarProps) {

    const {t} = useTranslation(['projects-index']);
    return (
        <label className={cn('search-box', className)}>
            <span className="sr-only">{t('search')}</span>
            <Search/>
            <input type="search" name="search" className="search-input"
                   onChange={onChange} value={data} id={id}
                   placeholder={t('search')} autoComplete="projects projects-descriptions"/>
        </label>
    );
}
