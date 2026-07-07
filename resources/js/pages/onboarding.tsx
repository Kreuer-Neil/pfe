import {Form, Head, usePage} from '@inertiajs/react';
import {ComponentRef, RefObject, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import UserPreferencesController from '@/actions/App/Http/Controllers/UserPreferencesController';
import OnboardingController from '@/actions/App/Http/Controllers/OnboardingController';
import CheckboxCard from '@/components/onboarding/checkbox-card';
import LocationSearch from '@/components/location-search';
import {Button} from '@/components/ui/button';
import {IUserPreferences} from '@/types';

type PageProps = {
    preferences: IUserPreferences;
    languagesList: string[];
    tagsList: string[];
};

const STEPS = ['tags', 'languages', 'location'] as const;
type Step = typeof STEPS[number];

type FormRef = ComponentRef<typeof Form>;

export default function Onboarding() {
    const {t} = useTranslation(['onboarding', 'tags', 'languages']);
    const {preferences, languagesList, tagsList} = usePage<PageProps>().props;

    const [step, setStep] = useState<Step>('tags');
    const stepIndex = STEPS.indexOf(step);

    const tagsFormRef = useRef<FormRef>(null);
    const languagesFormRef = useRef<FormRef>(null);
    const locationFormRef = useRef<FormRef>(null);

    const goToNextStep = () => {
        const nextIndex = stepIndex + 1;
        if (nextIndex < STEPS.length) {
            setStep(STEPS[nextIndex]);
        }
    };

    // Skip = revert this step's form back to its defaults (discarding any in-progress,
    // unsubmitted picks) and submit that - not just another submit button.
    const skip = (formRef: RefObject<FormRef | null>) => {
        formRef.current?.reset();
        formRef.current?.submit();
    };

    return (
        <div className="min-h-screen">
            <Head title={t('title')}/>
            <div className="max-w-xl mx-auto w-full flex flex-col gap-6 px-3 py-8">
                <div className="flex gap-1" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1}
                     aria-valuemax={STEPS.length}>
                    {STEPS.map((s, i) => (
                        <div key={s}
                             className={'h-1.5 flex-1 rounded-full ' + (i <= stepIndex ? 'bg-primary' : 'bg-secondary')}/>
                    ))}
                </div>

                {step === 'tags' && (
                    <Form ref={tagsFormRef} {...UserPreferencesController.updateTags.form()}
                          onSuccess={goToNextStep}>
                        {({processing}) => (
                            <div className="flex flex-col gap-4">
                                <h1 className="page-title">{t('tags_title')}</h1>
                                <p className="text-muted-foreground">{t('tags_description')}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {tagsList.map((tag) => (
                                        <CheckboxCard key={tag} name="tags[]" value={tag}
                                                      defaultChecked={preferences.tags.includes(tag)}>
                                            {t('tags:' + tag)}
                                        </CheckboxCard>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" disabled={processing}
                                            onClick={() => skip(tagsFormRef)}>
                                        {t('skip')}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {t('next')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                )}

                {step === 'languages' && (
                    <Form ref={languagesFormRef} {...UserPreferencesController.updateLanguages.form()}
                          onSuccess={goToNextStep}>
                        {({processing}) => (
                            <div className="flex flex-col gap-4">
                                <h1 className="page-title">{t('languages_title')}</h1>
                                <p className="text-muted-foreground">{t('languages_description')}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {languagesList.map((language) => (
                                        <CheckboxCard key={language} name="languages[]" value={language}
                                                      defaultChecked={preferences.languages.includes(language)}>
                                            {t('languages:' + language)}
                                        </CheckboxCard>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" disabled={processing}
                                            onClick={() => skip(languagesFormRef)}>
                                        {t('skip')}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {t('next')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                )}

                {step === 'location' && (
                    <Form ref={locationFormRef} {...OnboardingController.complete.form()}>
                        {({errors, processing}) => (
                            <div className="flex flex-col gap-4">
                                <h1 className="page-title">{t('location_title')}</h1>
                                <p className="text-muted-foreground">{t('location_description')}</p>
                                <LocationSearch legend={t('location_title')} errors={errors}/>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" disabled={processing}
                                            onClick={() => skip(locationFormRef)}>
                                        {t('skip')}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {t('finish')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                )}
            </div>
        </div>
    );
}