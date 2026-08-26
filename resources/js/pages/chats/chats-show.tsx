import AppLayout from "@/layouts/app-layout";
import {Head, router, usePage} from "@inertiajs/react";
import {IAppHeaderContext, IChatMessage, IChatRoom, IProjectContext, SharedData} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import {useTranslation} from "react-i18next";
import {ReactNode, useEffect, useState} from "react";
import {useEcho} from "@laravel/echo-react";
import ChatMessageItem from "@/components/chats/chat-message-item";
import ChatMessageForm from "@/components/chats/chat-message-form";
import {Button} from "@/components/ui/button";

type PageProps = {
    project: IProjectContext;
    chatRoom: IChatRoom;
    messages: IChatMessage[];
    messagesNextPage: number | null;
    canPost: boolean;
}

export default function ChatsShow(): ReactNode {
    const {project, chatRoom, messages, messagesNextPage, canPost} = usePage<PageProps>().props;
    const {auth} = usePage<SharedData>().props;
    const {t} = useTranslation('chats');

    const [displayedMessages, setDisplayedMessages] = useState<IChatMessage[]>(messages);
    const [nextPage, setNextPage] = useState<number | null>(messagesNextPage);
    const [loadingMore, setLoadingMore] = useState(false);
    const [replyTo, setReplyTo] = useState<IChatMessage | null>(null);

    const canModerate = ['moderator', 'admin'].includes(project.user_role);

    const appHeaderContext: IAppHeaderContext = {
        contextImageSrc: useImageAsset(`projects/${project.icon}/small`),
        context: chatRoom.name ?? project.name,
    };

    // Switching chat rooms reuses this mounted component, so re-seed from the new room's props.
    useEffect(() => {
        setDisplayedMessages(messages);
        setNextPage(messagesNextPage);
    }, [chatRoom.id]);

    const loadOlder = () => {
        if (!nextPage || loadingMore) return;
        setLoadingMore(true);
        router.reload({
            data: {page: nextPage},
            only: ['messages', 'messagesNextPage'],
            preserveUrl: true,
            onSuccess: (page) => {
                const props = page.props as unknown as PageProps;
                setDisplayedMessages((previous) => [...props.messages, ...previous]);
                setNextPage(props.messagesNextPage);
                setLoadingMore(false);
            },
        });
    };

    const channelName = `chat.${chatRoom.id}`;

    // Broadcast payloads can't check auth(), so is_owner always comes back false - recompute it here.
    const getMessageWithOwnership = (message: IChatMessage): IChatMessage => ({
        ...message,
        is_owner: message.owner?.uuid === auth.user.uuid,
    });

    useEcho<{ message: IChatMessage }>(
        channelName,
        'MessageSentEvent',
        (e) => {
            const message = getMessageWithOwnership(e.message);
            setDisplayedMessages((previous) => [...previous, message]);
        },
        [chatRoom.id],
    );

    useEcho<{ message: IChatMessage }>(
        channelName,
        'MessageUpdatedEvent',
        (e) => {
            const message = getMessageWithOwnership(e.message);
            setDisplayedMessages((previous) => previous.map((oldMessage) => oldMessage.id === message.id ? message : oldMessage));
        },
        [chatRoom.id],
    );

    useEcho<{ message_id: string }>(
        channelName,
        'MessageDeletedEvent',
        (e) => {
            setDisplayedMessages((previous) => previous.filter((oldMessage) => oldMessage.id !== e.message_id));
        },
        [chatRoom.id],
    );

    return (
        <AppLayout appHeaderContext={appHeaderContext} className="pt-0 h-fixed">
            <Head title={chatRoom.name ?? t('project_chat', {project: project.name})}/>

            {/* (project)'s chat room */}
            <h1 className="sr-only">{t('project_chat', {project: project.name})}</h1>

            <div className="items-section h-full">


                {displayedMessages.length > 0
                    ? <ul className="flex flex-col-reverse gap-2 px-3 flex-1 overflow-y-scroll">
                        {displayedMessages.toReversed().map((message) => (
                            <li key={message.id}>
                                <ChatMessageItem message={message} canModerate={canModerate} onReply={setReplyTo}/>
                            </li>
                        ))}

                        {/* Loading more button */}
                        {nextPage &&
                            <li key="loadMore" className="flex justify-center mt-6">
                                <Button variant="ghost" size="sm" disabled={loadingMore} onClick={loadOlder}>
                                    {t('load_older')}
                                </Button>
                            </li>
                        }
                    </ul>
                    :
                    <p className="text-center text-muted-foreground flex items-center flex-1">{t('empty_message')}</p>}

                {canPost &&
                    <ChatMessageForm
                        slug={project.slug}
                        room={chatRoom.id}
                        replyTo={replyTo}
                        onCancelReply={() => setReplyTo(null)}
                    />
                }
            </div>
        </AppLayout>
    );
}
