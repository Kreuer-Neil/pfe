import {Form} from "@inertiajs/react";
import ChatMessagesController from "@/actions/App/Http/Controllers/ChatMessagesController";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import InputError from "@/components/input-error";
import {IChatMessage} from "@/types";
import {useTranslation} from "react-i18next";
import {SendHorizontal, X} from "lucide-react";
import {ReactNode} from "react";

export default function ChatMessageForm({slug, room, replyTo, onCancelReply}: {
    slug: string;
    room: string;
    replyTo: IChatMessage | null;
    onCancelReply: () => void;
}): ReactNode {
    const {t} = useTranslation('chats');

    return (
        <Form
            {...ChatMessagesController.store.form({slug, room})}
            resetOnSuccess
            onSuccess={onCancelReply}
            className="flex flex-col gap-1 border-t border-border px-3 pt-2"
        >
            {({errors, processing}) => (
                <>
                    {replyTo &&
                        <div className="flex items-center gap-2 rounded bg-card px-2 py-1 text-xs text-muted-foreground">
                            <span className="flex-1 truncate">
                                {t('replying_to', {name: replyTo.owner?.nickname ?? t('deleted_user')}) + ': ' + replyTo.content}
                            </span>
                            <button type="button" onClick={onCancelReply}>
                                <span className="sr-only">{t('reply_cancel')}</span>
                                <X className="size-3"/>
                            </button>
                        </div>
                    }
                    <input type="hidden" name="chat_message_id" value={replyTo?.id ?? ''}/>
                    <div className="flex items-end gap-2">
                        <Textarea
                            name="content"
                            id="content"
                            placeholder={t('form_placeholder')}
                            required
                            autoFocus
                            rows={1}
                            className="flex-1 min-h-10 resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                    e.preventDefault();
                                    e.currentTarget.form?.requestSubmit();
                                }
                            }}
                        />
                        <Button type="submit" size="icon" disabled={processing}>
                            <span className="sr-only">{t('send')}</span>
                            <SendHorizontal/>
                        </Button>
                    </div>
                    <InputError message={errors.content ?? errors.chat_message_id}/>
                </>
            )}
        </Form>
    );
}
