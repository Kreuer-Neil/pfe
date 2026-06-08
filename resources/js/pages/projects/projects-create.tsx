import Layout from '@/layouts/app-layout'
import {Form, Head, router} from '@inertiajs/react'
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";
import ProjectController, {store as projectStore} from "@/actions/App/Http/Controllers/ProjectController";
import GeneralInput from "@/components/form/general-input";
import {useState} from "react";
import {cn} from "@/lib/utils";
import Switch from "@/components/form/switch";
import {RouteQueryOptions} from "@/wayfinder";
import {IServerResponse} from "@/types";
import Button from "@/components/buttons/button";

export default function projectsCreate({}) {

    const {t} = useTranslation(['projects']);

    const [projectName, setProjectName] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [projectIsPrivate, setProjectIsPrivate] = useState(true);

    router.on('flash', (e) => {
        console.log(e.detail.flash.success);
        //@ts-ignore
        if (e.detail.flash.name) {
            setProjectName(e.detail.flash!.name as string);
            setProjectDescription(e.detail.flash!.description as string);
            // setProjectDescription(e.detail.flash!.is_private as string);
        }
    });

    return (
        <Layout>
            <Head title="create"/>
            <PageFlowContainer>
                <h1 className="page-title w-full px-3">{t('Create a project')}</h1>

                <Form
                    {...ProjectController.store.form()}
                    disableWhileProcessing
                    encType="multipart/form-data"
                    className="w-full max-w-xl px-3"
                >
                    {({processing, errors,}) => (
                        <>
                            <div className="flex flex-col gap-2 mt-3 pb-3 border-b-2 border-secondary-border">
                                <legend className="sr-only">{t('project_form_main_informations')}</legend>
                                {/* TODO project icon? */}
                                <GeneralInput name="name" label={t('project_form_name')}
                                              value={projectName} setValue={setProjectName}
                                              required={true}/>
                                {errors.name &&
                                <span className="field-error">{errors.name}</span>}

                                <GeneralInput name="description" type="textarea"
                                              label={t('project_form_description')}
                                              value={projectDescription} setValue={setProjectDescription}
                                              required={true}/>
                                {errors.description &&
                                    <span className="field-error">{errors.description}</span>}
                            </div>
                            <div className="flex flex-col gap-2 mt-3 pb-3 border-b-2 border-secondary-border">
                                <legend className="sr-only">{t('settings')}</legend>

                                <p className="text-xs">{t('project_form_private_warning')}</p>
                                <Switch name="is_private" label={t('project_form_private')}
                                        isChecked={projectIsPrivate} setValue={setProjectIsPrivate}/>
                                {errors.is_private &&
                                    <span className="field-error">{errors.is_private}</span>}
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
