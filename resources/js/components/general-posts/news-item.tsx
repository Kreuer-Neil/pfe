import {Item, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle} from "@/components/ui/item";
import ProjectIcon from "@/components/icons/project-icon";
import {Link} from "@inertiajs/react";
import {show as projectsShow} from "@/actions/App/Http/Controllers/ProjectController";
import PostedBy from "@/components/general-posts/posted-by";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";
import {useTranslation} from "react-i18next";
import {IProjectNewsFeedItem} from "@/types";
import {cn} from "@/lib/utils";

export default function NewsItem({news, truncate = true}: { news: IProjectNewsFeedItem, truncate?: boolean }) {
    const {t: tDate} = useTranslation('date');

    const variant = truncate ? 'outline' : 'default';
    return (
        <Item variant={variant} size="sm">
            <ItemHeader>
                <Link href={projectsShow(news.project.slug).url} className="flex items-center gap-2 hover:underline">
                    <ItemMedia variant="icon">
                        <ProjectIcon project={news.project}/>
                    </ItemMedia>
                    <span className="text-sm font-medium">{news.project.name}</span>
                </Link>
                <time dateTime={news.created_at} className="text-xs text-muted-foreground shrink-0">
                    {upcomingDateToString(laravelDateToJsDate(news.created_at), tDate)}
                </time>
            </ItemHeader>
            <ItemContent>
                <ItemTitle>{news.title}</ItemTitle>
                <ItemDescription className={cn(!truncate && 'line-clamp-none')}>
                    {news.text_content}
                </ItemDescription>
                <PostedBy owner={news.author}/>
            </ItemContent>
        </Item>
    );
}
