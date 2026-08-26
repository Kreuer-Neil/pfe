import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, router} from "@inertiajs/react";
import {Item, ItemContent, ItemHeader, ItemMedia, ItemTitle} from "@/components/ui/item";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import ProjectIcon from "@/components/icons/project-icon";
import ConfirmModal from "@/components/modals/confirm-modal";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";
import {show as projectsShow} from "@/actions/App/Http/Controllers/ProjectController";
import ProjectPollController, {vote as votePoll} from "@/actions/App/Http/Controllers/ProjectPollController";
import {IProjectPoll, IProjectPollFeedItem} from "@/types";
import {cn} from "@/lib/utils";

export default function PollCard({poll, projectSlug, showProject = false, canManage = false, currentUserId}: {
    poll: IProjectPoll | IProjectPollFeedItem,
    projectSlug: string,
    showProject?: boolean,
    canManage?: boolean,
    currentUserId?: number,
}) {
    const {t} = useTranslation('projects');
    const {t: tDate} = useTranslation('date');

    const [selectedIds, setSelectedIds] = useState<number[]>(poll.user_choice_ids);
    const [submitting, setSubmitting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const canDelete = canManage || (currentUserId !== undefined && poll.user?.id === String(currentUserId));

    useEffect(() => {
        setSelectedIds(poll.user_choice_ids);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poll.id, poll.user_choice_ids.join(',')]);

    const canInteract = !poll.is_expired;
    const hasParticipated = poll.user_choice_ids.length > 0 || poll.user_skipped;
    const project = 'project' in poll ? poll.project : null;

    function submitVote(choiceIds: number[]) {
        setSubmitting(true);
        router.post(votePoll([projectSlug, poll.id]).url, {choice_ids: choiceIds}, {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
        });
    }

    function toggleChoice(id: number) {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((choiceId) => choiceId !== id) : [...prev, id]);
    }

    function choiceRow(choice: IProjectPoll['choices'][number]) {
        const isMine = poll.user_choice_ids.includes(choice.id);
        const inputId = `poll-${poll.id}-choice-${choice.id}`;

        return (
            <div key={choice.id}
                 className={cn(
                     "relative flex items-center gap-2 overflow-hidden rounded-md border px-3 py-2 text-sm",
                     isMine ? "border-primary" : "border-border"
                 )}
            >
                {poll.can_see_results &&
                    <div
                        className="absolute inset-y-0 left-0 bg-primary/15 transition-[width] duration-700 ease-out"
                        style={{width: `${choice.percentage}%`}}
                    />
                }
                <div className="relative flex items-center gap-2 w-full">
                    {canInteract && (poll.multi
                        ? <Checkbox id={inputId} checked={selectedIds.includes(choice.id)}
                                    onCheckedChange={() => toggleChoice(choice.id)}/>
                        : <RadioGroupItem id={inputId} value={String(choice.id)}/>
                    )}
                    {canInteract ?
                        <label htmlFor={inputId} className={cn("flex-1 cursor-pointer", isMine && "font-medium")}>
                            {choice.label}
                        </label> :
                        <span className={cn("flex-1", isMine && "font-medium")}>{choice.label}</span>
                    }
                    {poll.can_see_results &&
                        <span className="text-xs text-muted-foreground shrink-0">
                            {choice.percentage}% ({choice.count})
                        </span>
                    }
                </div>
            </div>
        );
    }

    return (
        <Item variant="outline" size="sm" className="flex-col items-stretch">
            {showProject && project &&
                <ItemHeader>
                    <Link href={projectsShow(project.slug).url} className="flex items-center gap-2 hover:underline">
                        <ItemMedia variant="icon">
                            <ProjectIcon project={project}/>
                        </ItemMedia>
                        <span className="text-sm font-medium">{project.name}</span>
                    </Link>
                    <time dateTime={poll.created_at} className="text-xs text-muted-foreground shrink-0">
                        {upcomingDateToString(laravelDateToJsDate(poll.created_at), tDate)}
                    </time>
                </ItemHeader>
            }
            <ItemContent className="gap-2 w-full">
                <div className="flex items-center gap-2">
                    <ItemTitle className="flex-1">{poll.title}</ItemTitle>
                    {poll.is_expired &&
                        <span className="text-xs text-muted-foreground shrink-0">{t('poll_closed_label')}</span>
                    }
                    {canDelete &&
                        <Button size="icon-sm" variant="ghost" onClick={() => setShowDeleteModal(true)}>
                            <span className="sr-only">{t('poll_delete_title')}</span>
                            <Trash2/>
                        </Button>
                    }
                </div>

                {poll.multi || !canInteract ?
                    <div className="flex flex-col gap-1.5">
                        {poll.choices.map((choice) => choiceRow(choice))}
                    </div> :
                    <RadioGroup
                        value={selectedIds[0] ? String(selectedIds[0]) : undefined}
                        onValueChange={(value) => setSelectedIds([Number(value)])}
                        className="gap-1.5"
                    >
                        {poll.choices.map((choice) => choiceRow(choice))}
                    </RadioGroup>
                }

                {poll.can_see_results &&
                    <p className="text-xs text-muted-foreground">
                        {t('poll_total_voters', {count: poll.total_voters})}
                    </p>
                }

                {!poll.can_see_results && !canInteract &&
                    <p className="text-xs text-muted-foreground">{t('poll_no_participation_label')}</p>
                }

                {canInteract &&
                    <div className="flex items-center justify-center gap-2">
                        <Button size="sm" disabled={selectedIds.length === 0 || submitting}
                                onClick={() => submitVote(selectedIds)}>
                            {hasParticipated ? t('poll_change_vote_button') : t('poll_vote_button')}
                        </Button>
                        <Button size="sm" variant="ghost" disabled={submitting}
                                onClick={() => submitVote([])}>
                            {poll.user_skipped ? t('poll_skipped_label') : t('poll_skip_button')}
                        </Button>
                    </div>
                }
            </ItemContent>
            {canDelete &&
                <ConfirmModal
                    id={`poll-confirm-delete-${poll.id}`}
                    showModal={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={() => setShowDeleteModal(false)}
                    formAction={ProjectPollController.destroy.form([projectSlug, poll.id])}
                    title={t('poll_delete_title')}
                    message={t('poll_delete_warning')}
                />
            }
        </Item>
    );
}
