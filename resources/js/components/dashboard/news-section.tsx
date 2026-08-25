import {IProjectNewsFeedItem} from "@/types";
import {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "@inertiajs/react";
import {Button} from "@/components/ui/button";
import {index as feedIndex} from "@/actions/App/Http/Controllers/FeedController";
import NewsItem from "@/components/general-posts/news-item";

export default function NewsSection({news, onDismiss}: {
    news: IProjectNewsFeedItem[],
    onDismiss: () => void,
}): ReactNode {
    const {t} = useTranslation('dashboard');

    if (news.length <= 0) return null;

    return (
        <section className="items-section max-w-xl w-full">
            <div className="flex flex-wrap items-center mx-3 mb-1">
                <h2 className="section-title w-fit mr-auto">
                    {t('news')}
                </h2>
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                    {t('news_dismiss')}
                </Button>
            </div>
            <ol className="thumbnails-list-container">
                {news.map((item) => (
                    <li key={item.id} className="w-full">
                        <NewsItem news={item}/>
                    </li>
                ))}
            </ol>
            <div className="flex justify-center">
                <Button asChild variant="ghost_accent">
                    <Link href={feedIndex().url}>{t('news_view_all')}</Link>
                </Button>
            </div>
        </section>
    );
}
