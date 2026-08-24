import NotificationPreferencesController from '@/actions/App/Http/Controllers/NotificationPreferencesController';
import HeadingSmall from '@/components/heading-small';
import {Button} from '@/components/ui/button';
import {Field, FieldGroup} from '@/components/ui/field';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import {edit} from '@/routes/notification-preferences';
import {type BreadcrumbItem, type INotificationPreference} from '@/types';
import {Transition} from '@headlessui/react';
import {Form, Head, usePage} from '@inertiajs/react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification settings',
        href: edit().url,
    },
];

type PageProps = {
    preferences: INotificationPreference[];
}

export default function NotificationPreferences() {
    const {t} = useTranslation(['settings', 'common']);
    const {preferences} = usePage<PageProps>().props;

    const [values, setValues] = useState<INotificationPreference[]>(preferences);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('preferences_notifications_title')}/>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('preferences_notifications_title')}
                        description={t('preferences_notifications_description')}
                    />

                    <Form
                        {...NotificationPreferencesController.update.form()}
                        options={{preserveScroll: true}}
                        className="space-y-6"
                    >
                        {({processing, recentlySuccessful}) => (
                            <>
                                <FieldGroup>
                                    {values.map((preference, i) => (
                                        <Field key={preference.type} orientation="horizontal">
                                            <Label>{t('notification_type_' + preference.type)}</Label>
                                            <Switch
                                                checked={preference.email_enabled}
                                                onCheckedChange={(checked) =>
                                                    setValues((current) =>
                                                        current.map((value, j) =>
                                                            j === i ? {...value, email_enabled: checked} : value
                                                        )
                                                    )
                                                }
                                            />
                                            <input type="hidden" name={'preferences.' + i + '.type'} value={preference.type}/>
                                            <input type="hidden" name={'preferences.' + i + '.email_enabled'} value={preference.email_enabled ? '1' : '0'}/>
                                        </Field>
                                    ))}
                                </FieldGroup>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>{t('common:save_changes')}</Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-700">{t('common:changes_saved')}</p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}