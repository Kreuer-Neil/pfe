import {useLang} from "@/hooks/useLang";
import {Search} from "lucide-react";
import {cn} from "@/lib/utils";

interface SearchBarProps {
    onChange: (e: any) => void,
    data: string,

    className?: string,
    id?: string,
}

export default function SearchBar({onChange, data, className = '', id = 'search'}: SearchBarProps) {

    const {__} = useLang();
    return (
        <label className={cn('search-box', className)}>
            <span className="sr-only">{__('project-index.search')}</span>
            <Search/>
            <input type="search" name="search" className="search-input" onChange={onChange} value={data} id={id} autoComplete="projects projects-descriptions"/>
        </label>
    );
}
