import AppLayout from '@/layouts/app-layout';
import {dashboard, projects as projectsIndex} from '@/routes';
import {type BreadcrumbItem, IProject} from '@/types';
import {Head} from '@inertiajs/react';
import {useLang} from "@/hooks/useLang";
import MyProjects from "@/components/sections/myProjects";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Projects',
        href: projectsIndex().url,
    },
];
const projects: IProject[] = [];

export default function Dashboard() {
    const {__} = useLang()
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>

            {/*Tasks section*/}

            <MyProjects projects={projects}/>


            {/*<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 ">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
                    {__('dashboard.notifications')}
                </div>
            </div>*/}
        </AppLayout>
    );
}
