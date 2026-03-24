import AppLayout from '@/layouts/app-layout';
import {dashboard, projects as projectsIndex} from '@/routes';
import {type BreadcrumbItem, IProject, ITask} from '@/types';
import {Head} from '@inertiajs/react';
import {useLang} from "@/hooks/useLang";
import MyProjects from "@/components/sections/myProjects";
import auth from "@/actions/App/Http/Controllers/Auth";
import TaskContainer from "@/components/tasks/task-container";

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
const userTasks: ITask[] = [
    {
        id: "",
        title: "",
        description: "",
        project_id: "",
        min_participations: 9n,
        starting_at: new Date('20/03/2026'),
        due_at: new Date('20/03/2026'),
        created_at: new Date('20/03/2026'),
        updated_at: new Date('20/03/2026'),
    }
];

export default function Dashboard() {
    const {__} = useLang();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>

            {/*Tasks section*/}
            <TaskContainer level={2} tasks={userTasks}/>

            <MyProjects projects={projects}/>


            {/*<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 ">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
                    {__('dashboard.notifications')}
                </div>
            </div>*/}
        </AppLayout>
    );
}
