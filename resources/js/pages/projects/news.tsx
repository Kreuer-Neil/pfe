import AppLayout from "@/layouts/app-layout";
import {Head, Link, router, usePage} from "@inertiajs/react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Newspaper} from "lucide-react";
import {show as projectsShow} from "@/actions/App/Http/Controllers/ProjectController";
import NewsArticle from "@/components/projects/news-article";
import NewsCreateModal from "@/components/projects/news-create-modal";
import {IProjectContext, IProjectNews, SharedData} from "@/types";

type PageProject = IProjectContext & { can_create_news: boolean };

type PageProps = {
    project: PageProject;
    news: IProjectNews[];
    newsNextPage: number | null;
};

export default function ProjectNewsIndex() {
    const {t} = useTranslation(['projects', 'pagination']);
    const {project, news: initialNews, newsNextPage} = usePage<PageProps>().props;
    const {auth} = usePage<SharedData>().props;

    const [news, setNews] = useState<IProjectNews[]>(initialNews);
    const [nextPage, setNextPage] = useState<number | null>(newsNextPage);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

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
            <Head title={project.name}/>
            <section className="items-section max-w-xl w-full">
                <div className="flex items-center gap-2 mx-3 mb-1">
                    <Button asChild variant="ghost" size="icon-sm">
                        <Link href={projectsShow(project.slug).url}>
                            <span className="sr-only">{t('show_project')}</span>
                            <ArrowLeft/>
                        </Link>
                    </Button>
                    <h1 className="page-title mr-auto">{project.name}</h1>
                    {project.can_create_news &&
                        <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>
                            <Newspaper/>
                            {t('news_create_title')}
                        </Button>
                    }
                </div>

                {news.length <= 0 ?
                    <p className="mx-3">{t('news_none')}</p> :
                    <ul className="flex flex-col gap-4 px-3">
                        {news.map((item) => (
                            <li key={item.id}>
                                <NewsArticle news={item} projectSlug={project.slug}
                                             canManage={project.can_create_news} currentUserId={auth.user.id}/>
                            </li>
                        ))}
                    </ul>
                }

                {nextPage &&
                    <div className="flex justify-center">
                        <Button variant="ghost" size="sm" disabled={loadingMore} onClick={loadMore}>
                            {t('pagination:show_more')}
                        </Button>
                    </div>
                }
            </section>

            {project.can_create_news &&
                <NewsCreateModal showModal={showCreateModal} setShowModal={setShowCreateModal} slug={project.slug}/>
            }
        </AppLayout>
    );
}