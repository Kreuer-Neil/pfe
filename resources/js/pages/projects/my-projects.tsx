import Layout from '@/layouts/app-layout'
import {Head, Link, usePage} from '@inertiajs/react'
import {useTranslation} from "react-i18next";
import MyProjects from "@/components/dashboard/my-projects";
import {IDashboardProject} from "@/types";
import {Button} from "@/components/ui/button";
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
            <h1 className="page-title px-3 mx-auto max-w-xl">{t('common:my_projects')}</h1>

            <MyProjects projects={projects}/>

            <div className="flex flex-col gap-3 px-3 w-full items-center">
                <Button variant="ghost_accent" asChild>
                    <Link href={projectCreate().url}><Plus/>{t('create_project')}</Link>
                </Button>
            </div>
        </Layout>
    )
}
