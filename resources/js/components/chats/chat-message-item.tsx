import {IChatMessage} from "@/types";
import {Item, ItemContent, ItemFooter, ItemMedia} from "@/components/ui/item";
import UserAvatar from "@/components/users/user-avatar";
import {Button} from "@/components/ui/button";
import {Check, CornerUpLeft, PencilLine, Trash2, X} from "lucide-react";
import {useTranslation} from "react-i18next";
import {ReactNode, useState} from "react";
import {Form} from "@inertiajs/react";
import ChatMessagesController from "@/actions/App/Http/Controllers/ChatMessagesController";
import InputError from "@/components/input-error";
import {Textarea} from "@/components/ui/textarea";
import {ButtonGroup} from "@/components/ui/button-group";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";

export default function ChatMessageItem({message, canModerate, onReply}: {
    message: IChatMessage;
    canModerate: boolean;
    onReply: (message: IChatMessage) => void;
}): ReactNode {
    const {t} = useTranslation(['chats', 'date']);
    const [isEditing, setIsEditing] = useState(false);

    const canDelete = message.is_owner || canModerate;
    const formId = `update-message-${message.id}-form`;
    const createdAt = upcomingDateToString(laravelDateToJsDate(message.created_at));

    return (
        <Item size="sm" id={`message-${message.id}`} className="chat-item">
            <ItemMedia>
                {message.owner
                    ? <UserAvatar user={message.owner}/>
                    : <div className="size-8 shrink-0 rounded-full bg-secondary"/>}
            </ItemMedia>
            <ItemContent>
                {/* TODO fix reply style later */}
                {message.reply_to &&
                    <a href={`#message-${message.reply_to.id}`}
                       className="block truncate rounded border-l-2 border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                    >
                        {(message.reply_to.owner?.nickname ?? t('deleted_user')) + ': ' + message.reply_to.content}
                    </a>
                }
                {isEditing ?
                    <Form
                        id={formId}
                        {...ChatMessagesController.update.form(message.id)}
                        resetOnSuccess
                        onSuccess={() => setIsEditing(false)}
                    >
                        {({errors}) => (
                            <>
                                <Textarea
                                    name="content"
                                    id={`content-${message.id}`}
                                    defaultValue={message.content}
                                    autoFocus
                                    required
                                />
                                <InputError message={errors.content}/>
                            </>
                        )}
                    </Form>
                    : <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
                }
            </ItemContent>
            <ItemFooter className="text-xs text-muted-foreground">
                <span>{message.owner?.nickname ?? t('deleted_user')}</span>
                <time dateTime={message.created_at}>{createdAt}</time>
                {message.edited && <span>{t('edited')}</span>}
            </ItemFooter>
            <ButtonGroup className="chat-actions">
                {!isEditing &&
                    <Button size="icon-sm" variant="ghost" onClick={() => onReply(message)}>
                        <span className="sr-only">{t('reply')}</span>
                        <CornerUpLeft/>
                    </Button>
                }
                {message.is_owner &&
                    (isEditing
                            ? <>
                                <Button key="save" size="icon-sm" type="submit" form={formId}>
                                    <span className="sr-only">{t('common:save_changes')}</span>
                                    <Check/>
                                </Button>
                                <Button key="cancel" size="icon-sm" variant="ghost" onClick={() => setIsEditing(false)}>
                                    <span className="sr-only">{t('edit_cancel')}</span>
                                    <X/>
                                </Button>
                            </>
                            : <Button size="icon-sm" variant="ghost" onClick={() => setIsEditing(true)}>
                                <span className="sr-only">{t('edit')}</span>
                                <PencilLine/>
                            </Button>
                    )
                }
                {canDelete && !isEditing &&
                    <Form {...ChatMessagesController.destroy.form(message.id)}>
                        {() => (
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                type="submit"
                                className="text-danger hover:bg-red-200 rounded-l-none"
                                onClick={(e) => {
                                    if (!confirm(t('delete_warning_message'))) e.preventDefault();
                                }}
                            >
                                <span className="sr-only">{t('delete')}</span>
                                <Trash2/>
                            </Button>
                        )}
                    </Form>
                }
            </ButtonGroup>
        </Item>
    );
}
