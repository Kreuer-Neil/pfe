import AppLayout from '@/layouts/app-layout';
import {dashboard} from '@/routes';
import {type BreadcrumbItem, IProject, IDashboardProject, ITask, IUser, SharedData} from '@/types';
import {Head, usePage} from '@inertiajs/react';
import {useLang} from "@/hooks/useLang";
import MyProjects from "@/components/sections/myProjects";
import TaskDisplay from "@/components/tasks/task-display";
import PageFlowContainer from "@/components/page-flow-container";
import Button from "@/components/buttons/button";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];


type PageProps = {
    userProjects: IDashboardProject[],
    tasks: ITask[],
};
export default function Dashboard() {
    const {userProjects, tasks} = usePage<PageProps>().props;
    const {auth} = usePage<SharedData>().props;
    const currentUser = auth.user;
    const {__, trans} = useLang();

    currentUser.nickname = currentUser.nickname ?? `${currentUser.firstName} ${currentUser.lastName}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard"/>
            <PageFlowContainer>
                {/* TODO if first connection, use simple welcome text? */}
                <p className={'mx-3'}>{trans('dashboard.welcome_back', {name: currentUser.nickname})}</p>

                <section className="bg-red-50">
                    <h2>{__('dashboard.notifications')}</h2>
                </section>

                {/*Tasks section*/}
                <TaskDisplay level={2} tasks={tasks} isInProjectPage={false}/>
                {/* TODO setup absence feature (do not disturb-like)
                <Button as={"a"} textContent={__('project.get_absent')} type="warning" className="-mt-4"/>*/}

                <MyProjects projects={userProjects}/>


                {/*<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 ">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
                    {__('dashboard.notifications')}
                </div>
            </div>*/}
            </PageFlowContainer>
        </AppLayout>
    );
}
