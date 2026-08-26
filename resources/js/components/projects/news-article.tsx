import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import PostedBy from "@/components/general-posts/posted-by";
import ConfirmModal from "@/components/modals/confirm-modal";
import ProjectNewsController from "@/actions/App/Http/Controllers/ProjectNewsController";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";
import {IProjectNews} from "@/types";

export default function NewsArticle({news, projectSlug, canManage, currentUserId}: {
    news: IProjectNews,
    projectSlug: string,
    canManage: boolean,
    currentUserId: string,
}) {
    const {t} = useTranslation('projects');
    const {t: tDate} = useTranslation('date');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const canDelete = canManage || news.author?.uuid === currentUserId;

    return (
        <article className="flex flex-col gap-1">
            <div className="flex items-start gap-1">
                <h2 className="section-title mr-auto">
                    {news.title}
                </h2>
                {canDelete &&
                    <Button size="icon-sm" variant="ghost" onClick={() => setShowDeleteModal(true)}>
                        <span className="sr-only">{t('news_delete_title')}</span>
                        <Trash2/>
                    </Button>
                }
            </div>
            <p>{news.text_content}</p>
            <div className="flex items-center justify-between gap-2">
                <PostedBy owner={news.author}/>
                <time dateTime={news.created_at} className="text-xs text-muted-foreground shrink-0">
                    {upcomingDateToString(laravelDateToJsDate(news.created_at), tDate)}
                </time>
            </div>
            <ConfirmModal
                id={`news-confirm-delete-${news.id}`}
                showModal={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onSuccess={() => setShowDeleteModal(false)}
                formAction={ProjectNewsController.destroy.form([projectSlug, news.id])}
                title={t('news_delete_title')}
                message={t('news_delete_warning')}
            />
        </article>
    );
}