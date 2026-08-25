import {Bookmark, BookmarkCheck} from "lucide-react";
import {Link} from "@inertiajs/react";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import {follow, unfollow} from "@/actions/App/Http/Controllers/ProjectController";

export default function FollowButton({slug, isFollowing}: { slug: string, isFollowing: boolean }) {
    const {t} = useTranslation('projects');

    return isFollowing ? (
        <Button size="icon-sm" variant="outline" asChild>
            <Link href={unfollow(slug).url}>
                <span className="sr-only">{t('following')}</span><BookmarkCheck/>
            </Link>
        </Button>
    ) : (
        <Button size="icon-sm" variant="outline" asChild>
            <Link href={follow(slug).url}>
                <span className="sr-only">{t('follow')}</span><Bookmark/>
            </Link>
        </Button>
    );
}
