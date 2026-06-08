import Layout from '@/layouts/app-layout'
import {Head, usePage} from '@inertiajs/react'
import PageFlowContainer from "@/components/page-flow-container";
import {useTranslation} from "react-i18next";
import MyProjects from "@/components/dashboard/my-projects";
import {IDashboardProject} from "@/types";
import Button from "@/components/buttons/button";
import ButtonText from "@/components/buttons/button-text";
import {Plus} from "lucide-react";
import {create as projectCreate} from "@/actions/App/Http/Controllers/ProjectController";


type PageProps = {
    projects: IDashboardProject[];
}

export default function myProjects({}) {

    const {projects} = usePage<PageProps>().props;

    const {t} = useTranslation(['projects', 'common']);
    return (
        <Layout>
            <Head title="my-projects"/>
            <PageFlowContainer>
                <h1 className="page-title px-3">{t('common:my_projects')}</h1>

                <MyProjects projects={projects}/>

                <div className="flex flex-col gap-3 px-3 w-full items-center">
                    <ButtonText textContent={t('create_project')} icon={Plus} href={projectCreate().url}/>
                </div>
            </PageFlowContainer>
        </Layout>
    )
}
