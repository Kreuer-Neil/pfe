import {Bookmark, BookmarkCheck} from "lucide-react";
import {Form} from "@inertiajs/react";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import {follow, unfollow} from "@/actions/App/Http/Controllers/ProjectController";

export default function FollowButton({slug, isFollowing}: { slug: string, isFollowing: boolean }) {
    const {t} = useTranslation('projects');

    return isFollowing ? (
        <Form {...unfollow.form(slug)}>
            <Button size="icon-sm" variant="outline">
                <span className="sr-only">{t('following')}</span><BookmarkCheck/>
            </Button>
        </Form>
    ) : (
        <Form {...follow.form(slug)}>
            <Button size="icon-sm" variant="outline">
                <span className="sr-only">{t('follow')}</span><Bookmark/>
            </Button>
        </Form>
    );
}
