import Layout from '@/layouts/app-layout'
import {Head} from '@inertiajs/react'
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";
import {store as projectStore} from "@/actions/App/Http/Controllers/ProjectController";
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

    const [storeResponse, setStoreResponse] = useState<IServerResponse | undefined>({
        success: false,
        error: {key: '', params: {}}
    });

    const store = (e: any) => {
        e.preventDefault();

        console.log('test');
        async function storeProject() {
            try {
                const queryOptions: RouteQueryOptions = {
                    query: {
                        "name": projectName,
                        "description": projectDescription,
                        "is_private": projectIsPrivate,
                    }
                }
                const response = await fetch(projectStore(queryOptions).url);
                const data: IServerResponse = await response.json();
                return data;
            } catch (error) {
                console.error(error);
            }
        }

        storeProject().then((data) => {
            setStoreResponse(data);
        });
    }
    return (
        <Layout>
            <Head title="create"/>
            <PageFlowContainer>
                <h1 className="page-title w-full px-3">{t('Create a project')}</h1>

                <form action={projectStore().url} method="GET" onSubmit={store} className="w-full max-w-3xl px-3">

                    <fieldset className="flex flex-col gap-2 mt-3 pb-3 border-b-2 border-secondary-border">
                        <legend className="sr-only">{t('project_form_main_informations')}</legend>
                        {/* TODO project icon */}
                        <GeneralInput name="name" label={t('project_form_name')}
                                      value={projectName} setValue={setProjectName}
                                      required={true} validationRules={["min-6"]}/>

                        <GeneralInput name="description" type="textarea" label={t('project_form_description')}
                                      value={projectDescription} setValue={setProjectDescription}
                                      required={true} validationRules={["min-6"]}/>
                    </fieldset>
                    <fieldset className="flex flex-col gap-2 mt-3 pb-3 border-b-2 border-secondary-border">
                        <legend className="sr-only">{t('settings')}</legend>

                        <p className="text-xs">{t('project_form_private_warning')}</p>
                        <Switch label={t('project_form_private')}
                                isChecked={projectIsPrivate} setValue={setProjectIsPrivate}/>
                    </fieldset>

                    <div className="flex flex-col gap-3 px-2 items-center pt-3">
                        {/*<Button textContent={t('project_form_create')} type="submit"/>*/}
                        {storeResponse?.error ? <span
                            className={storeResponse.success ? 'field-success' : 'field-error' + ' -mt-2'}>{t('errors:' + storeResponse.error.key, storeResponse.error.params)}</span> : null}
                    </div>
                </form>

            </PageFlowContainer>
        </Layout>
    )
}
