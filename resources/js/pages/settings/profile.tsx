import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import {send} from '@/routes/verification';
import {type BreadcrumbItem, ILangItem, type SharedData} from '@/types';
import {Transition} from '@headlessui/react';
import {Form, Head, Link, router, usePage} from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import {edit} from '@/routes/profile';
import {useTranslation} from "react-i18next";
import {LogOut} from "lucide-react";
import {lang, logout} from '@/routes';
import {useMobileNavigation} from "@/hooks/use-mobile-navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

type PageProps = {
    reload?: boolean;
}


export default function Profile({mustVerifyEmail, status, languages}: {
    mustVerifyEmail: boolean;
    status?: string;
    languages: ILangItem[];
}) {
    const {auth} = usePage<SharedData>().props;
    const {t, i18n} = useTranslation('auth');

    const {reload} = usePage<PageProps>().props;
    if (reload) {
        console.log('test')
        router.reload();
    }

    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const onLangSelect = (locale: any) => {
        document.querySelector('html')!.lang = locale;
        i18n.changeLanguage(locale).then(() =>
            router.visit(lang({query: {lang: locale}}).url, {})
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings"/>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('account_settings_title')}
                        description={t('update_email')}
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({processing, recentlySuccessful, errors}) => (
                            <>
                                {/*<div className="grid gap-2">
                                    <Label htmlFor="first_name">{t('field_first_name')}</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.first_name}
                                        name="first_name"
                                        required
                                        autoComplete="first_name"
                                        placeholder={t('field_first_name')}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.first_name}
                                    />
                                    <Label htmlFor="last_name">{t('field_last_name')}</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.last_name}
                                        name="last_name"
                                        required
                                        autoComplete="last_name"
                                        placeholder={t('field_last_name')}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.last_name}
                                    />
                                </div>*/}

                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t('field_email')}</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder={t('field_email')}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-green-600">
                                                        A new verification link has
                                                        been sent to your email
                                                        address.
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing} data-test="update-profile-button">
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <div>
                    <span className="mb-0.5">{t('lang')}</span>
                    {/* Lang string is not translated */}
                    <Select defaultValue={document.querySelector('html')?.lang} onValueChange={onLangSelect}>
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fruits</SelectLabel>
                                {languages.map((language) => {
                                    return (
                                        <SelectItem value={language.value} key={language.value}>
                                            {language.title}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>

                    </Select>
                </div>
                <Button variant="destructive" asChild onClick={handleLogout}>
                    <Link href={logout()}><LogOut/>{t('logout')}</Link>
                </Button>
                <DeleteUser/>
            </SettingsLayout>
        </AppLayout>
    );
}
