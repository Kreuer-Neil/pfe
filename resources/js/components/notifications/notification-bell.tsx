import {ReactNode, useState} from "react";
import {router, usePage} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
import {Bell} from "lucide-react";
import {useEchoNotification} from "@laravel/echo-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {NotificationType} from "@/lib/notifications-enum";
import {
    IProjectMemberBannedNotificationData,
    INotification,
    ITaskDueSoonNotificationData,
    SharedData,
} from "@/types";
import {index as notificationsIndex, read as readNotification, readAll as readAllNotifications} from "@/actions/App/Http/Controllers/NotificationController";
import {show as showTask} from "@/actions/App/Http/Controllers/TaskController";
import {laravelDateToJsDate, upcomingDateToString} from "@/helpers/date";

function NotificationLabel({notification}: { notification: INotification }): ReactNode {
    const {t} = useTranslation('common');

    switch (notification.type) {
        case NotificationType.TaskDueSoon: {
            const data = notification.data as ITaskDueSoonNotificationData;
            return t('notification_task_due_soon', {title: data.task_title});
        }
        case NotificationType.ProjectMemberBanned: {
            const data = notification.data as IProjectMemberBannedNotificationData;
            return t('notification_project_member_banned', {project: data.project_name});
        }
        default:
            return null;
    }
}

export default function NotificationBell({className, variant = 'icon'}: {
    className?: string,
    variant?: 'icon' | 'nav-item',
}): ReactNode {
    const {t} = useTranslation('common');
    const {t: tDate} = useTranslation('date');
    const {auth, unreadNotificationsCount} = usePage<SharedData>().props;

    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEchoNotification<INotification>(`App.Models.User.${auth.user.id}`, (notification) => {
        setNotifications((previous) => [notification, ...previous]);
        router.reload({only: ['unreadNotificationsCount']});
    });

    const fetchNotifications = () => {
        fetch(notificationsIndex.url())
            .then((response) => response.json())
            .then((data: { notifications: INotification[] }) => setNotifications(data.notifications));
    };

    const loadNotifications = () => {
        if (loaded) return;
        setLoaded(true);
        fetchNotifications();
    };

    const markRead = (notification: INotification) => {
        if (notification.type === NotificationType.TaskDueSoon) {
            router.visit(showTask((notification.data as ITaskDueSoonNotificationData).task_id).url);
        }

        if (notification.read_at) return;

        router.patch(readNotification.url(notification.id), {}, {
            async: true,
            preserveScroll: true,
            preserveState: true,
            only: ['unreadNotificationsCount'],
            onSuccess: fetchNotifications,
        });
    };

    const markAllRead = () => {
        router.patch(readAllNotifications.url(), {}, {
            async: true,
            preserveScroll: true,
            preserveState: true,
            only: ['unreadNotificationsCount'],
            onSuccess: fetchNotifications,
        });
    };

    return (
        <DropdownMenu onOpenChange={(open) => open && loadNotifications()}>
            <DropdownMenuTrigger asChild>
                {variant === 'nav-item' ?
                    <button className={cn("nav-item w-full", className)}>
                        <Bell className="p-1"/>
                        <span>{t('notifications')}</span>
                        {unreadNotificationsCount > 0 &&
                            <Badge variant="destructive" className="ml-auto min-w-4 justify-center px-1 py-0 text-[10px]">
                                {unreadNotificationsCount}
                            </Badge>
                        }
                    </button>
                    :
                    <button className={cn("relative p-2 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-sm", className)}>
                        <span className="sr-only">{t('notifications')}</span>
                        <Bell/>
                        {unreadNotificationsCount > 0 &&
                            <Badge variant="destructive" className="absolute top-0 right-0 min-w-4 justify-center px-1 py-0 text-[10px]">
                                {unreadNotificationsCount}
                            </Badge>
                        }
                    </button>
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="p-0">{t('notifications')}</DropdownMenuLabel>
                    {unreadNotificationsCount > 0 &&
                        <button className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                onClick={markAllRead}>
                            {t('notifications_mark_all_read')}
                        </button>
                    }
                </div>
                <DropdownMenuSeparator/>
                {notifications.length === 0 ?
                    <p className="px-2 py-4 text-center text-sm text-muted-foreground">{t('notifications_empty')}</p>
                    : notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className={cn("flex flex-col items-start gap-0.5 whitespace-normal", !notification.read_at && "bg-secondary/50")}
                            onClick={() => markRead(notification)}
                        >
                            <span className="text-sm">
                                <NotificationLabel notification={notification}/>
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {upcomingDateToString(laravelDateToJsDate(notification.created_at), tDate)}
                            </span>
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}