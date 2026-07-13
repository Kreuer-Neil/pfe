import AppLayout from "@/layouts/app-layout";
import {Head, router, usePage} from "@inertiajs/react";
import {IAppHeaderContext, IChatMessage, IChatRoom, IProjectContext} from "@/types";
import {useImageAsset} from "@/hooks/use-image-asset";
import {useTranslation} from "react-i18next";
import {ReactNode, useState} from "react";
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
    const {t} = useTranslation('chats');

    const [olderMessages, setOlderMessages] = useState<IChatMessage[]>([]);
    const [nextPage, setNextPage] = useState<number | null>(messagesNextPage);
    const [loadingMore, setLoadingMore] = useState(false);
    const [replyTo, setReplyTo] = useState<IChatMessage | null>(null);

    const canModerate = ['moderator', 'admin'].includes(project.user_role);

    const appHeaderContext: IAppHeaderContext = {
        contextImageSrc: useImageAsset(`projects/${project.icon}/small`),
        context: chatRoom.name ?? project.name,
    };

    const loadOlder = () => {
        if (!nextPage || loadingMore) return;
        setLoadingMore(true);
        router.reload({
            data: {page: nextPage},
            only: ['messages', 'messagesNextPage'],
            onSuccess: (page) => {
                const props = page.props as unknown as PageProps;
                setOlderMessages((previous) => [...props.messages, ...previous]);
                setNextPage(props.messagesNextPage);
                setLoadingMore(false);
            },
        });
    };

    const allMessages = [...olderMessages, ...messages];

    return (
        <AppLayout appHeaderContext={appHeaderContext} className="pt-0">
            <Head title={chatRoom.name ?? t('project_chat',{project:project.name})}/>

            {/* (project)'s chat room */}
            <h1 className="sr-only">{t('project_chat',{project:project.name})}</h1>

            <div className="items-section max-w-xl flex flex-col gap-2 h-full">
                {nextPage &&
                    <div className="flex justify-center">
                        <Button variant="ghost" size="sm" disabled={loadingMore} onClick={loadOlder}>
                            {t('load_older')}
                        </Button>
                    </div>
                }

                {allMessages.length === 0
                    ? <p className="text-center text-muted-foreground flex items-center h-full">{t('empty_message')}</p>
                    : <ul className="flex flex-col justify-end gap-2 px-3 h-full overscroll-y-auto">
                        {allMessages.map((message) => (
                            <li key={message.id}>
                                <ChatMessageItem message={message} canModerate={canModerate} onReply={setReplyTo}/>
                            </li>
                        ))}
                    </ul>
                }

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
