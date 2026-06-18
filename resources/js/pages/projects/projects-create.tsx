import Layout from '@/layouts/app-layout'
import {Form, Head} from '@inertiajs/react'
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";
import ProjectController from "@/actions/App/Http/Controllers/ProjectController";
import GeneralInput from "@/components/form/general-input";
import {useState} from "react";
import Switch from "@/components/form/switch";
import Button from "@/components/buttons/button";
import InputError from "@/components/input-error";

export default function projectsCreate({}) {

    const {t} = useTranslation(['projects']);

    const [checked, setChecked] = useState<boolean>(false);

    return (
        <Layout>
            <Head title="create"/>
            <PageFlowContainer>
                <h1 className="page-title w-full px-3">{t('Create a project')}</h1>

                <Form
                    {...ProjectController.store.form()}
                    disableWhileProcessing
                    className="w-full max-w-xl px-3"
                >
                    {({ errors,}) => (
                        <>
                            <div className="flex flex-col gap-2 mt-3 pb-3 border-b-2 border-secondary-border">
                                <legend className="sr-only">{t('project_form_main_informations')}</legend>
                                {/* TODO project icon? */}
                                <GeneralInput name="name" label={t('project_form_name')}
                                              required={true}/>
                                <InputError message={errors.name}/>

                                <GeneralInput name="description" type="textarea"
                                              label={t('project_form_description')}
                                              required={true}/>
                                <InputError message={errors.description}/>

                            </div>
                            <div className="flex flex-col gap-2 mt-3 pb-3 border-b-2 border-secondary-border">
                                <legend className="sr-only">{t('settings')}</legend>

                                <p className="text-xs">{t('project_form_private_warning')}</p>
                                <Switch name="is_private" label={t('project_form_private')}
                                        isChecked={checked} setValue={setChecked}/>
                            </div>

                            <div className="flex flex-col gap-3 px-2 items-center pt-3">
                                <Button textContent={t('project_form_create')} type="submit"/>
                            </div>
                        </>
                    )}
                </Form>

            </PageFlowContainer>
        </Layout>
    )
}
