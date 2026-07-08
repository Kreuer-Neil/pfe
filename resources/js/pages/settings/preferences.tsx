import UserPreferencesController from '@/actions/App/Http/Controllers/UserPreferencesController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LocationSearch from '@/components/location-search';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import {type BreadcrumbItem, IUserPreferences} from '@/types';
import {Transition} from '@headlessui/react';
import {Form, Head, usePage} from '@inertiajs/react';
import {Fragment, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {edit} from '@/routes/preferences';
import {Button} from '@/components/ui/button';
import {Field} from '@/components/ui/field';
import {Label} from '@/components/ui/label';
import {
    Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput,
    ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList,
    ComboboxValue, useComboboxAnchor
} from '@/components/ui/combobox';
import {Separator} from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Preferences settings',
        href: edit().url,
    },
];

type PageProps = {
    preferences: IUserPreferences;
    languagesList: string[];
    tagsList: string[];
}

export default function Preferences() {
    const {t} = useTranslation(['settings', 'tags', 'languages', 'common']);
    const {preferences, languagesList, tagsList} = usePage<PageProps>().props;

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(preferences.languages);
    const languagesAnchor = useComboboxAnchor();

    const [selectedTags, setSelectedTags] = useState<string[]>(preferences.tags);
    const tagsAnchor = useComboboxAnchor();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('preferences')}/>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('preferences_languages_title')}
                        description={t('preferences_languages_description')}
                    />

                    <Form
                        {...UserPreferencesController.updateLanguages.form()}
                        options={{preserveScroll: true}}
                        className="space-y-6"
                    >
                        {({errors, processing, recentlySuccessful}) => (
                            <>
                                <Field>
                                    <Label>{t('preferences_languages_title')}</Label>
                                    <Combobox
                                        multiple
                                        autoHighlight
                                        items={languagesList}
                                        itemToStringLabel={(language: string) => t('languages:' + language)}
                                        value={selectedLanguages}
                                        onValueChange={(values: string[]) => setSelectedLanguages(values ?? [])}
                                    >
                                        <ComboboxChips ref={languagesAnchor} className="w-full max-w-xs">
                                            <ComboboxValue>
                                                {(values) => (
                                                    <Fragment>
                                                        {values.map((value: string) => (
                                                            <ComboboxChip key={value}>{t('languages:' + value)}</ComboboxChip>
                                                        ))}
                                                        <ComboboxChipsInput/>
                                                    </Fragment>
                                                )}
                                            </ComboboxValue>
                                        </ComboboxChips>
                                        <ComboboxContent anchor={languagesAnchor}>
                                            <ComboboxEmpty>{t('common:multiselect_no_items')}</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item} value={item}>
                                                        {t('languages:' + item)}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    {selectedLanguages.map((language, i) => (
                                        <input key={language} type="hidden" name={'languages.' + i} value={language}/>
                                    ))}
                                    <InputError message={errors.languages}/>
                                </Field>

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

                <Separator/>

                <div className="space-y-6">
                    <HeadingSmall
                        title={t('preferences_tags_title')}
                        description={t('preferences_tags_description')}
                    />

                    <Form
                        {...UserPreferencesController.updateTags.form()}
                        options={{preserveScroll: true}}
                        className="space-y-6"
                    >
                        {({errors, processing, recentlySuccessful}) => (
                            <>
                                <Field>
                                    <Label>{t('preferences_tags_title')}</Label>
                                    <Combobox
                                        multiple
                                        autoHighlight
                                        items={tagsList}
                                        itemToStringLabel={(tag: string) => t('tags:' + tag)}
                                        limit={7}
                                        value={selectedTags}
                                        onValueChange={(values: string[]) => setSelectedTags(values ?? [])}
                                    >
                                        <ComboboxChips ref={tagsAnchor} className="w-full max-w-xs">
                                            <ComboboxValue>
                                                {(values) => (
                                                    <Fragment>
                                                        {values.map((value: string) => (
                                                            <ComboboxChip key={value}>{t('tags:' + value)}</ComboboxChip>
                                                        ))}
                                                        <ComboboxChipsInput/>
                                                    </Fragment>
                                                )}
                                            </ComboboxValue>
                                        </ComboboxChips>
                                        <ComboboxContent anchor={tagsAnchor}>
                                            <ComboboxEmpty>{t('common:multiselect_no_items')}</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item} value={item}>
                                                        {t('tags:' + item)}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    {selectedTags.map((tag, i) => (
                                        <input key={tag} type="hidden" name={'tags.' + i} value={tag}/>
                                    ))}
                                    <InputError message={errors.tags}/>
                                </Field>

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

                <Separator/>

                <div className="space-y-6">
                    <Form
                        {...UserPreferencesController.updateLocation.form()}
                        options={{preserveScroll: true}}
                        className="space-y-6"
                    >
                        {({errors, processing, recentlySuccessful}) => (
                            <>
                                <LocationSearch
                                    legend={t('preferences_location_title')}
                                    initialPlace={preferences.place}
                                    errors={errors}
                                />

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