import AppLayout from "@/layouts/app-layout";
import {Head, router, usePage} from "@inertiajs/react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import NewsItem from "@/components/general-posts/news-item";
import {IProjectNewsFeedItem} from "@/types";

type PageProps = {
    news: IProjectNewsFeedItem[];
    newsNextPage: number | null;
};

export default function Feed() {
    const {t} = useTranslation(['common', 'pagination']);
    const {news: initialNews, newsNextPage} = usePage<PageProps>().props;

    const [news, setNews] = useState<IProjectNewsFeedItem[]>(initialNews);
    const [nextPage, setNextPage] = useState<number | null>(newsNextPage);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadMore = () => {
        if (!nextPage || loadingMore) return;
        setLoadingMore(true);
        router.reload({
            data: {page: nextPage},
            only: ['news', 'newsNextPage'],
            onSuccess: (page) => {
                const props = page.props as unknown as PageProps;
                setNews((previous) => [...previous, ...props.news]);
                setNextPage(props.newsNextPage);
                setLoadingMore(false);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={t('feed')}/>
            <section className="items-section max-w-xl w-full">
                <h1 className="page-title mx-3 mb-1">{t('feed')}</h1>
                {news.length <= 0 ?
                    <p className="mx-3">{t('feed_empty')}</p> :
                    <ol className="thumbnails-list-container">
                        {news.map((item) => (
                            <li key={item.id} className="w-full">
                                <NewsItem news={item} truncate={false}/>
                            </li>
                        ))}
                    </ol>
                }
                {nextPage &&
                    <div className="flex justify-center">
                        <Button variant="ghost" size="sm" disabled={loadingMore} onClick={loadMore}>
                            {t('pagination:show_more')}
                        </Button>
                    </div>
                }
            </section>
        </AppLayout>
    );
}
