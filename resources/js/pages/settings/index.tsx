import Layout from '@/layouts/app-layout'
import {Head, Link, usePage} from '@inertiajs/react'
import {useTranslation} from "react-i18next";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {edit as editAccount} from "@/actions/App/Http/Controllers/Settings/ProfileController";
import {edit as editProfile} from "@/actions/App/Http/Controllers/UserProfileController";
import {edit as editPreferences} from "@/actions/App/Http/Controllers/UserPreferencesController";
import {edit as editNotificationPreferences} from "@/actions/App/Http/Controllers/NotificationPreferencesController";
import {Bell, ChevronRight, LucideIcon, SlidersHorizontal, User, UserPen} from "lucide-react";
import {SharedData} from "@/types";
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia} from "@/components/ui/item";

interface ISettingsLink {
    title: string;
    icon: LucideIcon;
    href: string;
    details?: string;
}

function SettingsLink({settingsLink}: { settingsLink: ISettingsLink }) {

    const Icon = settingsLink.icon;
    return (
        <Item asChild
              className="w-full"
        >
            <Link href={settingsLink.href}>
                <ItemMedia>
                    <Icon/>
                </ItemMedia>
                <ItemContent>
                    {settingsLink.title}
                    {settingsLink.details &&
                        <ItemDescription>
                            {settingsLink.details}
                        </ItemDescription>
                    }
                </ItemContent>
                <ItemActions>
                    <ChevronRight/>
                </ItemActions>
            </Link>
        </Item>
    );
}


export default function SettingsIndex({}) {
    const {auth} = usePage<SharedData>().props
    const {t} = useTranslation(['settings']);

    const settingsLinks: Array<ISettingsLink> = [
        {
            title: t('profile'),
            href: editProfile(auth.user.uuid).url,
            icon: UserPen
        },
        {
            title: t('account'),
            href: editAccount().url,
            icon: User,
            details: t('account_page_details') // Change Email, Password, ...
        },
        {
            title: t('preferences'),
            href: editPreferences().url,
            icon: SlidersHorizontal,
            details: t('preferences_page_details')
        },
        {
            title: t('preferences_notifications_title'),
            href: editNotificationPreferences().url,
            icon: Bell,
            details: t('preferences_notifications_description')
        },
    ];
    return (
        <Layout>
            <Head title="index"/>

            {/* Settings */}
            <h1>{t('title')}</h1>

            <div className="flex flex-col w-full max-w-md">
                {settingsLinks.map((link, i) => {
                    return (
                        <div key={link.title}>
                            <SettingsLink settingsLink={link}/>
                            <Separator/>
                        </div>
                    )
                })}
            </div>
        </Layout>
    )
}
